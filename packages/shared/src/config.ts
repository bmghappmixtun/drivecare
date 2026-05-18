export const APP_CONFIG = {
  appName: "DriveCare",
  supportedLocales: ["fr", "en", "ar"] as const,
  defaultLocale: "fr",
  colors: {
    ink: "#080A0F",
    surface: "#FFFFFF",
    electricBlue: "#1463FF",
    graphite: "#2B303B",
    muted: "#EEF1F5"
  }
} as const;

export type Locale = (typeof APP_CONFIG.supportedLocales)[number];
