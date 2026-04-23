export const featureFlags = {
  landingExperiments: {
    buyNotificationTest: {
      enabled: true,
      pages: {
        evergreen: true,
        diaDasMaes: true,
      },
    },
  },
} as const;

export type LandingPageKey = "evergreen" | "diaDasMaes";
