import { UserNotification } from '../../models/UserNotification.model.js';

// Kênh gửi thông báo hệ thống
export default class SystemChannel {
  async send(users, notice) {
    const docs = users.map(user => ({
      notice: notice._id,
      employee: user._id,
      channel: 'system'
    }));

    // Ghi nhận thông báo hệ thống cho tất cả người dùng
    await UserNotification.insertMany(docs);
  }
}
