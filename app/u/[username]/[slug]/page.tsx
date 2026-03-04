// V1

// import { API_BASE } from "@/lib/api";
// import { TECH_CATALOG, TechCategory } from "@/lib/techCatalog";
// import { AppWindow, ArrowLeft, Layers, Network, GitBranch, Wrench } from "lucide-react";
// import { PhoneFrame } from "@/components/PhoneFrame";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function initials(name: string) {
//   const parts = (name || "").split(/\s+/).filter(Boolean);
//   const a = parts[0]?.[0] ?? "";
//   const b = parts[1]?.[0] ?? "";
//   return (a + b).toUpperCase();
// }

// function getTechById(id: string) {
//   return TECH_CATALOG.find((t) => t.id === id);
// }

// function SectionCard({
//   title,
//   subtitle,
//   icon,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="mt-6">
//       <div className="group border-2 border-dashed border-slate-200 rounded-xl p-3 md:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className="flex items-center gap-2">
//               {icon ? <span className="text-primary">{icon}</span> : null}
//               <h3 className="text-base font-semibold text-slate-900 font-serif">{title}</h3>
//             </div>
//             {subtitle ? <p className="text-sm text-slate-500 mt-1 font-serif">{subtitle}</p> : null}
//           </div>
//         </div>

//         <div className="mt-4">{children}</div>
//       </div>
//     </section>
//   );
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
//       {children}
//     </span>
//   );
// }

// function TechBadge({ id }: { id: string }) {
//   const item = getTechById(id);
//   const name = item?.name ?? id;

//   return (
//     <span className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
//       {item?.iconClass ? (
//         <i className={`${item.iconClass} colored`} style={{ fontSize: 36, lineHeight: 1 }} />
//       ) : (
//         <span className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 text-xs font-black grid place-items-center">
//           {initials(name)}
//         </span>
//       )}
//       <span className="text-[11px] font-semibold text-slate-700 font-serif text-center">
//         {name}
//       </span>
//     </span>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   // Fields you confirmed exist
//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

//   const userFlowTextMode: string = String(app?.userFlowText?.mode || "");
//   const userFlowBullets: string[] = Array.isArray(app?.userFlowText?.bullets) ? app.userFlowText.bullets : [];
//   const userFlowImageUrl: string = String(app?.userFlowDiagram?.imageUrl || "");

//   const integrationsIntro: string = String(app?.integrations?.intro || "");
//   const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
//     ? app.integrations.items
//     : [];
//   const techStack = app?.techStack || {};

//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ] as const;

//   const isPremium:boolean = true

//   return (
//     <main className="px-3 md:px-4 py-4 max-w-245 mx-auto">
//       {/* Back */}
//       <a
//         href={`/u/${user.username}`}
//         className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary font-medium"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         {user.displayName || user.username}
//       </a>

//       {/* HERO */}
//       <div className="mt-4 group border-2 border-dashed border-slate-200 rounded-xl p-3 md:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
//         <div className="flex items-start gap-4">
//           {iconUrl ? (
//             <div className="h-16 w-16">
//               <ClickToViewImage
//                 src={iconUrl}
//                 alt={`${app?.name || "App"} icon`}
//                 viewerAspect={1} // square logo
//                 className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white cursor-pointer"
//               />
//             </div>
//           ) : (
//             <div className="h-16 w-16 rounded-2xl border border-slate-200 bg-white grid place-items-center">
//               <AppWindow className="w-6 h-6 text-primary" />
//             </div>
//           )}
//           <div className="flex-1">
//             <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-serif">
//               {app.name}
//             </h1>

//             {app.shortDescription ? (
//               <p className="mt-2 text-sm text-slate-600 font-serif">{app.shortDescription}</p>
//             ) : null}

//             <div className="mt-3 flex flex-wrap items-center gap-2">
//               {platforms.map((p: string) => (
//                 <Pill key={p}>{platformLabel(p)}</Pill>
//               ))}
//               {/* {app?.status ? <Pill>{String(app.status)}</Pill> : null}
//               {app?.visibility ? <Pill>{String(app.visibility)}</Pill> : null} */}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* App Overview */}
//       {overviewBullets.length ? (
//         <SectionCard
//           title="App Overview"
//           subtitle="The quickest way to understand what this app does."
//           icon={<Layers className="w-4 h-4" />}
//         >
//           <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
//             {overviewBullets.map((b, idx) => (
//               <li key={idx}>{String(b)}</li>
//             ))}
//           </ul>
//         </SectionCard>
//       ) : null}

//       {/* Tech Stack */}
//       {techGroups.length ? (
//         <SectionCard
//           title="Tech Stack"
//           subtitle="Technologies used to build this app."
//           icon={<Wrench className="w-4 h-4" />}
//         >
//           <div className="grid gap-4">
//             {techGroups.map((g) => (
//               <div key={g.key}>
//                 <div className="text-xs font-black text-slate-700 font-serif">{g.label}</div>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {g.items.map((id: any) => (
//                     <TechBadge key={id} id={id} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </SectionCard>
//       ) : null}

//       {/* Integrations & Key Decisions */}
//       {(integrationsIntro || integrationsItems.length) ? (
//         <SectionCard
//           title="Integrations & Key Decisions"
//           subtitle="Things that matter in interviews: auth, storage, messaging, maps, etc."
//           icon={<GitBranch className="w-4 h-4" />}
//         >
//           {integrationsIntro ? (
//             <p className="text-sm text-slate-700 font-serif">{integrationsIntro}</p>
//           ) : null}

//           {integrationsItems.length ? (
//             <div className="mt-3 grid gap-2">
//               {integrationsItems.map((it, idx) => (
//                 <div
//                   key={idx}
//                   className="rounded-xl border border-slate-200 bg-white px-4 py-3"
//                 >
//                   <div className="text-xs font-black text-slate-700 font-serif">{String(it.key || "")}</div>
//                   <div className="mt-1 text-sm text-slate-700 font-serif">{String(it.value || "")}</div>
//                 </div>
//               ))}
//             </div>
//           ) : null}
//         </SectionCard>
//       ) : null}

//       {/* Architecture */}
//       {architectureImageUrl ? (
//         <SectionCard
//           title="Architecture Overview"
//           subtitle="High-level system design."
//           icon={<Network className="w-4 h-4" />}
//         >
//           <ClickToViewImage
//             src={architectureImageUrl}
//             alt="Architecture diagram"
//             viewerAspect={16 / 9} // diagrams usually wide; adjust if yours is different
//             className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
//           />
//         </SectionCard>
//       ) : null}

//       {/* User Flow */}
//       {(userFlowBullets.length || userFlowImageUrl) ? (
//         <SectionCard
//           title="User Flow"
//           subtitle={userFlowTextMode ? `Mode: ${userFlowTextMode}` : "How a user moves through the app."}
//           icon={<Network className="w-4 h-4" />}
//         >
//           {userFlowBullets.length ? (
//             <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
//               {userFlowBullets.map((b, idx) => (
//                 <li key={idx}>{String(b)}</li>
//               ))}
//             </ul>
//           ) : null}

//           {userFlowImageUrl ? (
//             <img
//               src={userFlowImageUrl}
//               alt="User flow diagram"
//               className="mt-4 w-full rounded-xl border border-slate-200 bg-white"
//               loading="lazy"
//             />
//           ) : null}
//         </SectionCard>
//       ) : null}

//       {/* Challenges & Tradeoffs */}
//       {(challengesIntro || challengesBullets.length) ? (
//         <SectionCard
//           title="Challenges & Tradeoffs"
//           subtitle="What was hard, what you chose, and what you’d improve next."
//           icon={<GitBranch className="w-4 h-4" />}
//         >
//           {challengesIntro ? (
//             <p className="text-sm text-slate-700 font-serif">{challengesIntro}</p>
//           ) : null}

//           {challengesBullets.length ? (
//             <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-700 font-serif">
//               {challengesBullets.map((b, idx) => (
//                 <li key={idx}>{String(b)}</li>
//               ))}
//             </ul>
//           ) : null}
//         </SectionCard>
//       ) : null}

//       {/* Screenshots */}
//       {screenshots.length ? (
//         <SectionCard
//           title="Screenshots"
//           // subtitle="Click any screenshot to view."
//           icon={<Layers className="w-4 h-4" />}
//         >
//           <PublicScreenshots
//             appName={app?.name}
//             imageUrls={screenshots.map((s: any) => s.url)}
//             isPremium={isPremium}
//             platforms={platforms}
//           />
//         </SectionCard>
//       ) : null}

//       <div className="mt-8 text-xs text-slate-400 font-mono">
//         Built with Appfolio • {user.displayName || user.username}
//       </div>
//     </main>
//   );
// }


//V2
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import { TECH_CATALOG } from "@/lib/techCatalog";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   Apple,
//   Smartphone,
//   Lock,
//   User,
// } from "lucide-react";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function initials(name: string) {
//   const parts = (name || "").split(/\s+/).filter(Boolean);
//   const a = parts[0]?.[0] ?? "";
//   const b = parts[1]?.[0] ?? "";
//   return (a + b).toUpperCase();
// }

// function getTechById(id: string) {
//   return TECH_CATALOG.find((t) => t.id === id);
// }

// function Pill({
//   children,
//   variant = "default",
// }: {
//   children: React.ReactNode;
//   variant?: "default" | "success";
// }) {
//   const cls =
//     variant === "success"
//       ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//       : "border-slate-200 bg-white text-slate-700";

//   return (
//     <span
//       className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
//     >
//       {children}
//     </span>
//   );
// }

// function SectionTitle({
//   title,
//   subtitle,
// }: {
//   title: string;
//   subtitle?: string;
// }) {
//   return (
//     <div className="mt-8">
//       <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
//       {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
//     </div>
//   );
// }

// function Card({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={`mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
//       {children}
//     </div>
//   );
// }

// function CardInner({ children }: { children: React.ReactNode }) {
//   return <div className="p-4 md:p-6">{children}</div>;
// }

// function SectionCard({
//   title,
//   subtitle,
//   icon,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <Card>
//       <CardInner>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className="flex items-center gap-2">
//               {icon ? (
//                 <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
//                   {icon}
//                 </span>
//               ) : null}
//               <h3 className="text-base font-semibold text-slate-900">{title}</h3>
//             </div>
//             {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
//           </div>
//         </div>

//         <div className="mt-4">{children}</div>
//       </CardInner>
//     </Card>
//   );
// }

// function TechBadge({ id }: { id: string }) {
//   const item = getTechById(id);
//   const name = item?.name ?? id;

//   return (
//     <span className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
//       {item?.iconClass ? (
//         <i className={`${item.iconClass} colored`} style={{ fontSize: 34, lineHeight: 1 }} />
//       ) : (
//         <span className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 text-xs font-black grid place-items-center">
//           {initials(name)}
//         </span>
//       )}
//       <span className="text-[11px] font-semibold text-slate-700 text-center">{name}</span>
//     </span>
//   );
// }

// function parseUserFlow(bullets: string[]) {
//   const clean = bullets.map((b) => String(b || "").trim()).filter(Boolean);
//   if (!clean.length) return { steps: [], fallback: clean };

//   // Case 1: multiple "Title: a, b, c"
//   const colonish = clean.filter((b) => b.includes(":"));
//   if (colonish.length >= Math.max(2, Math.ceil(clean.length * 0.6))) {
//     const steps = clean.map((b) => {
//       const [t, rest] = b.split(":");
//       const items =
//         (rest || "")
//           .split(",")
//           .map((x) => x.trim())
//           .filter(Boolean) || [];
//       return { title: t.trim() || "Step", items };
//     });
//     return { steps, fallback: clean };
//   }

//   // Case 2: single "A -> B -> C"
//   if (clean.length === 1 && clean[0].includes("->")) {
//     const parts = clean[0].split("->").map((x) => x.trim()).filter(Boolean);
//     const steps = parts.map((p) => ({ title: p, items: [] as string[] }));
//     return { steps, fallback: clean };
//   }

//   return { steps: [], fallback: clean };
// }

// function FlowStepCard({
//   title,
//   items,
// }: {
//   title: string;
//   items: string[];
// }) {
//   return (
//     <div className="min-w-[180px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-2">
//         <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
//           <AppWindow className="h-4 w-4" />
//         </span>
//         <div className="text-sm font-semibold text-slate-900">{title}</div>
//       </div>

//       {items?.length ? (
//         <div className="mt-2 space-y-1">
//           {items.map((it, idx) => (
//             <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
//               <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
//               <span className="truncate">{it}</span>
//             </div>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");
//   const architectureSummary: string = String(app?.architectureSummary || ""); // optional field, safe fallback

//   const userFlowTextMode: string = String(app?.userFlowText?.mode || "");
//   const userFlowBullets: string[] = Array.isArray(app?.userFlowText?.bullets) ? app.userFlowText.bullets : [];
//   const userFlowImageUrl: string = String(app?.userFlowDiagram?.imageUrl || "");

//   const integrationsIntro: string = String(app?.integrations?.intro || "");
//   const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
//     ? app.integrations.items
//     : [];

//   const techStack = app?.techStack || {};
//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ] as const;

//   const status = String(app?.status || "");
//   const isLive = status.toUpperCase() === "LIVE";

//   const isPremium: boolean = true;

//   const flowParsed = parseUserFlow(userFlowBullets);

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
//         <a
//           href={`/u/${user.username}`}
//           className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           {user.displayName || user.username}
//         </a>

//         <div className="mt-5 flex items-start gap-4">
//           {iconUrl ? (
//             <ClickToViewImage
//               src={iconUrl}
//               alt={`${app?.name || "App"} icon`}
//               viewerAspect={1}
//               className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white cursor-pointer"
//             />
//           ) : (
//             <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-white grid place-items-center">
//               <AppWindow className="w-6 h-6 text-slate-700" />
//             </div>
//           )}

//           <div className="flex-1">
//             <div className="flex flex-wrap items-center gap-2">
//               <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
//                 {app.name}
//               </h1>
//               {isLive ? <Pill variant="success">Live</Pill> : null}
//             </div>

//             <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
//               {platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE") ? (
//                 <span className="inline-flex items-center gap-1">
//                   <Apple className="h-4 w-4" />
//                 </span>
//               ) : null}
//               {platforms.some((p) => String(p).toUpperCase() === "ANDROID") ? (
//                 <span className="inline-flex items-center gap-1">
//                   <Smartphone className="h-4 w-4" />
//                 </span>
//               ) : null}

//               {app?.visibility ? (
//                 <span className="inline-flex items-center gap-1">
//                   <Lock className="h-4 w-4" />
//                   {String(app.visibility)}
//                 </span>
//               ) : null}

//               <span className="inline-flex items-center gap-1">
//                 <User className="h-4 w-4" />
//                 {user.username}
//               </span>
//             </div>

//             {app.shortDescription ? (
//               <p className="mt-3 text-sm text-slate-600">{app.shortDescription}</p>
//             ) : null}
//           </div>
//         </div>

//         {overviewBullets.length ? (
//           <SectionCard title="App Overview" icon={<Layers className="w-4 h-4" />}>
//             <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
//               {overviewBullets.map((b, idx) => (
//                 <li key={idx}>{String(b)}</li>
//               ))}
//             </ul>
//           </SectionCard>
//         ) : null}

//         {screenshots.length ? (
//           <>
//             <SectionTitle title="Screens Gallery" subtitle="A look inside the app" />
//             <Card>
//               <CardInner>
//                 <PublicScreenshots
//                   appName={app?.name}
//                   imageUrls={screenshots.map((s: any) => s.url)}
//                   isPremium={isPremium}
//                   platforms={platforms}
//                 />
//               </CardInner>
//             </Card>
//           </>
//         ) : null}

//         {(userFlowBullets.length || userFlowImageUrl) ? (
//           <>
//             <SectionTitle
//               title="User Flow"
//               subtitle={userFlowTextMode ? `Mode: ${userFlowTextMode}` : "How a user moves through the app"}
//             />

//             <Card>
//               <CardInner>
//                 {flowParsed.steps.length ? (
//                   <div className="w-full overflow-x-auto">
//                     <div className="flex items-center gap-4 min-w-max">
//                       {flowParsed.steps.map((s, idx) => (
//                         <React.Fragment key={`${s.title}-${idx}`}>
//                           <FlowStepCard title={s.title} items={s.items} />
//                           {idx !== flowParsed.steps.length - 1 ? (
//                             <span className="text-slate-300 text-xl select-none">→</span>
//                           ) : null}
//                         </React.Fragment>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     {flowParsed.fallback.length ? (
//                       <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
//                         {flowParsed.fallback.map((b, idx) => (
//                           <li key={idx}>{String(b)}</li>
//                         ))}
//                       </ul>
//                     ) : null}

//                     {userFlowImageUrl ? (
//                       <img
//                         src={userFlowImageUrl}
//                         alt="User flow diagram"
//                         className="mt-4 w-full rounded-xl border border-slate-200 bg-white"
//                         loading="lazy"
//                       />
//                     ) : null}
//                   </>
//                 )}
//               </CardInner>
//             </Card>
//           </>
//         ) : null}

//         {architectureImageUrl ? (
//           <>
//             <SectionTitle title="Architecture Overview" />
//             <Card>
//               <CardInner>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
//                   <div>
//                     <p className="text-sm text-slate-600 leading-relaxed">
//                       {architectureSummary
//                         ? architectureSummary
//                         : "High-level architecture showing how the app, backend, and providers connect."}
//                     </p>
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       {platforms.map((p: string) => (
//                         <Pill key={p}>{platformLabel(p)}</Pill>
//                       ))}
//                     </div>
//                   </div>

//                   <ClickToViewImage
//                     src={architectureImageUrl}
//                     alt="Architecture diagram"
//                     viewerAspect={16 / 9}
//                     className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
//                   />
//                 </div>
//               </CardInner>
//             </Card>
//           </>
//         ) : null}

//         {techGroups.some((g) => g.items?.length) ? (
//           <SectionCard
//             title="Tech Stack"
//             subtitle="Technologies used to build this app."
//             icon={<Wrench className="w-4 h-4" />}
//           >
//             <div className="grid gap-4">
//               {techGroups.map((g) =>
//                 g.items?.length ? (
//                   <div key={g.key}>
//                     <div className="text-xs font-semibold text-slate-700">{g.label}</div>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {g.items.map((id: any) => (
//                         <TechBadge key={id} id={id} />
//                       ))}
//                     </div>
//                   </div>
//                 ) : null
//               )}
//             </div>
//           </SectionCard>
//         ) : null}

//         {(integrationsIntro || integrationsItems.length) ? (
//           <SectionCard
//             title="Integrations & Key Decisions"
//             subtitle="Auth, storage, messaging, maps, etc."
//             icon={<GitBranch className="w-4 h-4" />}
//           >
//             {integrationsIntro ? <p className="text-sm text-slate-700">{integrationsIntro}</p> : null}

//             {integrationsItems.length ? (
//               <div className="mt-3 grid gap-2">
//                 {integrationsItems.map((it, idx) => (
//                   <div key={idx} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
//                     <div className="text-xs font-semibold text-slate-700">{String(it.key || "")}</div>
//                     <div className="mt-1 text-sm text-slate-700">{String(it.value || "")}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : null}
//           </SectionCard>
//         ) : null}

//         {(challengesIntro || challengesBullets.length) ? (
//           <>
//             <SectionTitle title="Challenges & Trade-offs" />
//             <Card>
//               <CardInner>
//                 {challengesIntro ? <p className="text-sm text-slate-700">{challengesIntro}</p> : null}
//                 {challengesBullets.length ? (
//                   <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-700">
//                     {challengesBullets.map((b, idx) => (
//                       <li key={idx}>{String(b)}</li>
//                     ))}
//                   </ul>
//                 ) : null}
//               </CardInner>
//             </Card>
//           </>
//         ) : null}

//         <div className="mt-10 text-xs text-slate-400">
//           Built with Appfolio • {user.displayName || user.username}
//         </div>
//       </div>
//     </main>
//   );
// }


// V 3

// app/u/[username]/[slug]/page.tsx
// Next.js App Router + Tailwind version of the same layout.
// Assumes Tailwind is set up in your project.

// import { FaAndroid, FaApple, FaWindows } from "react-icons/fa";
// import { HiArrowRight } from "react-icons/hi";
// import { FiCheck } from "react-icons/fi";
// import { MdPhoneIphone } from "react-icons/md";
// import { PiDatabase } from "react-icons/pi";
// import { FiCloud } from "react-icons/fi";
// import { FaPlug } from "react-icons/fa6";
// import { FiServer } from "react-icons/fi";

// type Platform = "Android" | "iOS" | "Windows";

// export default function PublicAppPage() {
//   const app = {
//     name: "TaskMaster Pro",
//     platforms: ["Android", "iOS", "Windows"] as Platform[],
//     overview: [
//       { strong: "Task management & productivity", muted: "with a clean, fast UI." },
//       { strong: "Organize, track, and prioritize", muted: "tasks across projects." },
//       { strong: "Reminders & deadlines", muted: "to ensure nothing slips." },
//       { strong: "Collaboration ready", muted: "for teams (comments, assignments)." },
//     ],
//     challenges: [
//       { strong: "Performance", muted: "vs. feature complexity (kept flows snappy)." },
//       { strong: "Security & privacy", muted: "vs. friction (balanced auth UX)." },
//       { strong: "Offline support", muted: "vs. real-time sync (clear conflict strategy)." },
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_10%_40%,rgba(29,78,216,0.08),transparent_60%),linear-gradient(#f7fbff,#eef3f8)] text-slate-900">
//       <div className="mx-auto max-w-[1080px] px-4 pb-14 pt-7">
//         {/* HERO */}
//         <header className="text-center">
//           <div className="inline-flex items-center gap-4 px-3 py-2">
//             {/* Logo (replace with <Image .../> if you have a logo PNG) */}
//             <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500 text-white shadow-[0_10px_18px_rgba(2,6,23,0.16)]">
//               <FiCheck className="h-8 w-8" />
//             </div>

//             <h1 className="text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">
//               {app.name}
//             </h1>
//           </div>

//           <div className="mt-3 inline-flex items-center gap-3 border-t border-slate-900/10 px-4 py-3">
//             <span className="text-sm font-semibold text-slate-500">Available on:</span>
//             <div className="flex flex-wrap items-center justify-center gap-3">
//               <PlatformPill platform="Android" />
//               <PlatformPill platform="iOS" />
//               <PlatformPill platform="Windows" />
//             </div>
//           </div>

//           <div className="mt-5 h-px w-full bg-slate-900/10" />
//         </header>

//         {/* OVERVIEW */}
//         <Section title="App Overview" subtitle="What it does & why it matters">
//           <ul className="list-disc space-y-3 pl-5">
//             {app.overview.map((item, idx) => (
//               <li key={idx} className="leading-relaxed">
//                 <b>{item.strong}</b>{" "}
//                 <span className="text-slate-500">{item.muted}</span>
//               </li>
//             ))}
//           </ul>
//         </Section>

//         {/* USER FLOW */}
//         <Section title="User Flow" subtitle="How a user experiences the app">
//           <div className="flex flex-wrap items-center justify-center gap-4">
//             <FlowPhone title="Splash Screen" variant="splash" />
//             <ArrowDot />
//             <FlowPhone title="Login & Signup" variant="login" />
//             <ArrowDot />
//             <FlowPhone title="Task Dashboard" variant="dashboard" />
//             <ArrowDot />
//             <FlowPhone title="Task Details" variant="details" />
//           </div>

//           <div className="mt-5 h-px w-full bg-slate-900/10" />
//         </Section>

//         {/* ARCHITECTURE */}
//         <Section title="Architecture Diagram" subtitle="High-level system design">
//           <div className="flex justify-center">
//             <div className="w-full max-w-[820px] rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-[0_18px_34px_rgba(2,6,23,0.10)]">
//               <div className="grid items-center gap-3 md:grid-cols-[170px_1fr_220px]">
//                 <ArchNode
//                   icon={<MdPhoneIphone className="h-5 w-5" />}
//                   label="Mobile App"
//                   primary
//                 />

//                 {/* Line (hidden on small screens like in the HTML version) */}
//                 <div className="hidden h-[70px] md:block">
//                   <svg viewBox="0 0 600 120" className="h-full w-full">
//                     <defs>
//                       <marker
//                         id="arrow"
//                         markerWidth="10"
//                         markerHeight="10"
//                         refX="7"
//                         refY="3"
//                         orient="auto"
//                       >
//                         <path d="M0,0 L0,6 L9,3 z" fill="rgba(100,116,139,0.9)" />
//                       </marker>
//                     </defs>
//                     <line
//                       x1="10"
//                       y1="60"
//                       x2="590"
//                       y2="60"
//                       stroke="rgba(100,116,139,0.55)"
//                       strokeWidth="4"
//                       markerEnd="url(#arrow)"
//                     />
//                   </svg>
//                 </div>

//                 <ArchNode
//                   icon={<FiServer className="h-5 w-5" />}
//                   label="API Server"
//                   primary
//                 />
//               </div>

//               <div className="mt-4 grid gap-3 md:grid-cols-3">
//                 <MiniNode icon={<PiDatabase className="h-5 w-5" />} label="Database" />
//                 <MiniNode icon={<FiCloud className="h-5 w-5" />} label="Storage" />
//                 <MiniNode icon={<FaPlug className="h-5 w-5" />} label="Third-Party Services" />
//               </div>
//             </div>
//           </div>

//           <div className="mt-5 h-px w-full bg-slate-900/10" />
//         </Section>

//         {/* CHALLENGES */}
//         <Section title="Challenges & Tradeoffs" subtitle="What you optimized for">
//           <ul className="list-disc space-y-3 pl-5">
//             {app.challenges.map((item, idx) => (
//               <li key={idx} className="leading-relaxed">
//                 <b>{item.strong}</b>{" "}
//                 <span className="text-slate-500">{item.muted}</span>
//               </li>
//             ))}
//           </ul>

//           <div className="mt-5 h-px w-full bg-slate-900/10" />
//         </Section>

//         {/* SCREENSHOTS */}
//         <Section title="App Screenshots" subtitle="Wrapped in phone frames">
//           <div className="grid justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             <ShotPhone title="Home Screen" />
//             <ShotPhone title="Task List" />
//             <ShotPhone title="Calendar View" />
//             <ShotPhone title="Task Detail" />
//           </div>
//         </Section>
//       </div>
//     </div>
//   );
// }

// function Section({
//   title,
//   subtitle,
//   children,
// }: {
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="mt-6">
//       <div className="flex items-baseline gap-3 border-t border-slate-900/10 px-1 pb-2 pt-4">
//         <h2 className="text-[28px] font-extrabold tracking-[-0.01em]">{title}</h2>
//         <p className="text-sm font-semibold text-slate-500">{subtitle}</p>
//       </div>

//       <div className="rounded-2xl border border-slate-900/10 bg-white/65 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.08)]">
//         {children}
//       </div>
//     </section>
//   );
// }

// function PlatformPill({ platform }: { platform: Platform }) {
//   const map = {
//     Android: { icon: <FaAndroid className="h-4 w-4" />, label: "Android" },
//     iOS: { icon: <FaApple className="h-4 w-4" />, label: "iOS" },
//     Windows: { icon: <FaWindows className="h-4 w-4" />, label: "Windows" },
//   } as const;

//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-2 text-[13px] font-extrabold text-slate-900 shadow-[0_8px_22px_rgba(2,6,23,0.05)]">
//       {map[platform].icon}
//       {map[platform].label}
//     </span>
//   );
// }

// function ArrowDot() {
//   return (
//     <div className="grid h-11 w-11 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-500 shadow-[0_12px_20px_rgba(2,6,23,0.06)]">
//       <HiArrowRight className="h-5 w-5" />
//     </div>
//   );
// }

// /** Phone frame */
// function PhoneFrame({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="relative w-[210px] rounded-[26px] bg-[#0b1220] p-[10px] shadow-[0_22px_40px_rgba(2,6,23,0.22)]">
//       {/* notch */}
//       <div className="absolute left-1/2 top-[10px] h-4 w-[70px] -translate-x-1/2 rounded-full bg-[#101a2c] opacity-90" />
//       <div className="h-[410px] overflow-hidden rounded-[18px] bg-gradient-to-b from-[#e8f0ff] to-white">
//         {children}
//       </div>
//     </div>
//   );
// }

// /** Mock screens (replace with real screenshots later) */
// function MockScreen({ density = 4, showCta = true }: { density?: number; showCta?: boolean }) {
//   return (
//     <div className="relative p-4">
//       <div className="h-10 rounded-xl border border-blue-600/20 bg-gradient-to-br from-blue-600/20 to-sky-500/15" />
//       <div className="mt-3 grid gap-3">
//         {Array.from({ length: density }).map((_, i) => (
//           <div
//             key={i}
//             className="h-11 rounded-xl border border-slate-900/10 bg-slate-900/[0.03]"
//           />
//         ))}
//       </div>

//       {showCta && (
//         <div className="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-gradient-to-br from-blue-700 to-blue-600 shadow-[0_14px_24px_rgba(29,78,216,0.28)]" />
//       )}
//     </div>
//   );
// }

// function FlowPhone({
//   title,
//   variant,
// }: {
//   title: string;
//   variant: "splash" | "login" | "dashboard" | "details";
// }) {
//   const cfg =
//     variant === "splash"
//       ? { density: 3, showCta: false }
//       : variant === "login"
//       ? { density: 3, showCta: true }
//       : variant === "dashboard"
//       ? { density: 4, showCta: true }
//       : { density: 3, showCta: true };

//   return (
//     <div className="flex flex-col items-center">
//       <PhoneFrame>
//         <MockScreen density={cfg.density} showCta={cfg.showCta} />
//       </PhoneFrame>
//       <div className="mt-2 text-center font-extrabold text-slate-900">{title}</div>
//     </div>
//   );
// }

// function ShotPhone({ title }: { title: string }) {
//   return (
//     <div className="flex flex-col items-center">
//       <PhoneFrame>
//         <MockScreen density={4} showCta />
//       </PhoneFrame>
//       <div className="mt-2 text-center font-extrabold text-slate-900">{title}</div>
//     </div>
//   );
// }

// function ArchNode({
//   icon,
//   label,
//   primary,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   primary?: boolean;
// }) {
//   return (
//     <div
//       className={[
//         "rounded-2xl border px-4 py-3 text-center font-extrabold",
//         primary
//           ? "border-blue-700/25 bg-gradient-to-br from-blue-700/15 to-sky-500/10"
//           : "border-slate-900/10 bg-slate-900/[0.02] text-slate-500",
//       ].join(" ")}
//     >
//       <div className="inline-flex items-center gap-2">
//         {icon}
//         {label}
//       </div>
//     </div>
//   );
// }

// function MiniNode({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="rounded-2xl border border-slate-900/10 bg-white/65 px-4 py-3 text-center font-extrabold">
//       <div className="inline-flex items-center gap-2">
//         {icon}
//         <span className="text-slate-900">{label}</span>
//       </div>
//     </div>
//   );
// }


//V4
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import { TECH_CATALOG } from "@/lib/techCatalog";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   ArrowRight,
// } from "lucide-react";
// import { PhoneFrame } from "@/components/PhoneFrame";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function initials(name: string) {
//   const parts = (name || "").split(/\s+/).filter(Boolean);
//   const a = parts[0]?.[0] ?? "";
//   const b = parts[1]?.[0] ?? "";
//   return (a + b).toUpperCase();
// }

// function getTechById(id: string) {
//   return TECH_CATALOG.find((t) => t.id === id);
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
//       {children}
//     </span>
//   );
// }

// function TechBadge({ id }: { id: string }) {
//   const item = getTechById(id);
//   const name = item?.name ?? id;

//   return (
//     <span className="flex w-[110px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm">
//       {item?.iconClass ? (
//         <i className={`${item.iconClass} colored`} style={{ fontSize: 34, lineHeight: 1 }} />
//       ) : (
//         <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[11px] font-black text-slate-700">
//           {initials(name)}
//         </span>
//       )}
//       <span className="text-center text-[11px] font-semibold text-slate-700">{name}</span>
//     </span>
//   );
// }

// function Section({
//   title,
//   subtitle,
//   icon,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="mt-8">
//       <div className="flex items-baseline gap-3 border-t border-slate-900/10 px-1 pb-2 pt-5">
//         <div className="flex items-center gap-2">
//           {icon ? <span className="text-primary">{icon}</span> : null}
//           <h2 className="text-[26px] font-extrabold tracking-[-0.01em] text-slate-900">
//             {title}
//           </h2>
//         </div>
//         {subtitle ? <p className="text-sm font-semibold text-slate-500">{subtitle}</p> : null}
//       </div>

//       <div className="rounded-2xl border border-slate-900/10 bg-white/65 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.08)]">
//         {children}
//       </div>
//     </section>
//   );
// }

// function FlowArrow() {
//   return (
//     <div className="hidden md:grid h-11 w-11 place-items-center rounded-full border border-slate-900/10 bg-white/80 text-slate-500 shadow-sm">
//       <ArrowRight className="h-5 w-5" />
//     </div>
//   );
// }

// function PhoneStep({
//   label,
//   imgUrl,
// }: {
//   label: string;
//   imgUrl?: string;
// }) {
//   return (
//     <div className="flex flex-col items-center">
//       <div className="w-52.5">
//         <PhoneFrame>
//           {imgUrl ? (
//             <img
//               src={imgUrl}
//               alt={label}
//               className="h-full w-full object-cover"
//               loading="lazy"
//             />
//           ) : (
//             // fallback mock screen (keeps it looking good even without images)
//             <div className="h-full w-full bg-gradient-to-b from-blue-50 to-white p-4">
//               <div className="h-10 rounded-xl border border-blue-600/20 bg-gradient-to-br from-blue-600/20 to-sky-500/15" />
//               <div className="mt-3 grid gap-3">
//                 <div className="h-11 rounded-xl border border-slate-900/10 bg-slate-900/[0.03]" />
//                 <div className="h-11 rounded-xl border border-slate-900/10 bg-slate-900/[0.03]" />
//                 <div className="h-11 rounded-xl border border-slate-900/10 bg-slate-900/[0.03]" />
//                 <div className="h-11 rounded-xl border border-slate-900/10 bg-slate-900/[0.03]" />
//               </div>
//               <div className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-gradient-to-br from-blue-700 to-blue-600 shadow-[0_14px_24px_rgba(29,78,216,0.28)]" />
//             </div>
//           )}
//         </PhoneFrame>
//       </div>
      

//       <div className="mt-2 text-center text-sm font-extrabold text-slate-900">{label}</div>
//     </div>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

//   const userFlowTextMode: string = String(app?.userFlowText?.mode || "");
//   const userFlowBullets: string[] = Array.isArray(app?.userFlowText?.bullets) ? app.userFlowText.bullets : [];
//   const userFlowImageUrl: string = String(app?.userFlowDiagram?.imageUrl || "");

//   const integrationsIntro: string = String(app?.integrations?.intro || "");
//   const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
//     ? app.integrations.items
//     : [];

//   const techStack = app?.techStack || {};
//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ] as const;

//   const flowSteps = [
//     { label: "Splash Screen", imgUrl: "" },
//     { label: "Login & Signup", imgUrl: "" },
//     { label: "Dashboard", imgUrl: "" },
//     { label: "Details", imgUrl: "" },
//   ];

//   const isPremium = true;

//   return (
//     <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_10%_40%,rgba(29,78,216,0.08),transparent_60%),linear-gradient(#f7fbff,#eef3f8)]">
//       <div className="mx-auto max-w-[1080px] px-3 pb-14 pt-6 md:px-4">
//         {/* Back */}
//         <a
//           href={`/u/${user.username}`}
//           className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           {user.displayName || user.username}
//         </a>

//         {/* HERO (centered + clean like mock) */}
//         <header className="mt-6 text-center">
//           <div className="inline-flex items-center gap-4">
//             {iconUrl ? (
//               <ClickToViewImage
//                 src={iconUrl}
//                 alt={`${app?.name || "App"} icon`}
//                 viewerAspect={1}
//                 className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm"
//               />
//             ) : (
//               <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-900/10 bg-white shadow-sm">
//                 <AppWindow className="h-6 w-6 text-primary" />
//               </div>
//             )}

//             <h1 className="text-4xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-5xl">
//               {app.name}
//             </h1>
//           </div>

//           {app.shortDescription ? (
//             <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-600">
//               {app.shortDescription}
//             </p>
//           ) : null}

//           <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 border-t border-slate-900/10 px-4 py-3">
//             <span className="text-sm font-semibold text-slate-500">Available on:</span>
//             {platforms.map((p) => (
//               <Pill key={p}>{platformLabel(p)}</Pill>
//             ))}
//           </div>

//           <div className="mt-5 h-px w-full bg-slate-900/10" />
//         </header>

//         {/* App Overview */}
//         {overviewBullets.length ? (
//           <Section
//             title="App Overview"
//             subtitle="The quickest way to understand what this app does."
//             icon={<Layers className="h-4 w-4" />}
//           >
//             <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
//               {overviewBullets.map((b, idx) => (
//                 <li key={idx}>{String(b)}</li>
//               ))}
//             </ul>
//           </Section>
//         ) : null}

//         {/* User Flow (phone frames + arrows + optional diagram) */}
//         {/* {(userFlowBullets.length || userFlowImageUrl) ? (
//           <Section
//             title="User Flow"
//             subtitle={userFlowTextMode ? `Mode: ${userFlowTextMode}` : "How a user moves through the app."}
//             icon={<Network className="h-4 w-4" />}
//           >
//             {userFlowBullets.length ? (
//               <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
//                 {userFlowBullets.map((b, idx) => (
//                   <li key={idx}>{String(b)}</li>
//                 ))}
//               </ul>
//             ) : null}

//             <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
//               {flowSteps.map((s, idx) => (
//                 <React.Fragment key={s.label}>
//                   <PhoneStep label={s.label} imgUrl={s.imgUrl || undefined} />
//                   {idx < flowSteps.length - 1 ? <FlowArrow /> : null}
//                 </React.Fragment>
//               ))}
//             </div>

//             {userFlowImageUrl ? (
//               <div className="mt-6">
//                 <ClickToViewImage
//                   src={userFlowImageUrl}
//                   alt="User flow diagram"
//                   viewerAspect={16 / 9}
//                   className="w-full overflow-hidden rounded-xl border border-slate-900/10 bg-white"
//                 />
//               </div>
//             ) : null}
//           </Section>
//         ) : null} */}

//         {/* Architecture */}
//         {architectureImageUrl ? (
//           <Section
//             title="Architecture Diagram"
//             subtitle="High-level system design."
//             icon={<Network className="h-4 w-4" />}
//           >
//             <ClickToViewImage
//               src={architectureImageUrl}
//               alt="Architecture diagram"
//               viewerAspect={16 / 9}
//               className="w-full overflow-hidden rounded-xl border border-slate-900/10 bg-white"
//             />
//           </Section>
//         ) : null}

//         {/* Tech Stack */}
//         {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
//           <Section
//             title="Tech Stack"
//             subtitle="Technologies used to build this app."
//             icon={<Wrench className="h-4 w-4" />}
//           >
//             <div className="grid gap-5">
//               {techGroups
//                 .filter((g) => (g.items?.length ?? 0) > 0)
//                 .map((g) => (
//                   <div key={g.key}>
//                     <div className="text-xs font-extrabold text-slate-700">{g.label}</div>
//                     <div className="mt-3 flex flex-wrap gap-3">
//                       {g.items.map((id: any) => (
//                         <TechBadge key={id} id={id} />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </Section>
//         ) : null}

//         {/* Integrations & Key Decisions */}
//         {integrationsIntro || integrationsItems.length ? (
//           <Section
//             title="Integrations & Key Decisions"
//             subtitle="Things that matter in interviews: auth, storage, messaging, maps, etc."
//             icon={<GitBranch className="h-4 w-4" />}
//           >
//             {integrationsIntro ? (
//               <p className="text-sm text-slate-700">{integrationsIntro}</p>
//             ) : null}

//             {integrationsItems.length ? (
//               <div className="mt-4 grid gap-3 md:grid-cols-2">
//                 {integrationsItems.map((it, idx) => (
//                   <div
//                     key={idx}
//                     className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm"
//                   >
//                     <div className="text-xs font-extrabold text-slate-700">
//                       {String(it.key || "")}
//                     </div>
//                     <div className="mt-1 text-sm text-slate-700">{String(it.value || "")}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : null}
//           </Section>
//         ) : null}

//         {/* Challenges & Tradeoffs */}
//         {challengesIntro || challengesBullets.length ? (
//           <Section
//             title="Challenges & Tradeoffs"
//             subtitle="What was hard, what you chose, and what you’d improve next."
//             icon={<GitBranch className="h-4 w-4" />}
//           >
//             {challengesIntro ? <p className="text-sm text-slate-700">{challengesIntro}</p> : null}

//             {challengesBullets.length ? (
//               <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
//                 {challengesBullets.map((b, idx) => (
//                   <li key={idx}>{String(b)}</li>
//                 ))}
//               </ul>
//             ) : null}
//           </Section>
//         ) : null}

//         {/* Screenshots */}
//         {screenshots.length ? (
//           <Section title="App Screenshots" subtitle="Wrapped in phone frames." icon={<Layers className="h-4 w-4" />}>
//             <PublicScreenshots
//               appName={app?.name}
//               imageUrls={screenshots.map((s: any) => s.url)}
//               isPremium={true}
//               platforms={platforms}
//             />
//           </Section>
//         ) : null}

//         <div className="mt-10 text-center text-xs font-mono text-slate-400">
//           Built with Appfolio • {user.displayName || user.username}
//         </div>
//       </div>
//     </main>
//   );
// }


//V5
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import { TECH_CATALOG } from "@/lib/techCatalog";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   ArrowRight,
//   User,
//   TrendingUp 
// } from "lucide-react";
// import { PhoneFrame, NotchType } from "@/components/PhoneFrame";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";
// import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
// import PublicPageHero from "@/components/PublicPageHero";
// import PublicTechStack from "@/components/PublicTechStack";
// import Reveal from "@/components/Reveal";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function Section({
//   title,
//   subtitle,
//   icon,
//   children,
//   variant = "default",
//   divider = true,
// }: {
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
//   variant?: "default" | "showcase";
//   divider?: boolean;
// }) {
//   const wrapClass =
//     variant === "showcase" ? "mt-8 md:mt-10" : "mt-10 md:mt-12";

//   const bodyClass =
//     variant === "showcase"
//       ? "mt-4 rounded-3xl border border-slate-900/10 bg-white/75 p-3 sm:p-4 md:p-5"
//       : "mt-4 rounded-3xl border border-slate-900/10 bg-white/70 p-5 md:p-6";

//   return (
//     <section className={wrapClass}>
//       <div className="px-1">
//         <div className="flex items-start gap-3">
//           {icon ? (
//             <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 text-primary shadow-sm">
//               {icon}
//             </span>
//           ) : null}

//           <div>
//             <h2 className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.02em] text-slate-900 font-serif">
//               {title}
//             </h2>
//             {subtitle ? (
//               <p className="mt-1 max-w-3xl text-sm text-slate-600 font-serif">
//                 {subtitle}
//               </p>
//             ) : null}
//           </div>
//         </div>

//         {divider ? <div className="mt-4 h-px w-full bg-slate-900/10" /> : null}
//       </div>

//       <div className={bodyClass}>
//         <Reveal>
//          {children}
//         </Reveal>
//       </div>
//     </section>
//   );
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
//       {children}
//     </span>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const userFlowWalkthroughs = app?.userFlowWalkthroughs || null;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

//   const userFlowTextMode: string = String(app?.userFlowText?.mode || "");
//   const userFlowBullets: string[] = Array.isArray(app?.userFlowText?.bullets)
//     ? app.userFlowText.bullets
//     : [];

//   const userFlowImageUrl: string = String(app?.userFlowDiagram?.imageUrl || "");

//   const integrationsIntro: string = String(app?.integrations?.intro || "");
//   const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
//     ? app.integrations.items
//     : [];

//   const techStack = app?.techStack || {};
//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ] as const;

//   const flowCandidates = screenshots.slice(0, 4).map((s: any) => s?.url).filter(Boolean) as string[];

//   const flowSteps =
//     flowCandidates.length >= 2
//       ? [
//           { label: "Splash Screen", src: flowCandidates[0] },
//           { label: "Login & Signup", src: flowCandidates[1] || flowCandidates[0] },
//           { label: "Dashboard", src: flowCandidates[2] || flowCandidates[1] || flowCandidates[0] },
//           { label: "Details", src: flowCandidates[3] || flowCandidates[2] || flowCandidates[1] || flowCandidates[0] },
//         ]
//       : [];

//   const notch: NotchType =
//     platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE")
//       ? "iphone-pill"
//       : "android-center-hole";

//   return (
//     <main className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_10%_40%,rgba(29,78,216,0.08),transparent_60%),linear-gradient(#f7fbff,#eef3f8)]">
//       <div className="mx-auto max-w-270 px-3 pb-14 pt-6 md:px-4">
//         <div
//           className="
//             rounded-[28px]
//             border border-slate-900/10
//             bg-white/55
//             shadow-[0_18px_60px_rgba(2,6,23,0.10)]
//             backdrop-blur-md
//             px-3 py-6 sm:px-6 sm:py-8
//           "
//         >
//           {/* Back */}
//           <a
//             href={`/u/${user.username}`}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             {user.displayName || user.username}
//           </a>

//           {/* HERO (structured + recruiter-first) */}
//           <header className="mt-6">
//             <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.08)]">
//               <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                
//                 <div className="flex items-start gap-4">
//                   {iconUrl ? (
//                     <ClickToViewImage
//                       src={iconUrl}
//                       alt={`${app?.name || "App"} icon`}
//                       viewerAspect={1}
//                       className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm"
//                     />
//                   ) : (
//                     <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-900/10 bg-white shadow-sm">
//                       <AppWindow className="h-6 w-6 text-primary" />
//                     </div>
//                   )}

//                   <div className="min-w-0">
//                     <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-slate-900 font-serif sm:text-4xl">
//                       {app.name}
//                     </h1>

//                     {app.shortDescription ? (
//                       <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600 font-serif">
//                         {app.shortDescription}
//                       </p>
//                     ) : (
//                       <p className="mt-1 text-sm font-medium text-slate-500 font-serif">
//                         Mobile app case study
//                       </p>
//                     )}

                    
//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                       <span className="text-xs font-semibold text-slate-500 font-serif">
//                         Available on
//                       </span>
//                       {platforms.map((p) => (
//                         <Pill key={p}>{platformLabel(p)}</Pill>
//                       ))}

                      
//                       {app?.status ? <Pill>{String(app.status)}</Pill> : null}
//                       {app?.category ? <Pill>{String(app.category)}</Pill> : null}
//                     </div>
//                   </div>
//                 </div>

               
//                 <div className="flex flex-wrap items-center gap-2 sm:justify-end">
//                   {app?.links?.github ? (
//                     <a
//                       href={String(app.links.github)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       <GitBranch className="h-4 w-4" />
//                       GitHub
//                     </a>
//                   ) : null}

//                   {app?.links?.liveDemo ? (
//                     <a
//                       href={String(app.links.liveDemo)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//                     >
//                       <ArrowRight className="h-4 w-4" />
//                       Live
//                     </a>
//                   ) : null}

//                   {app?.links?.playStore ? (
//                     <a
//                       href={String(app.links.playStore)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       <ArrowRight className="h-4 w-4" />
//                       Play Store
//                     </a>
//                   ) : null}

//                   {app?.links?.appStore ? (
//                     <a
//                       href={String(app.links.appStore)}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       <ArrowRight className="h-4 w-4" />
//                       App Store
//                     </a>
//                   ) : null}
//                 </div>
//               </div>

              
//               <div className="mt-5 h-px w-full bg-slate-900/10" />

              
//               <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600 font-serif">
//                 <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
//                   Screenshots
//                 </span>
//                 <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
//                   User Flow
//                 </span>
//                 <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
//                   Architecture
//                 </span>
//                 <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
//                   Tech Stack
//                 </span>
//                 <span className="rounded-full bg-white/70 px-3 py-1.5 border border-slate-900/10">
//                   Key Decisions
//                 </span>
//               </div>
//             </div>
            
//           </header>

//           {/* My Role */}
//           {/* <Section
//             title="My Role"
//             subtitle="What I owned and contributed to this project."
//             icon={<User className="h-4 w-4" />}
//           >
//             <div className="grid gap-3 sm:grid-cols-3">
//               <div className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3">
//                 <div className="text-[11px] font-mono text-slate-400">Role</div>
//                 <div className="mt-1 text-sm font-semibold text-slate-800 font-serif">
//                   {app.role || "Solo Developer"}
//                 </div>
//               </div>
//               <div className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3">
//                 <div className="text-[11px] font-mono text-slate-400">Team Size</div>
//                 <div className="mt-1 text-sm font-semibold text-slate-800 font-serif">
//                   {app.teamSize || "1"}
//                 </div>
//               </div>
//               <div className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3">
//                 <div className="text-[11px] font-mono text-slate-400">Duration</div>
//                 <div className="mt-1 text-sm font-semibold text-slate-800 font-serif">
//                   {app.duration || "—"}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-3 flex flex-wrap gap-2">
//               {(app.responsibilities || []).map((r, i) => (
//                 <span key={i} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
//                   {r}
//                 </span>
//               ))}
//             </div>
//           </Section> */}

//           {/* Quantifiable Section */}
//           {/* <Section
//             title="Impact & Results"
//             subtitle="Measurable outcomes from this project."
//             icon={<TrendingUp className="h-4 w-4" />}
//           >
//             <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
//               {(app.metrics || []).map((m, i) => (
//                 <div key={i} className="rounded-2xl border border-slate-900/10 bg-white px-4 py-4 text-center">
//                   <div className="text-2xl font-extrabold text-primary">{m.value}</div>
//                   <div className="mt-1 text-xs font-medium text-slate-500 font-serif">{m.label}</div>
//                 </div>
//               ))}
//             </div>
//           </Section> */}

//           {/* Screenshots */}
//           {screenshots.length ? (
//             <Section title="Walkthrough" subtitle="" icon={<Layers className="h-4 w-4" />}>
//               <PublicScreenshots
//                 appName={app?.name}
//                 imageUrls={screenshots.map((s: any) => s.url)}
//                 isPremium={true}
//                 platforms={platforms}
//               />
//             </Section>
//           ) : null}

//           {/* App Overview */}
//           {overviewBullets.length ? (
//             <Section
//               title="App Overview"
//               subtitle="What it does, who it’s for, and what makes it useful."
//               icon={<Layers className="h-4 w-4" />}
//             >
//               {/* Quick stats (auto, no new fields) */}
//               <div className="mb-4 flex flex-wrap gap-2">
//                 <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700">
//                   {platforms.length ? platforms.map(platformLabel).join(" • ") : "Platform"}
//                 </span>

//                 <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700">
//                   {screenshots.length} screens
//                 </span>

//                 <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700">
//                   {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? "Tech stack included" : "Tech stack"}
//                 </span>

//                 <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700">
//                   {userFlowWalkthroughs?.flows?.length ? "User flows included" : "User flow"}
//                 </span>
//               </div>

//               {/* Bullets as “highlight cards” (more premium than list-disc) */}
//               <div className="grid gap-3 md:grid-cols-2">
//                 {overviewBullets.slice(0, 6).map((b, idx) => (
//                   <div
//                     key={idx}
//                     className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm"
//                   >
//                     <div className="text-xs font-mono text-slate-400">#{idx + 1}</div>
//                     <div className="mt-1 text-sm text-slate-700 font-serif leading-relaxed">
//                       {String(b)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* If there are more than 6 bullets, keep the rest as a simple list */}
//               {overviewBullets.length > 6 ? (
//                 <div className="mt-5">
//                   <div className="text-xs font-semibold text-slate-600">More details</div>
//                   <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 font-serif">
//                     {overviewBullets.slice(6).map((b, idx) => (
//                       <li key={`more-${idx}`}>{String(b)}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           {/* User Flow */}
//           {userFlowWalkthroughs?.flows?.length ? (
//             <Section
//               title="User Flow"
//               subtitle="Feature-wise flows: what happens, where, and how."
//               icon={<Network className="h-4 w-4" />}
//             >
//               <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
//             </Section>
//           ) : null}

//         {/* Architecture Diagram */}
//           {architectureImageUrl || integrationsIntro || integrationsItems.length ? (
//             <Section
//               title="System Design"
//               subtitle="Architecture + key decisions that shaped the implementation."
//               icon={<Network className="h-4 w-4" />}
//             >
//               {/* Diagram (top, full width) */}
//               {architectureImageUrl ? (
//                 <div>
//                   <ClickToViewImage
//                     src={architectureImageUrl}
//                     alt="Architecture diagram"
//                     viewerAspect={16 / 9}
//                     className="w-full overflow-hidden rounded-2xl border border-slate-900/10 bg-white"
//                   />
//                   <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-serif">
//                     <span>Click to view full size.</span>
//                     <span className="font-mono">Architecture</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 text-sm text-slate-600 font-serif">
//                   Architecture diagram not added yet.
//                 </div>
//               )}

//               {/* Decisions (bottom, within same section) */}
//               {(integrationsIntro || integrationsItems.length) ? (
//                 <div className="mt-6">
//                   <div className="flex items-baseline justify-between gap-3">
//                     <div>
//                       <div className="text-sm font-extrabold text-slate-900 font-serif">
//                         Integrations & Key Decisions
//                       </div>
//                       <div className="mt-1 text-xs text-slate-500 font-serif">
//                         Things recruiters ask about: auth, state, storage, messaging, maps, payments…
//                       </div>
//                     </div>
//                     <span className="text-[11px] font-mono text-slate-400">
//                       {integrationsItems.length ? `${integrationsItems.length} items` : ""}
//                     </span>
//                   </div>

//                   {integrationsIntro ? (
//                     <p className="mt-3 text-sm text-slate-700 font-serif">
//                       {integrationsIntro}
//                     </p>
//                   ) : null}

//                   {integrationsItems.length ? (
//                     <div className="mt-4 grid gap-3 md:grid-cols-2">
//                       {integrationsItems.map((it, idx) => (
//                         <div
//                           key={idx}
//                           className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm"
//                         >
//                           <div className="text-xs font-extrabold text-slate-700 font-serif">
//                             {String(it.key || "")}
//                           </div>
//                           <div className="mt-1 text-sm text-slate-700 font-serif">
//                             {String(it.value || "")}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="mt-3 text-sm text-slate-600 font-serif">
//                       No key decisions added.
//                     </div>
//                   )}
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           {/* Tech Stack */}
//           {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
//             <Section
//               title="Tech Stack"
//               subtitle="Technologies used to build this app."
//               icon={<Wrench className="h-4 w-4" />}
//             >
//               <PublicTechStack groups={techGroups as any} />
//             </Section>
//           ) : null}

//           {/* Challenges & Tradeoffs */}
//           {challengesIntro || challengesBullets.length ? (
//             <Section
//         title="Challenges & Tradeoffs"
//         subtitle="What was hard, what you chose, and what you’d improve next."
//         icon={<GitBranch className="h-4 w-4" />}
//       >
//         {/* Intro block */}
//         {challengesIntro ? (
//           <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4">
//             <div className="text-xs font-extrabold text-slate-800 font-serif">
//               Context
//             </div>
//             <p className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
//               {challengesIntro}
//             </p>
//           </div>
//         ) : null}

//         {/* Bullets as cards */}
//         {challengesBullets.length ? (
//                 <div className={challengesIntro ? "mt-5" : ""}>
//                   <div className="flex items-center justify-between">
//                     <div className="text-xs font-extrabold text-slate-800 font-serif">
//                       Key points
//                     </div>
//                     <div className="text-[11px] font-mono text-slate-400">
//                       {challengesBullets.length} items
//                     </div>
//                   </div>

//                   <div className="mt-3 grid gap-3 md:grid-cols-2">
//                     {challengesBullets.slice(0, 6).map((b, idx) => {
//                       const s = String(b || "");
//                       const lower = s.toLowerCase();

//                       // tiny heuristic labels (optional but nice)
//                       const tag =
//                         lower.includes("tradeoff") || lower.includes("chose") || lower.includes("instead")
//                           ? "Tradeoff"
//                           : lower.includes("next") || lower.includes("future") || lower.includes("improve")
//                           ? "Next"
//                           : "Challenge";

//                       const tagClass =
//                         tag === "Tradeoff"
//                           ? "bg-primary/10 text-primary border-primary/20"
//                           : tag === "Next"
//                           ? "bg-slate-900/5 text-slate-700 border-slate-900/10"
//                           : "bg-white text-slate-700 border-slate-900/10";

//                       return (
//                         <div
//                           key={idx}
//                           className="rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm"
//                         >
//                           <div className="flex items-center justify-between gap-3">
//                             <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${tagClass}`}>
//                               {tag}
//                             </span>
//                             <span className="text-[11px] font-mono text-slate-400">#{idx + 1}</span>
//                           </div>

//                           <div className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
//                             {s}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* If many bullets, keep remaining as simple list */}
//                   {challengesBullets.length > 6 ? (
//                     <div className="mt-5">
//                       <div className="text-xs font-semibold text-slate-600">More</div>
//                       <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 font-serif">
//                         {challengesBullets.slice(6).map((b, idx) => (
//                           <li key={`more-${idx}`}>{String(b)}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   ) : null}
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           <div className="mt-10 text-center text-xs font-mono text-slate-400">
//             Built with Appfolio • {user.displayName || user.username}
//           </div>
          
//         </div>
//       </div>
//     </main>
//   );
// }

// V6
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   ArrowRight,
// } from "lucide-react";
// import { NotchType } from "@/components/PhoneFrame";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";
// import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
// import PublicTechStack from "@/components/PublicTechStack";
// import Reveal from "@/components/Reveal";
// import PublicStickyTabs from "@/components/PublicStickyTabs";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
//       {children}
//     </span>
//   );
// }

// function StatPill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
//       {children}
//     </span>
//   );
// }

// function ActionButton({
//   href,
//   children,
//   variant = "ghost",
// }: {
//   href: string;
//   children: React.ReactNode;
//   variant?: "ghost" | "primary";
// }) {
//   const base =
//     "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30";
//   const styles =
//     variant === "primary"
//       ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
//       : "border border-slate-900/10 bg-white/80 text-slate-700 hover:bg-slate-50 shadow-sm";

//   return (
//     <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
//       {children}
//     </a>
//   );
// }

// function Section({
//   id,
//   title,
//   subtitle,
//   icon,
//   children,
//   variant = "default",
//   divider = true,
// }: {
//   id?: string;
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
//   variant?: "default" | "showcase";
//   divider?: boolean;
// }) {
//   const wrapClass =
//     variant === "showcase" ? "mt-8 md:mt-10" : "mt-10 md:mt-12";

//   const bodyClass =
//     variant === "showcase"
//       ? `
//         mt-4 rounded-3xl border border-slate-900/10
//         bg-white/80 p-3 sm:p-4 md:p-6
//         shadow-[0_10px_40px_rgba(2,6,23,0.06)]
//         transition-all duration-300
//         hover:shadow-[0_18px_60px_rgba(2,6,23,0.10)]
//         `
//       : `
//         mt-4 rounded-3xl border border-slate-900/10
//         bg-white/75 p-5 md:p-7
//         shadow-[0_10px_40px_rgba(2,6,23,0.06)]
//         transition-all duration-300
//         hover:shadow-[0_18px_60px_rgba(2,6,23,0.10)]
//         `;

//   return (
//     <section id={id} className={wrapClass}>
//       <div className="px-1 scroll-mt-28">
//         <div className="flex items-start gap-3">
//           {icon ? (
//             // <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/80 text-primary shadow-sm">
//             <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-900/10 bg-primary/10 text-primary shadow-sm">
//               {icon}
//             </span>
//           ) : null}

//           <div>
//             <h2 className="text-[22px] md:text-[28px] font-extrabold tracking-[-0.02em] text-slate-900 font-serif">
//               {title}
//             </h2>
//             {subtitle ? (
//               <p className="mt-1 max-w-3xl text-sm text-slate-600 font-serif">
//                 {subtitle}
//               </p>
//             ) : null}
//           </div>
//         </div>

//         {/* {divider ? <div className="mt-4 h-px w-full bg-slate-900/10" /> : null} */}
//         {divider ? (
//           <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-slate-300/70 to-transparent" />
//         ) : null}

//       </div>

//       <div className={bodyClass}>
//         <Reveal>{children}</Reveal>
//       </div>
//     </section>
//   );
// }

// function StickyTabs({
//   items,
// }: {
//   items: Array<{ id: string; label: string; isLocked?: boolean }>;
// }) {
//   return (
//     <div
//       className="
//         sticky top-3 z-20 mt-5
//         rounded-2xl border border-slate-900/10
//         bg-white/70 backdrop-blur-md
//         shadow-[0_10px_30px_rgba(2,6,23,0.08)]
//         px-3 py-3
//       "
//     >
//       <div className="flex flex-wrap gap-2">
//         {items.map((it) => (
//           <a
//             key={it.id}
//             href={`#${it.id}`}
//             className="
//               group inline-flex items-center gap-2
//               rounded-full border border-slate-900/10
//               bg-white/70 px-3 py-1.5
//               text-xs font-semibold text-slate-700
//               shadow-sm transition-all duration-200
//               hover:bg-slate-50 hover:scale-[1.02]
//               focus:outline-none focus:ring-2 focus:ring-primary/30
//             "
//           >
//             <span className="relative">
//               {it.label}
//               <span
//                 className="
//                   absolute -bottom-1 left-0 h-[2px] w-0
//                   bg-slate-900/70
//                   transition-all duration-200
//                   group-hover:w-full
//                 "
//               />
//             </span>
//             {it.isLocked ? (
//               <span className="rounded-full border border-slate-900/10 bg-white px-2 py-0.5 text-[10px] text-slate-500">
//                 Locked
//               </span>
//             ) : null}
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const userFlowWalkthroughs = app?.userFlowWalkthroughs || null;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");

//   const integrationsIntro: string = String(app?.integrations?.intro || "");
//   const integrationsItems: Array<{ key: string; value: string }> = Array.isArray(app?.integrations?.items)
//     ? app.integrations.items
//     : [];

//   const techStack = app?.techStack || {};
//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ] as const;

//   const notch: NotchType =
//     platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE")
//       ? "iphone-pill"
//       : "android-center-hole";

//   // Auto “metadata” for recruiter context (no new fields needed)
//   const meta = {
//     platformText: platforms.length ? platforms.map(platformLabel).join(" • ") : "Platform",
//     screensText: screenshots.length ? `${screenshots.length} screens` : "Screens",
//     flowText: userFlowWalkthroughs?.flows?.length ? `${userFlowWalkthroughs.flows.length} flows` : "Flows",
//     techText: techGroups.some((g) => (g.items?.length ?? 0) > 0) ? "Tech stack included" : "Tech stack",
//   };

//   const tabs = [
//     { id: "walkthrough", label: "Screenshots" },
//     { id: "overview", label: "Overview" },
//     { id: "user-flow", label: "User Flow" },
//     { id: "system-design", label: "Architecture" },
//     { id: "tech-stack", label: "Tech Stack" },
//     { id: "tradeoffs", label: "Key Decisions" },
//   ].filter((t) => {
//     if (t.id === "walkthrough") return screenshots.length > 0;
//     if (t.id === "overview") return overviewBullets.length > 0;
//     if (t.id === "user-flow") return Boolean(userFlowWalkthroughs?.flows?.length);
//     if (t.id === "system-design") return Boolean(architectureImageUrl || integrationsIntro || integrationsItems.length);
//     if (t.id === "tech-stack") return techGroups.some((g) => (g.items?.length ?? 0) > 0);
//     if (t.id === "tradeoffs") return Boolean(challengesIntro || challengesBullets.length);
//     return true;
//   });

//   return (
//     <main
//       // className="
//       //   min-h-screen
//       //   bg-[radial-gradient(1200px_600px_at_50%_0%,rgba(37,99,235,0.10),transparent_55%),
//       //       radial-gradient(900px_500px_at_10%_40%,rgba(29,78,216,0.06),transparent_60%),
//       //       linear-gradient(#fbfdff,#eef3f8)]
//       // "
//       className="
//         min-h-screen
//         bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(37,99,235,0.08),transparent_60%),
//             linear-gradient(#fbfdff,#f4f7fb)]
//       "
//     >
//       <div className="mx-auto max-w-270 px-3 pb-14 pt-6 md:px-4">
//         <div
//           className="
//             rounded-[28px]
//             border border-slate-900/10
//             bg-white/55
//             shadow-[0_22px_70px_rgba(2,6,23,0.12)]
//             backdrop-blur-md
//             px-3 py-6 sm:px-6 sm:py-8
//           "
//         >
//           {/* Back */}
//           <a
//             href={`/u/${user.username}`}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             {user.displayName || user.username}
//           </a>

//           {/* HERO */}
//           <header className="mt-6">
//             <div
//               className="
//                 rounded-3xl border border-slate-900/10
//                 bg-gradient-to-b from-white/90 to-slate-50/70
//                 p-5 sm:p-6
//                 shadow-[0_18px_60px_rgba(2,6,23,0.10)]
//               "
//             >
//               <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
//                 <div className="flex items-start gap-4">
//                   {iconUrl ? (
//                     <ClickToViewImage
//                       src={iconUrl}
//                       alt={`${app?.name || "App"} icon`}
//                       viewerAspect={1}
//                       className="
//                         h-16 w-16 overflow-hidden rounded-2xl
//                         border border-slate-900/10 bg-white
//                         shadow-sm transition-transform duration-200
//                         hover:scale-[1.03]
//                       "
//                     />
//                   ) : (
//                     <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-900/10 bg-white shadow-sm">
//                       <AppWindow className="h-6 w-6 text-primary" />
//                     </div>
//                   )}

//                   <div className="min-w-0">
//                     <h1 className="text-3xl font-extrabold tracking-[-0.025em] text-slate-900 font-serif sm:text-4xl">
//                       {app.name}
//                     </h1>

//                     {app.shortDescription ? (
//                       <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600 font-serif leading-relaxed">
//                         {app.shortDescription}
//                       </p>
//                     ) : (
//                       <p className="mt-1 text-sm font-medium text-slate-500 font-serif">
//                         Mobile app case study
//                       </p>
//                     )}

//                     {/* Platform + status */}
//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                       <span className="text-xs font-semibold text-slate-500 font-serif">
//                         Available on
//                       </span>
//                       {platforms.map((p) => (
//                         <Pill key={p}>{platformLabel(p)}</Pill>
//                       ))}
//                       {/* {app?.status ? <Pill>{String(app.status)}</Pill> : null}
//                       {app?.category ? <Pill>{String(app.category)}</Pill> : null} */}
//                     </div>
                    
//                     {/* Recruiter-first metadata row (auto) */}
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <StatPill>{meta.platformText}</StatPill>
//                       <StatPill>{meta.screensText}</StatPill>
//                       <StatPill>{meta.flowText}</StatPill>
//                       <StatPill>{meta.techText}</StatPill>
//                     </div>
//                   </div>
//                 </div>

//                 {/* CTAs */}
//                 <div className="flex flex-wrap items-center gap-2 sm:justify-end">
//                   {app?.links?.github ? (
//                     <ActionButton href={String(app.links.github)} variant="ghost">
//                       <GitBranch className="h-4 w-4" />
//                       GitHub
//                     </ActionButton>
//                   ) : null}

//                   {app?.links?.liveDemo ? (
//                     <ActionButton href={String(app.links.liveDemo)} variant="primary">
//                       <ArrowRight className="h-4 w-4" />
//                       Live
//                     </ActionButton>
//                   ) : null}

//                   {app?.links?.playStore ? (
//                     <ActionButton href={String(app.links.playStore)} variant="ghost">
//                       <ArrowRight className="h-4 w-4" />
//                       Play Store
//                     </ActionButton>
//                   ) : null}

//                   {app?.links?.appStore ? (
//                     <ActionButton href={String(app.links.appStore)} variant="ghost">
//                       <ArrowRight className="h-4 w-4" />
//                       App Store
//                     </ActionButton>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Sticky tabs */}
//               {tabs.length ? <PublicStickyTabs items={tabs} /> : null}
//             </div>
//           </header>

//           {/* Walkthrough */}
//           {screenshots.length ? (
//             <Section
//               id="walkthrough"
//               title="Walkthrough"
//               subtitle={
//                 app?.shortDescription
//                   ? "Key screens that show the user journey end-to-end."
//                   : "Key screens that show the user journey end-to-end."
//               }
//               icon={<Layers className="h-4 w-4" />}
//               variant="showcase"
//             >
//               <div className="group">
//                 <div className="transition-transform duration-300 group-hover:scale-[1.005]">
//                   <PublicScreenshots
//                     appName={app?.name}
//                     imageUrls={screenshots.map((s: any) => s.url)}
//                     isPremium={true}
//                     platforms={platforms}
//                   />
//                 </div>
//               </div>
//             </Section>
//           ) : null}

//           {/* App Overview */}
//           {overviewBullets.length ? (
//             <Section
//               id="overview"
//               title="App Overview"
//               subtitle="What it does, who it’s for, and what makes it useful."
//               icon={<Layers className="h-4 w-4" />}
//             >
//               <div className="mb-4 flex flex-wrap gap-2">
//                 <StatPill>{meta.platformText}</StatPill>
//                 <StatPill>{meta.screensText}</StatPill>
//                 <StatPill>{meta.techText}</StatPill>
//                 <StatPill>{meta.flowText}</StatPill>
//               </div>

//               <div className="grid gap-3 md:grid-cols-2">
//                 {overviewBullets.slice(0, 6).map((b, idx) => (
//                   <div
//                     key={idx}
//                     className="
//                       rounded-2xl border border-slate-900/10 bg-white
//                       px-4 py-3 shadow-sm
//                       transition-all duration-200
//                       hover:shadow-md hover:-translate-y-px
//                     "
//                   >
//                     <div className="text-xs font-mono text-slate-400">#{idx + 1}</div>
//                     <div className="mt-1 text-sm text-slate-700 font-serif leading-relaxed">
//                       {String(b)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {overviewBullets.length > 6 ? (
//                 <div className="mt-5">
//                   <div className="text-xs font-semibold text-slate-600">More details</div>
//                   <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 font-serif">
//                     {overviewBullets.slice(6).map((b, idx) => (
//                       <li key={`more-${idx}`}>{String(b)}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           {/* User Flow */}
//           {userFlowWalkthroughs?.flows?.length ? (
//             <Section
//               id="user-flow"
//               title="User Flow"
//               subtitle="Feature-wise flows: what happens, where, and why."
//               icon={<Network className="h-4 w-4" />}
//             >
//               <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
//             </Section>
//           ) : null}

//           {/* System Design */}
//           {architectureImageUrl || integrationsIntro || integrationsItems.length ? (
//             <Section
//               id="system-design"
//               title="System Design"
//               subtitle="Architecture + key decisions that shaped the implementation."
//               icon={<Network className="h-4 w-4" />}
//             >
//               {architectureImageUrl ? (
//                 <div>
//                   <ClickToViewImage
//                     src={architectureImageUrl}
//                     alt="Architecture diagram"
//                     viewerAspect={16 / 9}
//                     className="
//                       w-full overflow-hidden rounded-2xl
//                       border border-slate-900/10 bg-white
//                       shadow-sm transition-all duration-200
//                       hover:shadow-md
//                     "
//                   />
//                   <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-serif">
//                     <span>Click to view full size.</span>
//                     <span className="font-mono">Architecture</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 text-sm text-slate-600 font-serif">
//                   Architecture diagram not added yet.
//                 </div>
//               )}

//               {(integrationsIntro || integrationsItems.length) ? (
//                 <div className="mt-6">
//                   <div className="flex items-baseline justify-between gap-3">
//                     <div>
//                       <div className="text-sm font-extrabold text-slate-900 font-serif">
//                         Integrations & Key Decisions
//                       </div>
//                       <div className="mt-1 text-xs text-slate-500 font-serif">
//                         Things recruiters ask about: auth, state, storage, messaging, maps, payments…
//                       </div>
//                     </div>
//                     <span className="text-[11px] font-mono text-slate-400">
//                       {integrationsItems.length ? `${integrationsItems.length} items` : ""}
//                     </span>
//                   </div>

//                   {integrationsIntro ? (
//                     <p className="mt-3 text-sm text-slate-700 font-serif">
//                       {integrationsIntro}
//                     </p>
//                   ) : null}

//                   {integrationsItems.length ? (
//                     <div className="mt-4 grid gap-3 md:grid-cols-2">
//                       {integrationsItems.map((it, idx) => (
//                         <div
//                           key={idx}
//                           className="
//                             rounded-2xl border border-slate-900/10 bg-white
//                             px-4 py-3 shadow-sm
//                             transition-all duration-200
//                             hover:shadow-md hover:-translate-y-[1px]
//                           "
//                         >
//                           <div className="text-xs font-extrabold text-slate-700 font-serif">
//                             {String(it.key || "")}
//                           </div>
//                           <div className="mt-1 text-sm text-slate-700 font-serif">
//                             {String(it.value || "")}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="mt-3 text-sm text-slate-600 font-serif">
//                       No key decisions added.
//                     </div>
//                   )}
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           {/* Tech Stack */}
//           {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
//             <Section
//               id="tech-stack"
//               title="Tech Stack"
//               subtitle="Technologies used to build this app."
//               icon={<Wrench className="h-4 w-4" />}
//             >
//               <PublicTechStack groups={techGroups as any} />
//             </Section>
//           ) : null}

//           {/* Challenges & Tradeoffs */}
//           {challengesIntro || challengesBullets.length ? (
//             <Section
//               id="tradeoffs"
//               title="Challenges & Tradeoffs"
//               subtitle="What was hard, what you chose, and what you’d improve next."
//               icon={<GitBranch className="h-4 w-4" />}
//             >
//               {challengesIntro ? (
//                 <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4">
//                   <div className="text-xs font-extrabold text-slate-800 font-serif">
//                     Context
//                   </div>
//                   <p className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
//                     {challengesIntro}
//                   </p>
//                 </div>
//               ) : null}

//               {challengesBullets.length ? (
//                 <div className={challengesIntro ? "mt-5" : ""}>
//                   <div className="flex items-center justify-between">
//                     <div className="text-xs font-extrabold text-slate-800 font-serif">
//                       Key points
//                     </div>
//                     <div className="text-[11px] font-mono text-slate-400">
//                       {challengesBullets.length} items
//                     </div>
//                   </div>

//                   <div className="mt-3 grid gap-3 md:grid-cols-2">
//                     {challengesBullets.slice(0, 6).map((b, idx) => {
//                       const s = String(b || "");
//                       const lower = s.toLowerCase();

//                       const tag =
//                         lower.includes("tradeoff") || lower.includes("chose") || lower.includes("instead")
//                           ? "Tradeoff"
//                           : lower.includes("next") || lower.includes("future") || lower.includes("improve")
//                           ? "Next"
//                           : "Challenge";

//                       const tagClass =
//                         tag === "Tradeoff"
//                           ? "bg-primary/10 text-primary border-primary/20"
//                           : tag === "Next"
//                           ? "bg-slate-900/5 text-slate-700 border-slate-900/10"
//                           : "bg-white text-slate-700 border-slate-900/10";

//                       return (
//                         <div
//                           key={idx}
//                           className="
//                             rounded-2xl border border-slate-900/10 bg-white
//                             px-4 py-3 shadow-sm
//                             transition-all duration-200
//                             hover:shadow-md hover:-translate-y-[1px]
//                           "
//                         >
//                           <div className="flex items-center justify-between gap-3">
//                             <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${tagClass}`}>
//                               {tag}
//                             </span>
//                             <span className="text-[11px] font-mono text-slate-400">#{idx + 1}</span>
//                           </div>

//                           <div className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
//                             {s}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {challengesBullets.length > 6 ? (
//                     <div className="mt-5">
//                       <div className="text-xs font-semibold text-slate-600">More</div>
//                       <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 font-serif">
//                         {challengesBullets.slice(6).map((b, idx) => (
//                           <li key={`more-${idx}`}>{String(b)}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   ) : null}
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           <div className="mt-10 text-center text-xs font-mono text-slate-400">
//             Built with Appfolio • {user.displayName || user.username}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


//V7
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   ArrowRight,
// } from "lucide-react";
// import { NotchType } from "@/components/PhoneFrame";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";
// import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
// import PublicTechStack from "@/components/PublicTechStack";
// import Reveal from "@/components/Reveal";
// import PublicStickyTabs from "@/components/PublicStickyTabs";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
//       {children}
//     </span>
//   );
// }

// function StatPill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
//       {children}
//     </span>
//   );
// }

// function ActionButton({
//   href,
//   children,
//   variant = "ghost",
// }: {
//   href: string;
//   children: React.ReactNode;
//   variant?: "ghost" | "primary";
// }) {
//   const base =
//     "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30";

//   const styles =
//     variant === "primary"
//       ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md"
//       : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm";

//   return (
//     <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
//       {children}
//     </a>
//   );
// }

// //V1
// // function Section({
// //   id,
// //   title,
// //   subtitle,
// //   icon,
// //   children,
// //   variant = "default",
// //   divider = true,
// // }: {
// //   id?: string;
// //   title: string;
// //   subtitle?: string;
// //   icon?: React.ReactNode;
// //   children: React.ReactNode;
// //   variant?: "default" | "showcase";
// //   divider?: boolean;
// // }) {
// //   const wrapClass =
// //     variant === "showcase" ? "mt-8 md:mt-10" : "mt-12";

// //   const bodyClass =
// //     variant === "showcase"
// //       ? `
// //         mt-5 rounded-3xl border border-slate-200
// //         bg-white p-4 md:p-7
// //         shadow-[0_24px_70px_rgba(15,23,42,0.08)]
// //         transition-all duration-300
// //         `
// //       : `
// //         mt-5 rounded-3xl border border-slate-200
// //         bg-white p-5 md:p-7
// //         shadow-[0_10px_40px_rgba(15,23,42,0.05)]
// //         transition-all duration-300
// //         `;

// //   return (
// //     <section id={id} className={wrapClass}>
// //       <div className="px-1 scroll-mt-32">
// //         <div className="flex items-start gap-3">
// //           {icon ? (
// //             <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
// //               {icon}
// //             </span>
// //           ) : null}

// //           <div>
// //             <h2 className="text-[24px] md:text-[30px] font-extrabold tracking-[-0.025em] text-slate-900 font-serif">
// //               {title}
// //             </h2>
// //             {subtitle ? (
// //               <p className="mt-1 max-w-3xl text-sm text-slate-600 font-serif">
// //                 {subtitle}
// //               </p>
// //             ) : null}
// //           </div>
// //         </div>

// //         {divider ? (
// //           <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
// //         ) : null}
// //       </div>

// //       <div className={bodyClass}>
// //         <Reveal>{children}</Reveal>
// //       </div>
// //     </section>
// //   );
// // }

// function Section({
//   id,
//   title,
//   subtitle,
//   icon,
//   children,
//   variant = "default",
//   divider = true,
// }: {
//   id?: string;
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
//   variant?: "default" | "showcase";
//   divider?: boolean;
// }) {
//   const wrapClass = variant === "showcase" ? "mt-10 md:mt-12" : "mt-14";

//   // ✅ Instead of "card section", use a soft band + a single content well.
//   const bandClass =
//     variant === "showcase"
//       ? "rounded-3xl bg-gradient-to-b from-white to-slate-50/60 border border-slate-200/70"
//       : "rounded-3xl bg-white/60";

//   // ✅ Only Walkthrough gets the stage feel.
//   const wellClass =
//     variant === "showcase"
//       ? `
//         mt-5 rounded-3xl bg-white
//         border border-slate-200
//         shadow-[0_28px_90px_rgba(15,23,42,0.10)]
//         p-4 md:p-7
//       `
//       : `
//         mt-5 rounded-3xl bg-white
//         border border-slate-200/70
//         shadow-[0_14px_50px_rgba(15,23,42,0.06)]
//         p-5 md:p-7
//       `;

//   return (
//     <section id={id} className={wrapClass}>
//       <div className={`px-4 md:px-6 py-6 md:py-8 ${bandClass}`}>
//         <div className="scroll-mt-32">
//           <div className="flex items-start gap-3">
//             {icon ? (
//               <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
//                 {icon}
//               </span>
//             ) : null}

//             <div className="min-w-0">
//               <h2 className="text-[24px] md:text-[30px] font-extrabold tracking-[-0.025em] text-slate-900 font-serif">
//                 {title}
//               </h2>
//               {subtitle ? (
//                 <p className="mt-1 max-w-3xl text-sm text-slate-600 font-serif">
//                   {subtitle}
//                 </p>
//               ) : null}
//             </div>
//           </div>

//           {divider ? (
//             <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
//           ) : null}
//         </div>

//         <div className={wellClass}>
//           <Reveal>{children}</Reveal>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = app?.overviewBullets || [];
//   const challengesIntro: string = app?.challengesIntro || "";
//   const challengesBullets: string[] = app?.challengesBullets || [];

//   const architectureImageUrl: string = app?.architectureDiagramImageUrl || "";

//   const integrationsIntro: string = app?.integrations?.intro || "";
//   const integrationsItems = app?.integrations?.items || [];

//   const techStack = app?.techStack || {};
//   const techGroups = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ];

//   const tabs = [
//     { id: "walkthrough", label: "Screenshots" },
//     { id: "overview", label: "Overview" },
//     { id: "user-flow", label: "User Flow" },
//     { id: "system-design", label: "Architecture" },
//     { id: "tech-stack", label: "Tech Stack" },
//     { id: "tradeoffs", label: "Key Decisions" },
//   ];

//   return (
//     <main
//       className="
//         min-h-screen
//         bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(37,99,235,0.08),transparent_60%),linear-gradient(#fbfdff,#f4f7fb)]
//       "
//     >
//       <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
//         <div className="rounded-[32px] border border-slate-200 bg-white/70 backdrop-blur-md shadow-[0_30px_90px_rgba(15,23,42,0.12)] p-6 md:p-10">

//           <a
//             href={`/u/${user.username}`}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             {user.displayName || user.username}
//           </a>

//           <header className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
//             <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-slate-900 font-serif">
//               {app.name}
//             </h1>
//             {app.shortDescription && (
//               <p className="mt-2 text-sm text-slate-600 font-serif">
//                 {app.shortDescription}
//               </p>
//             )}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {platforms.map((p) => (
//                 <Pill key={p}>{platformLabel(p)}</Pill>
//               ))}
//             </div>

//             <div className="mt-6">
//               <PublicStickyTabs items={tabs} />
//             </div>
//           </header>

//           {screenshots.length > 0 && (
//             <Section id="walkthrough" title="Walkthrough" icon={<Layers className="h-4 w-4" />} variant="showcase">
//               <PublicScreenshots
//                 appName={app?.name}
//                 imageUrls={screenshots.map((s: any) => s.url)}
//                 isPremium
//                 platforms={platforms}
//               />
//             </Section>
//           )}

//           {/* {overviewBullets.length > 0 && (
//             <Section id="overview" title="App Overview" icon={<Layers className="h-4 w-4" />}>
//               <div className="grid gap-4 md:grid-cols-2">
//                 {overviewBullets.map((b, idx) => (
//                   <div key={idx} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px">
//                     <p className="text-sm text-slate-700 font-serif leading-relaxed">{b}</p>
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )} */}

//           {overviewBullets.length ? (
//             <Section
//               id="overview"
//               title="App Overview"
//               subtitle="What it does, who it’s for, and what makes it useful."
//               icon={<Layers className="h-4 w-4" />}
//             >
//               <div className="space-y-3">
//                 {overviewBullets.slice(0, 8).map((b, idx) => (
//                   <div
//                     key={idx}
//                     className="
//                       rounded-2xl border border-slate-200/70 bg-slate-50/60
//                       px-4 py-3
//                       flex gap-3
//                       transition-all duration-200
//                       hover:bg-slate-50
//                     "
//                   >
//                     <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
//                       {idx + 1}
//                     </div>
//                     <div className="text-sm text-slate-700 font-serif leading-relaxed">
//                       {String(b)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {overviewBullets.length > 8 ? (
//                 <div className="mt-5">
//                   <div className="text-xs font-semibold text-slate-600">More</div>
//                   <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 font-serif">
//                     {overviewBullets.slice(8).map((b, idx) => (
//                       <li key={`more-${idx}`}>{String(b)}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}

//           {architectureImageUrl && (
//             <Section id="system-design" title="System Design" icon={<Network className="h-4 w-4" />}>
//               <ClickToViewImage
//                 src={architectureImageUrl}
//                 alt="Architecture"
//                 viewerAspect={16 / 9}
//                 className="rounded-2xl border border-slate-200 bg-white shadow-sm"
//               />
//             </Section>
//           )}

//           {techGroups.some(g => g.items.length > 0) && (
//             <Section id="tech-stack" title="Tech Stack" icon={<Wrench className="h-4 w-4" />}>
//               <PublicTechStack groups={techGroups as any} />
//             </Section>
//           )}

//           {/* {challengesBullets.length > 0 && (
//             <Section id="tradeoffs" title="Challenges & Tradeoffs" icon={<GitBranch className="h-4 w-4" />}>
//               <div className="grid gap-4 md:grid-cols-2">
//                 {challengesBullets.map((b, idx) => (
//                   <div key={idx} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px">
//                     <p className="text-sm text-slate-700 font-serif leading-relaxed">{b}</p>
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )} */}
//           {challengesIntro || challengesBullets.length ? (
//             <Section
//               id="tradeoffs"
//               title="Challenges & Tradeoffs"
//               subtitle="What was hard, what you chose, and what you’d improve next."
//               icon={<GitBranch className="h-4 w-4" />}
//             >
//               {challengesIntro ? (
//                 <div className="rounded-2xl border border-slate-200/70 bg-amber-50/40 px-4 py-4">
//                   <div className="text-xs font-extrabold text-slate-800 font-serif">Context</div>
//                   <p className="mt-2 text-sm text-slate-700 font-serif leading-relaxed">
//                     {challengesIntro}
//                   </p>
//                 </div>
//               ) : null}

//               {challengesBullets.length ? (
//                 <div className={challengesIntro ? "mt-4 space-y-3" : "space-y-3"}>
//                   {challengesBullets.slice(0, 8).map((b, idx) => (
//                     <div
//                       key={idx}
//                       className="
//                         rounded-2xl border border-slate-200/70 bg-white
//                         px-4 py-3
//                         border-l-4 border-l-primary/40
//                         transition-all duration-200
//                         hover:shadow-sm
//                       "
//                     >
//                       <div className="text-sm text-slate-700 font-serif leading-relaxed">
//                         {String(b)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : null}
//             </Section>
//           ) : null}
//         </div>
//       </div>
//     </main>
//   );
// }


// V8
// import React from "react";
// import { API_BASE } from "@/lib/api";
// import {
//   AppWindow,
//   ArrowLeft,
//   Layers,
//   Network,
//   GitBranch,
//   Wrench,
//   ArrowRight,
// } from "lucide-react";
// import PublicScreenshots from "@/components/PublicScreenshots";
// import ClickToViewImage from "@/components/ClickToViewImage";
// import PublicUserFlowWalkthroughs from "@/components/PublicUserFlowWalkthroughs";
// import Reveal from "@/components/Reveal";
// import PublicStickyTabs from "@/components/PublicStickyTabs";

// async function getApp(username: string, slug: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// function platformLabel(p: string) {
//   const v = String(p || "").toUpperCase();
//   if (v === "ANDROID") return "Android";
//   if (v === "IOS" || v === "APPLE") return "iOS";
//   if (v === "WINDOWS") return "Windows";
//   return v || "Platform";
// }

// /** --- Small UI primitives (flat, reference-style) --- */

// function Chip({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
//       {children}
//     </span>
//   );
// }

// function SoftBadge({
//   children,
//   tone = "neutral",
// }: {
//   children: React.ReactNode;
//   tone?: "neutral" | "success";
// }) {
//   const cls =
//     tone === "success"
//       ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//       : "border-slate-200 bg-white text-slate-700";

//   return (
//     <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
//       {children}
//     </span>
//   );
// }

// function SectionCard({
//   id,
//   title,
//   subtitle,
//   icon,
//   children,
// }: {
//   id: string;
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <section id={id} className="scroll-mt-28">
//       <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
//         <div className="flex items-start gap-3 px-5 pt-5">
//           {icon ? (
//             <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
//               {icon}
//             </span>
//           ) : null}

//           <div className="min-w-0">
//             <h2 className="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
//               {title}
//             </h2>
//             {subtitle ? (
//               <p className="mt-1 text-sm text-slate-600">
//                 {subtitle}
//               </p>
//             ) : null}
//           </div>
//         </div>

//         <div className="px-5">
//           <div className="mt-4 h-px w-full bg-slate-100" />
//         </div>

//         <div className="p-5">
//           <Reveal>{children}</Reveal>
//         </div>
//       </div>
//     </section>
//   );
// }

// /** --- Tech Stack (no nested cards) --- */

// type TechGroup = { key: string; label: string; items: any[] };

// function TechStackNeat({ groups }: { groups: TechGroup[] }) {
//   // flatten for "All"
//   const all = groups.flatMap((g) => g.items || []);
//   const tabs = [{ key: "all", label: "All", count: all.length }, ...groups.map((g) => ({
//     key: g.key,
//     label: g.label,
//     count: (g.items || []).length,
//   }))];

//   // Default to "all" in SSR. If you want interactive filtering, we can make this a client component.
//   const activeKey = "all";
//   const activeItems =
//     activeKey === "all"
//       ? all
//       : (groups.find((g) => g.key === activeKey)?.items || []);

//   // Render each tech as a simple tile (not a card-in-card)
//   const normalize = (it: any) => {
//     if (!it) return { name: "Unknown", meta: "" };
//     if (typeof it === "string") return { name: it, meta: "" };
//     // common shapes: { id, name, label }
//     const name = String(it.name || it.label || it.id || "Unknown");
//     const meta = it.version ? String(it.version) : "";
//     return { name, meta };
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
//       {/* Tabs row (visual only here; keeps it flat and clean) */}
//       <div className="flex flex-wrap gap-2">
//         {tabs.map((t) => {
//           const isActive = t.key === activeKey;
//           return (
//             <span
//               key={t.key}
//               className={[
//                 "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
//                 isActive
//                   ? "border-primary/25 bg-primary/10 text-primary"
//                   : "border-slate-200 bg-white text-slate-700",
//               ].join(" ")}
//             >
//               {t.label}
//               <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
//                 {t.count}
//               </span>
//             </span>
//           );
//         })}
//       </div>

//       <div className="mt-4 h-px w-full bg-slate-200/70" />

//       {/* Groups (flat sections inside one panel) */}
//       <div className="mt-4 space-y-6">
//         {groups
//           .filter((g) => (g.items || []).length > 0)
//           .map((g) => (
//             <div key={g.key}>
//               <div className="flex items-baseline justify-between">
//                 <div className="text-sm font-extrabold text-slate-900">{g.label}</div>
//                 <div className="text-xs text-slate-500">{(g.items || []).length} items</div>
//               </div>

//               <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
//                 {(g.items || []).map((it, idx) => {
//                   const { name, meta } = normalize(it);
//                   return (
//                     <div
//                       key={`${g.key}-${idx}-${name}`}
//                       className="
//                         rounded-xl border border-slate-200 bg-white
//                         px-4 py-3
//                         transition-all duration-200
//                         hover:shadow-sm hover:-translate-y-[1px]
//                       "
//                     >
//                       <div className="text-sm font-semibold text-slate-900">{name}</div>
//                       {meta ? <div className="mt-1 text-xs text-slate-500">{meta}</div> : null}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//       </div>

//       {/* If “All” has items but groups are empty, fallback */}
//       {activeItems.length === 0 ? (
//         <div className="mt-4 text-sm text-slate-600">No tech stack added.</div>
//       ) : null}
//     </div>
//   );
// }

// export default async function PublicAppPage({
//   params,
// }: {
//   params: Promise<{ username: string; slug: string }>;
// }) {
//   const { username, slug } = await params;
//   const data = await getApp(username, slug);

//   if (!data) return <div className="p-6">App not found</div>;

//   const { user, app } = data;

//   const screenshots = (app?.screenshots || [])
//     .slice()
//     .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

//   const iconUrl = String(app?.appIconUrl || "");
//   const platforms: string[] = Array.isArray(app?.platform) ? app.platform : [];

//   const overviewBullets: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];
//   const challengesIntro: string = String(app?.challengesIntro || "");
//   const challengesBullets: string[] = Array.isArray(app?.challengesBullets) ? app.challengesBullets : [];

//   const architectureImageUrl: string = String(app?.architectureDiagramImageUrl || "");
//   const userFlowWalkthroughs = app?.userFlowWalkthroughs || null;

//   const techStack = app?.techStack || {};
//   const techGroups: TechGroup[] = [
//     { key: "frontend", label: "Frontend", items: techStack.frontend || [] },
//     { key: "backend", label: "Backend", items: techStack.backend || [] },
//     { key: "database", label: "Database", items: techStack.database || [] },
//     { key: "infra", label: "Infra", items: techStack.infra || [] },
//   ];

//   const tabs = [
//     { id: "screens", label: "Screens Gallery" },
//     { id: "overview", label: "App Overview" },
//     { id: "user-flow", label: "User Flow" },
//     { id: "architecture", label: "Architecture" },
//     { id: "tech", label: "Tech Stack" },
//     { id: "tradeoffs", label: "Challenges" },
//   ].filter((t) => {
//     if (t.id === "screens") return screenshots.length > 0;
//     if (t.id === "overview") return overviewBullets.length > 0;
//     if (t.id === "user-flow") return Boolean(userFlowWalkthroughs?.flows?.length);
//     if (t.id === "architecture") return Boolean(architectureImageUrl);
//     if (t.id === "tech") return techGroups.some((g) => (g.items?.length ?? 0) > 0);
//     if (t.id === "tradeoffs") return Boolean(challengesIntro || challengesBullets.length);
//     return true;
//   });

//   return (
//     <main className="min-h-screen bg-[#f6f8fb]">
//       <div className="mx-auto max-w-5xl px-4 py-8">
//         {/* Back */}
//         <a
//           href={`/u/${user.username}`}
//           className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           {user.displayName || user.username}
//         </a>

//         {/* HERO (matches reference: icon + name + small pills + tabs) */}
//         <header className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
//           <div className="p-5">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//               <div className="flex items-start gap-4">
//                 {iconUrl ? (
//                   <ClickToViewImage
//                     src={iconUrl}
//                     alt={`${app?.name || "App"} icon`}
//                     viewerAspect={1}
//                     className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white"
//                   />
//                 ) : (
//                   <div className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white">
//                     <AppWindow className="h-6 w-6 text-primary" />
//                   </div>
//                 )}

//                 <div className="min-w-0">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-slate-900">
//                       {app?.name}
//                     </h1>

//                     {app?.links?.liveDemo ? (
//                       <SoftBadge tone="success">Live</SoftBadge>
//                     ) : null}
//                   </div>

//                   {app?.shortDescription ? (
//                     <p className="mt-1 text-sm text-slate-600">
//                       {app.shortDescription}
//                     </p>
//                   ) : null}

//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {platforms.map((p) => (
//                       <Chip key={p}>{platformLabel(p)}</Chip>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* CTAs (simple like reference) */}
//               <div className="flex flex-wrap items-center gap-2 sm:justify-end">
//                 {app?.links?.github ? (
//                   <a
//                     href={String(app.links.github)}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                   >
//                     <GitBranch className="h-4 w-4" />
//                     GitHub
//                   </a>
//                 ) : null}

//                 {app?.links?.liveDemo ? (
//                   <a
//                     href={String(app.links.liveDemo)}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//                   >
//                     <ArrowRight className="h-4 w-4" />
//                     Live
//                   </a>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//           <div className="px-5 pb-5">
//             <PublicStickyTabs items={tabs} offsetTop={96} />
//           </div>
//         </header>

//         {/* CONTENT STACK (flat cards per section) */}
//         <div className="mt-6 space-y-6">
//           {overviewBullets.length ? (
//             <SectionCard
//               id="overview"
//               title="App Overview"
//               subtitle="A quick summary of what the app does."
//               icon={<Layers className="h-4 w-4" />}
//             >
//               <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
//                 {overviewBullets.map((b, idx) => (
//                   <li key={idx} className="flex gap-3">
//                     <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
//                     <span>{String(b)}</span>
//                   </li>
//                 ))}
//               </ul>
//             </SectionCard>
//           ) : null}

//           {screenshots.length ? (
//             <SectionCard
//               id="screens"
//               title="Screens Gallery"
//               subtitle="A look inside the app."
//               icon={<Layers className="h-4 w-4" />}
//             >
//               <PublicScreenshots
//                 appName={app?.name}
//                 imageUrls={screenshots.map((s: any) => s.url)}
//                 isPremium
//                 platforms={platforms}
//               />
//             </SectionCard>
//           ) : null}

//           {userFlowWalkthroughs?.flows?.length ? (
//             <SectionCard
//               id="user-flow"
//               title="User Flow"
//               subtitle="How the user moves through the product."
//               icon={<Network className="h-4 w-4" />}
//             >
//               <PublicUserFlowWalkthroughs data={userFlowWalkthroughs} />
//             </SectionCard>
//           ) : null}

//           {architectureImageUrl ? (
//             <SectionCard
//               id="architecture"
//               title="Architecture Overview"
//               subtitle="System design at a glance."
//               icon={<Network className="h-4 w-4" />}
//             >
//               <ClickToViewImage
//                 src={architectureImageUrl}
//                 alt="Architecture"
//                 viewerAspect={16 / 9}
//                 className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
//               />
//             </SectionCard>
//           ) : null}

//           {techGroups.some((g) => (g.items?.length ?? 0) > 0) ? (
//             <SectionCard
//               id="tech"
//               title="Tech Stack"
//               subtitle="Technologies used to build this app."
//               icon={<Wrench className="h-4 w-4" />}
//             >
//               <TechStackNeat groups={techGroups} />
//             </SectionCard>
//           ) : null}

//           {challengesIntro || challengesBullets.length ? (
//             <SectionCard
//               id="tradeoffs"
//               title="Challenges & Trade-offs"
//               subtitle="What was hard and how you handled it."
//               icon={<GitBranch className="h-4 w-4" />}
//             >
//               {challengesIntro ? (
//                 <p className="text-sm text-slate-700 leading-relaxed">
//                   {challengesIntro}
//                 </p>
//               ) : null}

//               {challengesBullets.length ? (
//                 <ul className={`${challengesIntro ? "mt-4" : ""} space-y-3 text-sm text-slate-700 leading-relaxed`}>
//                   {challengesBullets.map((b, idx) => (
//                     <li key={idx} className="flex gap-3">
//                       <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
//                       <span>{String(b)}</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : null}
//             </SectionCard>
//           ) : null}
//         </div>

//         <div className="mt-10 text-center text-xs text-slate-400">
//           Built with Appfolio • {user?.displayName || user?.username}
//         </div>
//       </div>
//     </main>
//   );
// }


// V5.1
import React from "react";
import { API_BASE } from "@/lib/api";
import { PublicAppView } from "@/components/public/PublicAppView";
import type { Plan } from "@/lib/planConfig";

async function getApp(username: string, slug: string) {
  const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicAppPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const data = await getApp(username, slug);
  if (!data) return <div className="p-6">App not found</div>;

  const effectivePlan = ((data as any)?.meta?.plan as Plan) || "FREE";
  console.log("effectivePlan:",effectivePlan)
  console.log("Data in page.tsx:",data)
  return (
    <PublicAppView
      data={data}
      effectivePlan={effectivePlan}
      showBackLink={true}
      showFooterWatermark={true}
    />
  );
}

// V5.1 is the working version