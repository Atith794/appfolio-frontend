"use client";

import Link from "next/link";
import React from "react";
import type { Plan } from "@/lib/planConfig";
import { Lock } from "lucide-react";

type PremiumLockProps = {
  effectivePlan: Plan;
  title: string;
  subtitle?: string;
  upgradeHref?: string;
  children: React.ReactNode;
  compact?: boolean;
};

export function PremiumLock({
  effectivePlan,
  title,
  subtitle,
  upgradeHref,
  children,
  compact = false,
}: PremiumLockProps) {
  const isPro = effectivePlan === "PRO";

  if (isPro) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[24px]">
      <div className="pointer-events-none scale-[0.985] blur-[3px] opacity-55">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-white/18 backdrop-blur-[2px]">
        <div
          className={[
            "mx-4 w-full max-w-md rounded-[28px] border border-white/70 bg-white/82 text-center shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl",
            compact ? "p-5" : "p-6",
          ].join(" ")}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Lock className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-slate-900">
            {title}
          </h3>

          {subtitle ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          ) : null}

          {upgradeHref ? (
            <Link
              href={upgradeHref}
              className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
            >
              Upgrade to Pro
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}