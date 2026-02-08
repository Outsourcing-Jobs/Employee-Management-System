import './strategies/index.js';
import './chain/index.js';      

import { strategyRegistry } from './strategies/registry.js';
import { channelRegistry } from './chain/registry.js';
import { NotificationService } from './Notification.service.js';

// Nhà máy tạo thông báo dựa trên chiến lược và kênh đã đăng ký
export class NotificationFactory {
  // Tạo dịch vụ thông báo từ thông tin thông báo
  static create(notice) {
    const StrategyClass = strategyRegistry.get(notice.audience);
    const strategy = new StrategyClass();
    // Lấy tất cả các kênh thông báo đã đăng ký
    const channels = notice.channels.map(
      (c) => new (channelRegistry.get(c))()
    );
    // Trả về một thể hiện của dịch vụ thông báo với chiến lược và kênh đã cấu hình
    return new NotificationService(strategy, channels, notice);
  }
}
