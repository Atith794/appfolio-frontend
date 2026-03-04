export type Plan = "FREE" | "PRO";

export const PLAN_LIMITS = {
  FREE: {
    apps: 1,
    screenshots: 6,
    screenshotGroups: false,

    challenges: { intro: true, bulletsMax: 2 },
    integrations: { intro: false, itemsMax: 2 },

    userFlow: { flowsMax: 1, stepsPerFlowMax: 5 },

    architecture: { canEdit: true, publicVisible: false }, // editable, but blurred publicly
  },
  PRO: {
    apps: 5,
    screenshots: 12,
    screenshotGroups: true,

    challenges: { intro: true, bulletsMax: 8 },
    integrations: { intro: true, itemsMax: 10 },

    userFlow: { flowsMax: 12, stepsPerFlowMax: 20 },

    architecture: { canEdit: true, publicVisible: true },
  },
} as const;

export function getLimits(plan: Plan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE;
}

export function isPro(plan: Plan) {
  return plan === "PRO";
}
