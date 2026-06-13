import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.winningsouls.app',
  appName: '30 Day SWC',
  webDir: 'out',
  server: {
    url: 'https://30dayswc.com',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: '30 Day SWC',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
