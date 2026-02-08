const registry = new Map();

// Tất cả các chiến lược xác định người nhận thông báo sẽ được đăng ký ở đây
export const strategyRegistry = {
  register: (key, StrategyClass) => {
    registry.set(key, StrategyClass);
  },
  get: (key) => {
    if (!registry.has(key)) {
      throw new Error(`Strategy ${key} not found`);
    }
    return registry.get(key);
  }
};
