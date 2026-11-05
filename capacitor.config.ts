import type { CapacitorConfig } from "@capacitor/cli";

const appUrl = process.env.APP_URL;

const config: CapacitorConfig = {
  appId: "com.aiunlimited.pro",
  appName: "AI Unlimited Pro",
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
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#07080d",
    },
  },
};

export default config;
