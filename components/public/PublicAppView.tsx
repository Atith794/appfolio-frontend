import React from "react";
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
import ArchitectureDiagramCanvas from "@/components/ArchitectureDiagramCanvas";
import type { Plan } from "@/lib/planConfig";

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
  const architectureDiagram = app?.architectureDiagram || null;
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
            <section className="grid gap-10 border-b border-slate-200/70 pb-10 mb-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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

              <div className="relative group flex min-h-[360px] items-center justify-center">
                <div className="absolute h-[520px] w-[520px] rounded-full bg-blue-400/20 blur-3xl transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute h-[420px] w-[420px] rounded-full bg-violet-400/20 blur-3xl transition-transform duration-500 group-hover:scale-105" />

                <div className="relative z-10 w-65 sm:w-75 transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                  {heroPreview ? (
                    <PhoneFrame
                      src={heroPreview}
                      alt={`${app?.name || "App"} hero preview`}
                      fit="cover"
                      notch={notch}
                      aspect="9/19.5"
                      variant="hero"
                    />
                  ) : (
                    <div className="aspect-[9/19.5] w-full rounded-[38px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]" />
                  )}
                </div>
              </div>
            </section>
            {/* SCREENSHOTS */}
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-slate-950 mt-1">
                App Screenshots
              </h2>
            </div>
            {visibleImages.length ? (
              <section id="screenshots" className="pt-10">
                <SectionTitle title="" />
                <div className="relative">
                  <PublicScreenshots
                    appName={app.name}
                    screenshots={app.screenshots || []}
                    screenshotGroups={app.screenshotGroups || []}
                    isPremium={isPro}
                    platforms={app.platforms || []}
                  />
                </div>
              </section>
            ) : null}

            {/* TECH + FLOW */}
            <div className="space-y-20">
              <section id="flow" className="space-y-10">
                <div className="max-w-3xl">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                    User Flow
                  </h2>
                  <p className="mt-4 text-xl leading-9 text-slate-500">
                    A walkthrough of the key screens and transitions across the app.
                  </p>
                </div>

                <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
              </section>

              <section id="stack" className="space-y-10">
                <div className="max-w-3xl">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                    Tech Stack
                  </h2>
                  <p className="mt-4 text-xl leading-9 text-slate-500">
                    A detailed overview of the technologies powering the platform.
                  </p>
                </div>
                <PublicTechStack 
                  groups={techGroups as any} 
                  integrations={isPro ? integrationsItems : []}
                />
              </section>
            </div>
            {/* ARCHITECTURE + DECISIONS */}
            <section id="architecture" className="pt-6">
              <h2 className="text-4xl font-bold tracking-tight text-slate-950 my-3">
                System Architecture
              </h2>
              <InfoCard title="">
                <PremiumLock
                  effectivePlan={effectivePlan}
                  title="Architecture is available on Pro"
                  subtitle="Upgrade to show architecture publicly."
                  upgradeHref={isPro ? undefined : "/pricing"}
                >
                  <div className="space-y-8">
                    {/* Architecture diagram */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            Architecture Overview
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            A high-level view of the system, major components, and how data
                            flows through the product.
                          </p>
                        </div>
                      </div>

                      {architectureDiagram?.nodes?.length ? (
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
                          <ArchitectureDiagramCanvas
                            nodes={architectureDiagram.nodes || []}
                            edges={architectureDiagram.edges || []}
                            viewport={architectureDiagram.viewport}
                            height={520}
                            editable={false}
                            showControls={true}
                            showMiniMap={true}
                            showBackground={true}
                          />
                        </div>
                      ) : architectureImageUrl ? (
                        <ClickToViewImage
                          src={architectureImageUrl}
                          alt="Architecture diagram"
                          viewerAspect={16 / 9}
                          className="w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]"
                        />
                      ) : (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-500">
                          Architecture diagram not added yet.
                        </div>
                      )}
                    </div>

                    {/* Decisions subsection */}
                    {challengesBullets.length ? (
                      <div className="border-t border-slate-200 pt-8">
                        <div className="max-w-2xl">
                          <h3 className="mt-3 text-base font-semibold text-slate-900">
                            Key Design Decisions
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            Important tradeoffs, technical choices, and implementation
                            decisions that shaped the architecture.
                          </p>
                        </div>

                        <PremiumLock
                          effectivePlan={effectivePlan}
                          title="Engineering decisions are visible on Pro"
                          subtitle="Upgrade to show tradeoffs publicly."
                          upgradeHref={isPro ? undefined : "/pricing"}
                          compact
                        >
                          <div className="mt-6 divide-y divide-slate-200 rounded-[24px] border border-slate-200 bg-white">
                            {challengesBullets.slice(0, 4).map((b, idx) => (
                              <div
                                key={idx}
                                className="group flex gap-4 px-5 py-5 transition duration-300 hover:bg-slate-50"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition duration-300 group-hover:scale-105 group-hover:bg-blue-600">
                                  {idx + 1}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-slate-900">
                                    Decision {idx + 1}
                                  </div>
                                  <div className="mt-1 text-sm leading-7 text-slate-600">
                                    {String(b || "")}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PremiumLock>
                      </div>
                    ) : null}
                  </div>
                </PremiumLock>
              </InfoCard>
            </section>

            {/* FOOTER */}
           {!isPro && <footer className="flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Built with <span className="font-semibold text-slate-800">Appfolio</span>
              </div>
              <div>{user?.name || user?.username || "Passionate Developer"}</div>
            </footer>}
          </div>
        </div>
      </div>
    </main>
  );
}