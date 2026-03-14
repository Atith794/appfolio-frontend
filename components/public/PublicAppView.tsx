import React from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";
import {
  AppWindow,
  ArrowLeft,
  Layers,
  Network,
  GitBranch,
  Wrench,
  ArrowRight,
  Github,
  Globe,
  Star,
  Smartphone,
} from "lucide-react";
import { NotchType, PhoneFrame } from "@/components/PhoneFrame";
import PublicScreenshots from "@/components/PublicScreenshots";
import ClickToViewImage from "@/components/ClickToViewImage";
import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
import PublicTechStack from "@/components/PublicTechStack";
import { PremiumLock } from "@/components/PremiumLock";
import type { Plan } from "@/lib/planConfig";
import Reveal from "@/components/Reveal";
function platformLabel(p: string) {
  const v = String(p || "").toUpperCase();
  if (v === "ANDROID") return "Android";
  if (v === "IOS" || v === "APPLE") return "iOS";
  if (v === "WINDOWS") return "Windows";
  if (v === "WEB") return "Web";
  return v || "Platform";
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  children,
  variant = "default",
  divider = true,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "showcase";
  divider?: boolean;
}) {
  const wrapClass = variant === "showcase" ? "mt-8 md:mt-10" : "mt-10 md:mt-12";

  const bodyClass =
    variant === "showcase"
      ? "mt-4 rounded-3xl border border-slate-900/10 bg-white/75 p-3 sm:p-4 md:p-5"
      : "mt-4 rounded-3xl border border-slate-900/10 bg-white/70 p-5 md:p-6";

  return (
    <section className={wrapClass}>
      <div className="px-1">
        <div className="flex items-start gap-3">
          {icon ? (
            <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 text-primary shadow-sm">
              {icon}
            </span>
          ) : null}

          <div>
            <h2 className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.02em] text-slate-900 font-serif">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 max-w-3xl text-sm text-slate-600 font-serif">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {divider ? <div className="mt-4 h-px w-full bg-slate-900/10" /> : null}
      </div>

      <div className={bodyClass}>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

function SoftPill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium shadow-sm",
        active
          ? "bg-blue-600 text-white"
          : "border border-slate-200 bg-white text-slate-600",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function MiniStat({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <span className="text-slate-500">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{children}</span>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function FloatingStat({ icon, text }) {
  return (
    <div className="absolute flex items-center gap-2 px-3 py-2 bg-white/80 border border-slate-200 rounded-xl shadow-sm backdrop-blur">
      {icon}
      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
}

export function PublicAppView({
  data,
  effectivePlan,
  showBackLink = true,
}: {
  data: any;
  effectivePlan: Plan;
  showBackLink?: boolean;
}) {
  const { user, app } = data;
  const isPro = effectivePlan === "PRO";

  const screenshots = (app?.screenshots || [])
    .slice()
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

  const visibleImages = isPro ? screenshots : screenshots.slice(0, 4);

  const iconUrl = String(app?.appIconUrl || "");
  const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

  const userFlowWalkthroughs = app?.userFlowWalkthroughs || null;
  const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

  const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(
    app?.integrations?.items
  )
    ? app.integrations.items
    : [];

  const challengesBullets: string[] = Array.isArray(app?.challengesBullets)
    ? app.challengesBullets
    : [];

  const overviewBullets: string[] = Array.isArray(app?.overviewBullets) 
    ? app.overviewBullets
    : [];

  const techStack = app?.techStack || {};
  const techGroups = [
    { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
    { key: "backend", label: "Backend", items: techStack.backend || [] },
    { key: "database", label: "Database", items: techStack.database || [] },
    { key: "infra", label: "Infrastructure", items: techStack.infra || [] },
  ] as const;

  const notch: NotchType =
    platforms.some((p) => {
      const v = String(p).toUpperCase();
      return v === "IOS" || v === "APPLE";
    })
      ? "iphone-pill"
      : "android-center-hole";

  const heroPreview = visibleImages[0]?.url || "";

  return (
    <main className="min-h-screen bg-[#eef2f7]">
      {/* <div className="mx-auto max-w-362.5"> */}
      <div className="mx-auto max-w-450px">

        <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#f2f5fb_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          {/* ambient background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[14%] top-16 h-72 w-72 rounded-full bg-violet-400/18 blur-3xl" />
            <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-cyan-300/18 blur-3xl" />
            <div className="absolute left-[-80px] bottom-[-80px] h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            {showBackLink ? (
              <a
                href={`/u/${user.username}`}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 text-blue-600 font-serif" />
                Back
              </a>
            ) : null}

            {/* HERO */}
            <section className="grid gap-10 border-b border-slate-200/70 pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="min-w-0">
                <div className="flex items-start gap-5">
                  {iconUrl ? (
                    <ClickToViewImage
                      src={iconUrl}
                      alt={`${app?.name || "App"} icon`}
                      viewerAspect={1}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:h-20 sm:w-20 cursor-pointer font-serif"
                    />
                  ) : (
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:h-20 sm:w-20 font-serif">
                      <AppWindow className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                  

                  <div className="min-w-0">
                    <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl font-serif">
                      {app?.name || "App Name"}
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 font-serif">
                      {app?.shortDescription || "A modern app showcase page built with Appfolio."}
                    </p>

                    {overviewBullets.length ? (
                      <div className="mt-5 max-w-xl space-y-3">
                        {overviewBullets.slice(0, 4).map((b, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                            <p className="text-[15px] leading-7 text-slate-600 font-serif">
                              {String(b)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {platforms.map((p) => (
                        <SoftPill key={p}>{platformLabel(p)}</SoftPill>
                      ))}

                      {app?.category ? <SoftPill>{String(app.category)}</SoftPill> : null}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {app?.links?.liveDemo ? (
                        <a
                          href={String(app.links.liveDemo)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 font-mono"
                        >
                          <Globe className="h-4 w-4" />
                          View Live App
                        </a>
                      ) : null}

                      {app?.links?.github ? (
                        <a
                          href={String(app.links.github)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 font-mono"
                        >
                          <Github className="h-4 w-4" />
                          Github
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-[360px] items-center justify-center">
                <div className="relative z-10 w-65 sm:w-75 lg:grid-cols-[1fr_480px] mr-10">
                  {heroPreview ? (
                    <div className="relative flex min-h-90 items-center justify-center">
                      <div className="absolute w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-3xl" />
                      <div className="absolute w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-3xl translate-x-6 translate-y-6" />
                      <div className="relative z-10 w-65 sm:w-75">
                        <PhoneFrame
                          src={heroPreview}
                          alt={`${app?.name || "App"} hero preview`}
                          fit="cover"
                          notch={notch}
                          aspect="9/19.5"
                          variant="hero"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[9/19.5] w-full rounded-[38px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]" />
                  )}
                </div>
              </div>
            </section>

            {/* SCREENSHOTS */}
            {visibleImages.length ? (
              <section className="pt-10">
                <SectionTitle title="App Screenshots" />
                <div className="relative">
                  <PublicScreenshots
                    appName={app?.name}
                    imageUrls={visibleImages.map((s: any) => s.url)}
                    isPremium={isPro}
                    platforms={platforms}
                  />
                </div>
              </section>
            ) : null}

            {/* TECH + FLOW */}
            <section className="grid gap-6 pt-10 lg:grid-cols-2">
              {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
                <InfoCard title="Tech Stack">
                  <PublicTechStack groups={techGroups as any} />
                </InfoCard>
              ) : null}

              {userFlowWalkthroughs?.flows?.length ? (
                <InfoCard title="User Flow">
                  <PremiumLock
                    effectivePlan={effectivePlan}
                    title="User Flow is visible on Pro"
                    subtitle="Upgrade to show user journeys publicly."
                    upgradeHref={isPro ? undefined : "/pricing"}
                    compact
                  >
                    <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
                  </PremiumLock>
                </InfoCard>
              ) : null}
            </section>

            {/* ARCHITECTURE + DECISIONS */}
            <section className="grid gap-6 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
              <InfoCard title="System Architecture">
                <PremiumLock
                  effectivePlan={effectivePlan}
                  title="Architecture is visible on Pro"
                  subtitle="Upgrade to show architecture publicly."
                  upgradeHref={isPro ? undefined : "/pricing"}
                >
                  {architectureImageUrl ? (
                    <ClickToViewImage
                      src={architectureImageUrl}
                      alt="Architecture diagram"
                      viewerAspect={16 / 9}
                      className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                      Architecture diagram not added yet.
                    </div>
                  )}
                </PremiumLock>
              </InfoCard>

              <div className="grid gap-6">
                {integrationsItems.length ? (
                  <InfoCard title="Integrations">
                    <PremiumLock
                      effectivePlan={effectivePlan}
                      title="Integrations are visible on Pro"
                      subtitle="Upgrade to show integrations publicly."
                      upgradeHref={isPro ? undefined : "/pricing"}
                      compact
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        {integrationsItems.slice(0, 4).map((it, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              {String(it.key || "")}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-slate-500">
                              {String(it.value || "")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PremiumLock>
                  </InfoCard>
                ) : null}

                {challengesBullets.length ? (
                  <InfoCard title="Key Engineering Decisions / Tradeoffs">
                    <PremiumLock
                      effectivePlan={effectivePlan}
                      title="Engineering decisions are visible on Pro"
                      subtitle="Upgrade to show tradeoffs publicly."
                      upgradeHref={isPro ? undefined : "/pricing"}
                      compact
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        {challengesBullets.slice(0, 4).map((b, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              Decision {idx + 1}
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-500">
                              {String(b || "")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PremiumLock>
                  </InfoCard>
                ) : null}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-10 flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Built with <span className="font-semibold text-slate-800">Appfolio</span>
              </div>
              <div>{user?.name || user?.username || "Developer Name"}</div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
