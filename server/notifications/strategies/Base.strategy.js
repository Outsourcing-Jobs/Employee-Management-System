// Kế thừa để tạo các chiến lược xác định người nhận thông báo
export default class BaseRecipientStrategy {
  resolve(context) {
    throw new Error('resolve() not implemented');
  }
}
