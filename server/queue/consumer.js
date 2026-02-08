import { getChannel } from './rabbitmq.js';
import { QUEUES } from './queues-contants.js';
import { Notice } from '../models/Notice.model.js';
import { NotificationFactory } from '../notifications/Notification.factory.js';

export const startNotificationWorker = async () => {
  // 1. Lấy channel RabbitMQ
  const ch = await getChannel();

  // 2. Đảm bảo queue tồn tại
  await ch.assertQueue(QUEUES.NOTIFICATION, { durable: true });

  // 3. prefetch(5):
  // - Mỗi worker chỉ xử lý tối đa 5 message cùng lúc
  // - Tránh overload (gửi mail hàng loạt)
  ch.prefetch(5);

  // 4. Bắt đầu lắng nghe message từ queue
  ch.consume(QUEUES.NOTIFICATION, async (msg) => {
    if (!msg) return;

    // 5. Parse message
    const { noticeId } = JSON.parse(msg.content.toString());

    try {
      /**
       * 6. LOCK logic bằng DB
       * Chỉ xử lý notice có status = PENDING
       * → Tránh:
       * - xử lý trùng
       * - nhiều worker đụng nhau
       */
      const notice = await Notice.findOneAndUpdate(
        { _id: noticeId, status: 'PENDING' },
        { status: 'PROCESSING' },
        { new: true }
      );

      // Nếu không tìm thấy (đã xử lý / bị cancel)
      if (!notice) {
        ch.ack(msg); // xác nhận message đã xong
        return;
      }

      // 7. Tạo service theo audience + channel
      const service = NotificationFactory.create(notice);

      // 8. Gửi notification (mail / system)
      await service.send();

      // 9. Đánh dấu DONE
      notice.status = 'DONE';
      await notice.save();

      // 10. ACK message
      // → RabbitMQ xóa message khỏi queue
      ch.ack(msg);

    } catch (err) {
      // 11. Nếu lỗi
      await Notice.findByIdAndUpdate(noticeId, {
        status: 'FAILED',
        error: err.message
      });

      console.error('❌ Notification failed:', err.message);

      /**
       * 12. ACK dù bị lỗi
       * → KHÔNG retry
       * → Tránh vòng lặp vô hạn
       *
       * Nếu muốn retry / DLQ thì logic sẽ khác
       */
      ch.ack(msg);
    }
  });
};
