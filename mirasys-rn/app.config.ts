import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'mirasys-rn',
  slug: 'mirasys-rn',
  scheme: 'mirasys',
  version: '1.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android'],
  updates: { enabled: true },
  splash: { backgroundColor: '#ffffff', image: './assets/icon.png', resizeMode: 'contain' },
  ios: { supportsTablet: true },
  android: { adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' } }
};
export default config;
