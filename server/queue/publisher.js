import { getChannel } from './rabbitmq.js';
import { QUEUES } from './queues-contants.js';

export const publishNotification = async (noticeId) => {
  console.log('\n📤 Publish Notification Start'); 
  console.log('🔎 Notice ID:', noticeId);
  // 1. Lấy channel đã connect tới RabbitMQ
  const ch = await getChannel();
  console.log('✅ RabbitMQ Channel Ready');
  // 2. Đảm bảo queue tồn tại
  // durable: true → queue không bị mất khi RabbitMQ restart
  await ch.assertQueue(QUEUES.NOTIFICATION, { durable: true });
  console.log(`📦 Queue Ready: ${QUEUES.NOTIFICATION}`);
  // 3. Gửi message vào queue
  ch.sendToQueue(
    QUEUES.NOTIFICATION,
    Buffer.from(
      JSON.stringify({ noticeId }) 
    ),
    {
      persistent: true 
    }
  );
};
