import type { CapacitorConfig } from "@capacitor/cli";

const appUrl = process.env.APP_URL;

const config: CapacitorConfig = {
  appId: "com.aiunlimited.app",
  appName: "AI Unlimited",
  webDir: "www",
  server: appUrl
    ? {
        url: appUrl,
        cleartext: false,
        androidScheme: "https",
      }
    : undefined,
  android: {
    allowMixedContent: false,
  },
};

export default config;
