import { getChannel } from './rabbitmq.js';
import { QUEUES } from './queues-contants.js';
import { Notice } from '../models/Notice.model.js';
import { NotificationFactory } from '../notifications/Notification.factory.js';

export const startNotificationWorker = async () => {
  console.log('🚀 Notification Worker Starting...');

  const ch = await getChannel();
  console.log('✅ RabbitMQ Channel Connected');

  await ch.assertQueue(QUEUES.NOTIFICATION, { durable: true });
  console.log(`📦 Queue Ready: ${QUEUES.NOTIFICATION}`);

  ch.prefetch(5);
  console.log('⚙️ Prefetch set to 5');

  ch.consume(QUEUES.NOTIFICATION, async (msg) => {
    if (!msg) {
      console.log('⚠️ Empty message received');
      return;
    }

    console.log('\n📩 Message received');

    const content = msg.content.toString();
    console.log('📄 Raw message:', content);

    const { noticeId } = JSON.parse(content);
    console.log('🔎 Notice ID:', noticeId);

    try {

      console.log('🔒 Trying to lock notice with status PENDING...');

      const notice = await Notice.findOneAndUpdate(
        { _id: noticeId, status: 'PENDING' },
        { status: 'PROCESSING' },
        { new: true }
      );

      if (!notice) {
        console.log('⚠️ Notice not found or already processed');
        ch.ack(msg);
        return;
      }

      console.log('✅ Notice locked:', notice._id);
      console.log('📢 Channel:', notice.channels);
      console.log('🎯 Audience:', notice.audience);

      console.log('🏭 Creating Notification Service...');
      const service = NotificationFactory.create(notice);

      console.log('📤 Sending notification...');
      await service.send();

      console.log('✅ Notification sent');

      notice.status = 'DONE';
      await notice.save();

      console.log('💾 Notice status updated → DONE');

      ch.ack(msg);
      console.log('📨 Message ACKED (removed from queue)');

    } catch (err) {

      console.error('❌ Notification failed:', err);

      await Notice.findByIdAndUpdate(noticeId, {
        status: 'FAILED',
        error: err.message
      });

      console.log('💾 Notice status updated → FAILED');

      ch.ack(msg);
      console.log('📨 Message ACKED despite error');
    }
  });

  console.log('👂 Worker is now listening for messages...');
};