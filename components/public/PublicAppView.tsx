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
} from "lucide-react";
import { NotchType } from "@/components/PhoneFrame";
import PublicScreenshots from "@/components/PublicScreenshots";
import ClickToViewImage from "@/components/ClickToViewImage";
import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
import PublicTechStack from "@/components/PublicTechStack";
import Reveal from "@/components/Reveal";
import { PremiumLock } from "@/components/PremiumLock";
import type { Plan } from "@/lib/planConfig";

function platformLabel(p: string) {
  const v = String(p || "").toUpperCase();
  if (v === "ANDROID") return "Android";
  if (v === "IOS" || v === "APPLE") return "iOS";
  if (v === "WINDOWS") return "Windows";
  return v || "Platform";
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
      {children}
    </span>
  );
}

export function PublicAppView({
  data,
  effectivePlan,
  showBackLink = true,
  showFooterWatermark = true,
}: {
  data: any; // { user, app }
  effectivePlan: Plan;
  showBackLink?: boolean;
  showFooterWatermark?: boolean;
}) {
  const { user, app } = data;

  const userFlowWalkthroughs = app?.userFlowWalkthroughs || null;

  const screenshots = (app?.screenshots || [])
    .slice()
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

  const iconUrl = String(app?.appIconUrl || "");
  const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

  const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
  const challengesIntro: string = String(app?.challengesIntro || "");
  const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

  const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

  const integrationsIntro: string = String(app?.integrations?.intro || "");
  const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
    ? app.integrations.items
    : [];

  const techStack = app?.techStack || {};
  const techGroups = [
    { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
    { key: "backend", label: "Backend", items: techStack.backend || [] },
    { key: "database", label: "Database", items: techStack.database || [] },
    { key: "infra", label: "Infra", items: techStack.infra || [] },
  ] as const;

  const notch: NotchType =
    platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE")
      ? "iphone-pill"
      : "android-center-hole";

  const premiumCta = () => {
    if (typeof window !== "undefined") window.location.href = "/pricing";
  };
          
  const visibleImages = effectivePlan === "PRO" ? screenshots : screenshots.slice(0, 6);

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_10%_40%,rgba(29,78,216,0.08),transparent_60%),linear-gradient(#f7fbff,#eef3f8)]">
      <div className="mx-auto max-w-270 px-3 pb-14 pt-6 md:px-4">
        <div
          className="
            rounded-[28px]
            border border-slate-900/10
            bg-white/55
            shadow-[0_18px_60px_rgba(2,6,23,0.10)]
            backdrop-blur-md
            px-3 py-6 sm:px-6 sm:py-8
          "
        >
          {/* Back */}
          {showBackLink ? (
            <a
              href={`/u/${user.username}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {user.displayName || user.username}
            </a>
          ) : null}

          {/* HERO */}
          <header className={showBackLink ? "mt-6" : ""}>
            {/* Footer watermark */}
            {effectivePlan === 'PRO' ?null: (
              <div className="mt-2 text-center text-lg font-mono text-slate-400">
                Built with Appfolio
              </div>
            )}
            <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  {iconUrl ? (
                    <ClickToViewImage
                      src={iconUrl}
                      alt={`${app?.name || "App"} icon`}
                      viewerAspect={1}
                      className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-900/10 bg-white shadow-sm">
                      <AppWindow className="h-6 w-6 text-primary" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-slate-900 font-serif sm:text-4xl">
                      {app.name}
                    </h1>

                    {app.shortDescription ? (
                      <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600 font-serif">
                        {app.shortDescription}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-slate-500 font-serif">
                        Mobile app case study
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 font-serif">
                        Available on:
                      </span>
                      {platforms.map((p) => (
                        <Pill key={p}>{platformLabel(p)}</Pill>
                      ))}

                      {/* {app?.status ? <Pill>{String(app.status)}</Pill> : null} */}
                      {app?.category ? <Pill>{String(app.category)}</Pill> : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {app?.links?.github ? (
                    <a
                      href={String(app.links.github)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <GitBranch className="h-4 w-4" />
                      GitHub
                    </a>
                  ) : null}

                  {app?.links?.liveDemo ? (
                    <a
                      href={String(app.links.liveDemo)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Live
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-slate-900/10" />

              {/* <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600 font-serif">
                <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
                  Screenshots
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
                  User Flow
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
                  Architecture
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
                  Tech Stack
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
                  Key Decisions
                </span>
              </div> */}
            </div>
          </header>

          {/* Screenshots */}
          {visibleImages.length ? (
            <Section title="Walkthrough" subtitle="" icon={<Layers className="h-4 w-4" />}>
              <PublicScreenshots
                appName={app?.name}
                imageUrls={visibleImages.map((s: any) => s.url)}
                // isPremium={effectivePlan === "PRO"}
                isPremium={effectivePlan === "PRO"?true:false}
                platforms={platforms}
              />
            </Section>
          ) : null}

          {/* Overview (free) */}
          {overviewBullets.length ? (
            <Section
              title="App Overview"
              subtitle="What it does, who it’s for, and what makes it useful."
              icon={<Layers className="h-4 w-4" />}
            >
              <div className="grid gap-3 md:grid-cols-2">
                {overviewBullets.slice(0, 6).map((b, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-mono text-slate-400">#{idx + 1}</div>
                    <div className="mt-1 text-sm text-slate-700 font-serif leading-relaxed">
                      {String(b)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* User Flow (premium) */}
          {userFlowWalkthroughs?.flows?.length ? (
            <Section
              title="User Flow"
              subtitle="Feature-wise flows: what happens, where, and how."
              icon={<Network className="h-4 w-4" />}
            >
              <PremiumLock
                effectivePlan={effectivePlan}
                title="User Flow is visible on Pro"
                subtitle="Upgrade to show this section publicly."
                onUpgrade={effectivePlan === "FREE" ? premiumCta : undefined}
              >
                <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
              </PremiumLock>
            </Section>
          ) : null}

          {/* System Design (premium) */}
          {architectureImageUrl || integrationsIntro || integrationsItems.length ? (
            <Section
              title="System Design"
              subtitle="Architecture + key decisions that shaped the implementation."
              icon={<Network className="h-4 w-4" />}
            >
              <PremiumLock
                effectivePlan={effectivePlan}
                title="System Design is visible on Pro"
                subtitle="Upgrade to show this section publicly."
                onUpgrade={effectivePlan === "FREE" ? premiumCta : undefined}
              >
                <>
                  {architectureImageUrl ? (
                    <div>
                      <ClickToViewImage
                        src={architectureImageUrl}
                        alt="Architecture diagram"
                        viewerAspect={16 / 9}
                        className="w-full overflow-hidden rounded-2xl border border-slate-900/10 bg-white"
                      />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-serif">
                        <span>Click to view full size.</span>
                        <span className="font-mono">Architecture</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 text-sm text-slate-600 font-serif">
                      Architecture diagram not added yet.
                    </div>
                  )}

                  {(integrationsIntro || integrationsItems.length) ? (
                    <div className="mt-6">
                      <div className="flex items-baseline justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-slate-900 font-serif">
                            Integrations & Key Decisions
                          </div>
                          <div className="mt-1 text-xs text-slate-500 font-serif">
                            Things recruiters ask about: auth, storage, messaging, maps, payments…
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {integrationsItems.length ? `${integrationsItems.length} items` : ""}
                        </span>
                      </div>

                      {integrationsIntro ? (
                        <p className="mt-3 text-sm text-slate-700 font-serif">{integrationsIntro}</p>
                      ) : null}

                      {integrationsItems.length ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {integrationsItems.map((it, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                              <div className="text-xs font-extrabold text-slate-700 font-serif">
                                {String(it.key || "")}
                              </div>
                              <div className="mt-1 text-sm text-slate-700 font-serif">
                                {String(it.value || "")}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-slate-600 font-serif">
                          No key decisions added.
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              </PremiumLock>
            </Section>
          ) : null}

          {/* Tech Stack (free) */}
          {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
            <Section
              title="Tech Stack"
              subtitle="Technologies used to build this app."
              icon={<Wrench className="h-4 w-4" />}
            >
              <PublicTechStack groups={techGroups as any} />
            </Section>
          ) : null}

          {/* Challenges (gated partially on backend; public just renders what exists) */}
          {(challengesIntro || challengesBullets.length) ? (
            <Section
              title="Challenges & Tradeoffs"
              subtitle="What was hard, what you chose, and what you’d improve next."
              icon={<GitBranch className="h-4 w-4" />}
            >
              {challengesIntro ? (
                <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4">
                  <div className="text-xs font-extrabold text-slate-800 font-serif">Context</div>
                  <p className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
                    {challengesIntro}
                  </p>
                </div>
              ) : null}

              {challengesBullets.length ? (
                <div className={challengesIntro ? "mt-5" : ""}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold text-slate-800 font-serif">Key points</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {challengesBullets.length} items
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {challengesBullets.slice(0, 6).map((b, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
                        <div className="text-[11px] font-mono text-slate-400">#{idx + 1}</div>
                        <div className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
                          {String(b || "")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
