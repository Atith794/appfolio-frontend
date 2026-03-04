"use client";

import React from "react";
import type { Plan } from "@/lib/planConfig";

export function PremiumLock({
  effectivePlan,
  title = "Visible on Pro plan",
  subtitle = "Upgrade to unlock this section publicly.",
  onUpgrade,
  children,
}: {
  effectivePlan: Plan;
  title?: string;
  subtitle?: string;
  onUpgrade?: () => void;
  children: React.ReactNode;
}) {
  if (effectivePlan === "PRO") return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-md pointer-events-none select-none">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="rounded-2xl border border-primary/30 bg-white/90 px-6 py-4 text-center shadow-lg max-w-sm">
          <div className="text-sm font-semibold text-primary font-serif">🔒 {title}</div>
          <div className="text-xs text-slate-500 mt-1">{subtitle}</div>

          {onUpgrade ? (
            <button
              type="button"
              onClick={onUpgrade}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
            >
              Upgrade to Pro
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
