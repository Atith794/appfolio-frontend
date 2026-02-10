import { API_BASE } from "@/lib/api";
import { TECH_CATALOG, TechCategory } from "@/lib/techCatalog";
import { AppWindow, ArrowLeft, Layers, Network, GitBranch, Wrench } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import PublicScreenshots from "@/components/PublicScreenshots";
import ClickToViewImage from "@/components/ClickToViewImage";

async function getApp(username: string, slug: string) {
  const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function platformLabel(p: string) {
  const v = String(p || "").toUpperCase();
  if (v === "ANDROID") return "Android";
  if (v === "IOS" || v === "APPLE") return "iOS";
  if (v === "WINDOWS") return "Windows";
  return v || "Platform";
}

function initials(name: string) {
  const parts = (name || "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function getTechById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="group border-2 border-dashed border-slate-200 rounded-xl p-3 md:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {icon ? <span className="text-primary">{icon}</span> : null}
              <h3 className="text-base font-semibold text-slate-900 font-serif">{title}</h3>
            </div>
            {subtitle ? <p className="text-sm text-slate-500 mt-1 font-serif">{subtitle}</p> : null}
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function TechBadge({ id }: { id: string }) {
  const item = getTechById(id);
  const name = item?.name ?? id;

  return (
    <span className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      {item?.iconClass ? (
        <i className={`${item.iconClass} colored`} style={{ fontSize: 36, lineHeight: 1 }} />
      ) : (
        <span className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 text-xs font-black grid place-items-center">
          {initials(name)}
        </span>
      )}
      <span className="text-[11px] font-semibold text-slate-700 font-serif text-center">
        {name}
      </span>
    </span>
  );
}

export default async function PublicAppPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const data = await getApp(username, slug);

  if (!data) return <div className="p-6">App not found</div>;

  const { user, app } = data;

  const screenshots = (app?.screenshots || [])
    .slice()
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

  // Fields you confirmed exist
  const iconUrl = String(app?.appIconUrl || "");
  const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

  const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
  const challengesIntro: string = String(app?.challengesIntro || "");
  const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

  const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

  const userFlowTextMode: string = String(app?.userFlowText?.mode || "");
  const userFlowBullets: string[] = Array.isArray(app?.userFlowText?.bullets) ? app.userFlowText.bullets : [];
  const userFlowImageUrl: string = String(app?.userFlowDiagram?.imageUrl || "");

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

  const isPremium:boolean = true

  return (
    <main className="px-3 md:px-4 py-4 max-w-245 mx-auto">
      {/* Back */}
      <a
        href={`/u/${user.username}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {user.displayName || user.username}
      </a>

      {/* HERO */}
      <div className="mt-4 group border-2 border-dashed border-slate-200 rounded-xl p-3 md:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-start gap-4">
          {iconUrl ? (
            <div className="h-16 w-16">
              <ClickToViewImage
                src={iconUrl}
                alt={`${app?.name || "App"} icon`}
                viewerAspect={1} // square logo
                className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white cursor-pointer"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-2xl border border-slate-200 bg-white grid place-items-center">
              <AppWindow className="w-6 h-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-serif">
              {app.name}
            </h1>

            {app.shortDescription ? (
              <p className="mt-2 text-sm text-slate-600 font-serif">{app.shortDescription}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {platforms.map((p: string) => (
                <Pill key={p}>{platformLabel(p)}</Pill>
              ))}
              {app?.status ? <Pill>{String(app.status)}</Pill> : null}
              {app?.visibility ? <Pill>{String(app.visibility)}</Pill> : null}
            </div>
          </div>
        </div>
      </div>

      {/* App Overview */}
      {overviewBullets.length ? (
        <SectionCard
          title="App Overview"
          subtitle="The quickest way to understand what this app does."
          icon={<Layers className="w-4 h-4" />}
        >
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
            {overviewBullets.map((b, idx) => (
              <li key={idx}>{String(b)}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}

      {/* Tech Stack */}
      {techGroups.length ? (
        <SectionCard
          title="Tech Stack"
          subtitle="Technologies used to build this app."
          icon={<Wrench className="w-4 h-4" />}
        >
          <div className="grid gap-4">
            {techGroups.map((g) => (
              <div key={g.key}>
                <div className="text-xs font-black text-slate-700 font-serif">{g.label}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((id: any) => (
                    <TechBadge key={id} id={id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {/* Integrations & Key Decisions */}
      {(integrationsIntro || integrationsItems.length) ? (
        <SectionCard
          title="Integrations & Key Decisions"
          subtitle="Things that matter in interviews: auth, storage, messaging, maps, etc."
          icon={<GitBranch className="w-4 h-4" />}
        >
          {integrationsIntro ? (
            <p className="text-sm text-slate-700 font-serif">{integrationsIntro}</p>
          ) : null}

          {integrationsItems.length ? (
            <div className="mt-3 grid gap-2">
              {integrationsItems.map((it, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="text-xs font-black text-slate-700 font-serif">{String(it.key || "")}</div>
                  <div className="mt-1 text-sm text-slate-700 font-serif">{String(it.value || "")}</div>
                </div>
              ))}
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Architecture */}
      {architectureImageUrl ? (
        <SectionCard
          title="Architecture Overview"
          subtitle="High-level system design."
          icon={<Network className="w-4 h-4" />}
        >
          <ClickToViewImage
            src={architectureImageUrl}
            alt="Architecture diagram"
            viewerAspect={16 / 9} // diagrams usually wide; adjust if yours is different
            className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
          />
        </SectionCard>
      ) : null}

      {/* User Flow */}
      {(userFlowBullets.length || userFlowImageUrl) ? (
        <SectionCard
          title="User Flow"
          subtitle={userFlowTextMode ? `Mode: ${userFlowTextMode}` : "How a user moves through the app."}
          icon={<Network className="w-4 h-4" />}
        >
          {userFlowBullets.length ? (
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
              {userFlowBullets.map((b, idx) => (
                <li key={idx}>{String(b)}</li>
              ))}
            </ul>
          ) : null}

          {userFlowImageUrl ? (
            <img
              src={userFlowImageUrl}
              alt="User flow diagram"
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white"
              loading="lazy"
            />
          ) : null}
        </SectionCard>
      ) : null}

      {/* Challenges & Tradeoffs */}
      {(challengesIntro || challengesBullets.length) ? (
        <SectionCard
          title="Challenges & Tradeoffs"
          subtitle="What was hard, what you chose, and what you’d improve next."
          icon={<GitBranch className="w-4 h-4" />}
        >
          {challengesIntro ? (
            <p className="text-sm text-slate-700 font-serif">{challengesIntro}</p>
          ) : null}

          {challengesBullets.length ? (
            <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
              {challengesBullets.map((b, idx) => (
                <li key={idx}>{String(b)}</li>
              ))}
            </ul>
          ) : null}
        </SectionCard>
      ) : null}

      {/* Screenshots */}
      {screenshots.length ? (
        <SectionCard
          title="Screenshots"
          subtitle="Click any screenshot to view."
          icon={<Layers className="w-4 h-4" />}
        >
          <PublicScreenshots
            appName={app?.name}
            imageUrls={screenshots.map((s: any) => s.url)}
            isPremium={isPremium}
            platforms={platforms}
          />
        </SectionCard>
      ) : null}

      <div className="mt-8 text-xs text-slate-400 font-mono">
        Built with Appfolio • {user.displayName || user.username}
      </div>
    </main>
  );
}