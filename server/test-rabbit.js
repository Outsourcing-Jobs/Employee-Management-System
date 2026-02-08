import 'dotenv/config';
import amqp from 'amqplib';

(async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const ch = await conn.createChannel();

    await ch.assertQueue('health_check', { durable: true });

    ch.sendToQueue(
      'health_check',
      Buffer.from(JSON.stringify({ ping: Date.now() })),
      { persistent: true }
    );

    console.log('✅ RabbitMQ connected & sent message');
    await ch.close();
    await conn.close();
  } catch (err) {
    console.error('❌ RabbitMQ error:', err.message);
  }
})();
