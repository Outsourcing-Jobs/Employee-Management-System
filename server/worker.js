import 'dotenv/config';
import { ConnectDB } from './config/connectDB.js';
import { startNotificationWorker } from './queue/consumer.js';

await ConnectDB();

console.log('🚀 Notification worker starting...');

try {
  await startNotificationWorker();
  console.log('✅ Notification worker running');
} catch (err) {
  console.error('❌ Worker failed to start', err);
  process.exit(1);
}
