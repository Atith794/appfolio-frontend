"use client";

import { useEffect, useMemo, useState } from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";
import {
  Lock, User, FileEdit, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCcw,
  Home, Search, Package, FileText, Upload, Download, Folder, Receipt,
  MessageCircle, Phone, Bell, MapPin, CreditCard, ShoppingCart, Cloud, Image,
  Brain, Settings, Puzzle, Link, Shield, BarChart3, FlaskConical, Rocket,GitBranch, Database
} from "lucide-react";
type StepKind = "NODE" | "ARROW";
type IconType = "EMOJI" | "TECH" | "IMAGE";

type FlowStep = {
  id?: string;
  kind: StepKind;
  order?: number;
  label?: string;
  desc?: string;
  iconType?: IconType;
  icon?: string;
  iconRef?: { id: string; name: string; category: string };
  text?: string;
  color?: string;
};

type Flow = {
  id?: string;
  title: string;
  emoji?: string;
  order?: number;
  steps: FlowStep[];
};

type Walkthroughs = {
  intro?: string;
  flows: Flow[];
};

function getTechById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const COLOR_CLASS: Record<string, { text: string; bg: string; ring: string }> = {
  blue: { text: "text-blue-600", bg: "bg-blue-500", ring: "ring-blue-200" },
  green: { text: "text-emerald-600", bg: "bg-emerald-500", ring: "ring-emerald-200" },
  purple: { text: "text-violet-600", bg: "bg-violet-500", ring: "ring-violet-200" },
  orange: { text: "text-orange-600", bg: "bg-orange-500", ring: "ring-orange-200" },
  pink: { text: "text-pink-600", bg: "bg-pink-500", ring: "ring-pink-200" },
  cyan: { text: "text-cyan-600", bg: "bg-cyan-500", ring: "ring-cyan-200" },
  yellow: { text: "text-amber-600", bg: "bg-amber-400", ring: "ring-amber-200" },
};

function safeColor(c?: string) {
  const key = String(c || "blue").toLowerCase();
  return COLOR_CLASS[key] ? key : "blue";
}

function stableKey(prefix: string, fallbackIndex: number, id?: string) {
  return id ? `${prefix}-${id}` : `${prefix}-idx-${fallbackIndex}`;
}

const iconMap = {
  lock: Lock,
  user: User,
  fileEdit: FileEdit,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alertTriangle: AlertTriangle,
  clock: Clock,
  refreshCcw: RefreshCcw,
  home: Home,
  search: Search,
  package: Package,
  fileText: FileText,
  upload: Upload,
  download: Download,
  folder: Folder,
  receipt: Receipt,
  messageCircle: MessageCircle,
  phone: Phone,
  bell: Bell,
  mapPin: MapPin,
  creditCard: CreditCard,
  shoppingCart: ShoppingCart,
  cloud: Cloud,
  image: Image,
  brain: Brain,
  settings: Settings,
  puzzle: Puzzle,
  link: Link,
  shield: Shield,
  barChart3: BarChart3,
  flaskConical: FlaskConical,
  rocket: Rocket,
  database: Database
};

export default function PublicUserFlowWalkthroughs({
  data,
}: {
  data: Walkthroughs;
}) {
  const flows = useMemo(() => {
    const fs = Array.isArray(data?.flows) ? data.flows : [];
    return fs
      .slice()
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
      .map((f, fi) => ({
        ...f,
        id: f.id || `flow-${fi}`,
        steps: (Array.isArray(f.steps) ? f.steps : [])
          .slice()
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((s, si) => ({ ...s, id: s.id || `step-${fi}-${si}` })),
      }));
  }, [data]);

  const [activeId, setActiveId] = useState<string>(flows[0]?.id || "");

  useEffect(() => {
    if (!flows.length) return;
    if (!activeId || !flows.some((f) => f.id === activeId)) {
      setActiveId(flows[0].id || "");
    }
  }, [flows, activeId]);

  const activeFlow = useMemo(
    () => flows.find((f) => f.id === activeId) || flows[0],
    [flows, activeId]
  );

  if (!flows.length) return null;

  return (
    <div className="space-y-8">
      {data?.intro ? (
        <p className="max-w-3xl text-base leading-7 text-slate-500">
          {data.intro}
        </p>
      ) : null}

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {flows.map((flow, i) => {
          const isActive = flow.id === (activeFlow?.id || "");
          return (
            <button
              key={stableKey("tab", i, flow.id)}
              onClick={() => setActiveId(flow.id!)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer",
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
              type="button"
            >
              <span>{flow.emoji || "📡"}</span>
              <span>{flow.title || "Flow"}</span>
            </button>
          );
        })}
      </div>

      {/* Flow canvas */}
      {activeFlow ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-6 md:p-8 overflow-x-auto">
            <div className="min-w-max flex items-start justify-start gap-3 md:gap-4">
              {activeFlow.steps.map((step, idx) => {
                const c = safeColor(step.color);
                const cc = COLOR_CLASS[c];

                if (step.kind === "ARROW") {
                  return (
                    <div
                      key={stableKey("arrow", idx, step.id)}
                      className="flex min-h-[140px] flex-col items-center justify-center animate-[fadeInUp_220ms_ease-out_forwards] opacity-0"
                      style={{ animationDelay: `${idx * 60}ms` } as any}
                    >
                      <svg
                        viewBox="0 0 56 18"
                        className={clsx("h-5 w-14", cc.text)}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <line
                          x1="2"
                          y1="9"
                          x2="44"
                          y2="9"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeDasharray="6 7"
                          className="arrow-dash"
                        />
                        <polygon
                          points="44,4 54,9 44,14"
                          fill="currentColor"
                          className="arrow-head"
                        />
                      </svg>

                      {step.text ? (
                        <div className={clsx("mt-2 text-[11px] font-mono whitespace-nowrap", cc.text)}>
                          {step.text}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                const iconType = (step.iconType || "EMOJI") as IconType;
                let iconEl: React.ReactNode = <span className="text-lg">📍</span>;

                // if (iconType === "EMOJI") {
                //   iconEl = <span className="text-xl">{step.icon || "📍"}</span>;
                // }

                if (iconType === "EMOJI" && step !== undefined) {
                  const Icon = iconMap[step?.icon] || MapPin;

                  iconEl = (
                    <div className="rounded-lg bg-slate-100 text-slate-700">
                      <Icon size={30} />
                    </div>
                  );
                }

                if (iconType === "IMAGE") {
                  iconEl = step.icon ? (
                    <img src={step.icon} alt="" className="h-7 w-7 object-contain" />
                  ) : (
                    <span className="text-xl">🖼️</span>
                  );
                }

                if (iconType === "TECH") {
                  const techId = step.iconRef?.id;
                  const tech = techId ? getTechById(techId) : undefined;

                  iconEl = tech?.iconClass ? (
                    <i
                      className={`${tech.iconClass} colored`}
                      style={{ fontSize: 24, lineHeight: 1 }}
                    />
                  ) : (
                    <span className="text-xl">⚙️</span>
                  );
                }

                return (
                  <div
                    key={stableKey("node", idx, step.id)}
                    className="flex min-h-[140px] w-[148px] shrink-0 flex-col items-center gap-3 text-center animate-[fadeInUp_220ms_ease-out_forwards] opacity-0"
                    style={{ animationDelay: `${idx * 60}ms` } as any}
                  >
                    <div
                      className={clsx(
                        "grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm ring-2",
                        cc.ring
                      )}
                      title={step.iconRef?.name || step.label || ""}
                    >
                      {iconEl}
                    </div>

                    <div className="text-sm font-semibold text-slate-900">
                      {step.label || "Step"}
                    </div>

                    {step.desc ? (
                      <div className="text-xs leading-5 text-slate-500">
                        {step.desc}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes dashMove {
              from {
                stroke-dashoffset: 0;
              }
              to {
                stroke-dashoffset: -26;
              }
            }

            @keyframes headNudge {
              0%,
              100% {
                transform: translateX(0);
                opacity: 0.9;
              }
              50% {
                transform: translateX(0.6px);
                opacity: 1;
              }
            }

            :global(.arrow-dash) {
              animation: dashMove 1.25s linear infinite;
              opacity: 0.85;
            }

            :global(.arrow-head) {
              transform-origin: center;
              animation: headNudge 1.25s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              :global(.arrow-dash),
              :global(.arrow-head) {
                animation: none !important;
              }
            }
          `}</style>
        </div>
      ) : null}
    </div>
  );
}