// Dịch vụ quản lý việc gửi thông báo dựa trên chiến lược và kênh đã định nghĩa
export class NotificationService {
  constructor(strategy, channels, notice) {
    this.strategy = strategy;
    this.channels = channels;
    this.notice = notice;
  }
  // Gửi thông báo đến người nhận được xác định bởi chiến lược qua các kênh đã định nghĩa
  async send() {
    const recipients = await this.strategy.resolve({
      notice: this.notice
    });
    // Gửi thông báo qua từng kênh
    for (const channel of this.channels) {
      await channel.send(recipients, this.notice);
    }
  }
}
