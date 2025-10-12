import * as SecureStore from 'expo-secure-store';

export const secure = {
  async get(key: string) {
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  async set(key: string, value: string) {
    try { await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED }); } catch {}
  },
  async del(key: string) { try { await SecureStore.deleteItemAsync(key); } catch {} },
};
