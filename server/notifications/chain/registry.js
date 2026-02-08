const registry = new Map();

// Tất cả các kênh thông báo sẽ được đăng ký ở đây
export const channelRegistry = {
  register(key, ChannelClass) {
    registry.set(key, ChannelClass);
  },
  get(key) {
    if (!registry.has(key)) {
      throw new Error(`Channel ${key} not found`);
    }
    return registry.get(key);
  }
};
