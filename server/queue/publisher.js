import { getChannel } from './rabbitmq.js';
import { QUEUES } from './queues-contants.js';

export const publishNotification = async (noticeId) => {
  // 1. Lấy channel đã connect tới RabbitMQ
  const ch = await getChannel();

  // 2. Đảm bảo queue tồn tại
  // durable: true → queue không bị mất khi RabbitMQ restart
  await ch.assertQueue(QUEUES.NOTIFICATION, { durable: true });

  // 3. Gửi message vào queue
  ch.sendToQueue(
    QUEUES.NOTIFICATION,
    Buffer.from(
      JSON.stringify({ noticeId }) // payload cực nhỏ, chỉ gửi ID
    ),
    {
      persistent: true // message không mất nếu RabbitMQ restart
    }
  );
};
