import BaseRecipientStrategy from './Base.strategy.js';
import { Employee } from '../../models/Employee.model.js';

// Chiến lược xác định người nhận thông báo theo phòng ban
export class DepartmentStrategy extends BaseRecipientStrategy {
  async resolve({ notice }) {
    if (!notice.departments || !notice.departments.length) {
      return [];
    }

    return Employee.find({
      department: { $in: notice.departments },
      organizationID: notice.organizationID
    });
  }
}
