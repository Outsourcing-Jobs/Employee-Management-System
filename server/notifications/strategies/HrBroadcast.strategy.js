import { Employee } from '../../models/Employee.model.js';
import BaseRecipientStrategy from "./Base.strategy.js";

// Chiến lược xác định người nhận thông báo đến toàn bộ nhân sự trong tổ chức
export class HrBroadcastStrategy extends BaseRecipientStrategy {
  async resolve({ notice }) {
    return Employee.find({
      organizationID: notice.organizationID
    });
  }
}
