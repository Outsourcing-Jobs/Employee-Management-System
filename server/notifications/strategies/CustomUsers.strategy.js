import BaseRecipientStrategy from './Base.strategy.js';
import { Employee } from '../../models/Employee.model.js';

// Chiến lược xác định người nhận thông báo tùy chỉnh đến từng người dùng
export class CustomUsersStrategy extends BaseRecipientStrategy {
  async resolve({ notice }) {
    if (!notice.employee || !notice.employee.length) {
      return [];
    }

    return Employee.find({
      _id: { $in: notice.employee }
    });
  }
}
