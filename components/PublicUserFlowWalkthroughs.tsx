"use client";

import { useMemo, useState } from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";

type StepKind = "NODE" | "ARROW";
type IconType = "EMOJI" | "TECH" | "IMAGE";

type FlowStep = {
  id?: string;
  kind: StepKind;
  order?: number;
  label?: string;
  desc?: string;
  iconType?: IconType;
  icon?: string; // emoji or image url
  iconRef?: { id: string; name: string; category: string };
  text?: string; // arrow text
  color?: string; // blue/green/purple/orange/pink/cyan/yellow
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
        // normalize ids to avoid key errors
        id: f.id || `flow-${fi}`,
        steps: (Array.isArray(f.steps) ? f.steps : [])
          .slice()
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((s, si) => ({ ...s, id: s.id || `step-${fi}-${si}` })),
      }));
  }, [data]);

  const [activeId, setActiveId] = useState<string>(flows[0]?.id || "");

  const activeFlow = useMemo(
    () => flows.find((f) => f.id === activeId) || flows[0],
    [flows, activeId]
  );

  if (!flows.length) return null;

  return (
    <div>
      {data?.intro ? (
        <p className="text-sm text-slate-700 font-serif">{data.intro}</p>
      ) : null}

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {flows.map((flow, i) => {
          const isActive = flow.id === (activeFlow?.id || "");
          return (
            <button
              key={stableKey("tab", i, flow.id)}
              onClick={() => setActiveId(flow.id!)}
              className={clsx(
                "px-3 py-2 rounded-xl text-sm font-semibold border transition-all inline-flex items-center gap-2",
                isActive
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <span>{flow.emoji || "📡"}</span>
              <span>{flow.title || "Flow"}</span>
            </button>
          );
        })}
      </div>

      {/* Flow visual */}
      {activeFlow ? (
        <div className="mt-4 rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm">
          <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-center gap-2">
              {activeFlow.steps.map((step, idx) => {
                const c = safeColor(step.color);
                const cc = COLOR_CLASS[c];

                if (step.kind === "ARROW") {
                  return (
                    <div
                      key={stableKey("arrow", idx, step.id)}
                      className="flex flex-col items-center justify-center animate-[fadeInUp_220ms_ease-out_forwards] opacity-0"
                      style={{ animationDelay: `${idx * 60}ms` } as any}
                    >
                      <svg
                        viewBox="0 0 44 16"
                        className={clsx("w-10 h-4", cc.text)}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        {/* Animated dashed line */}
                        <line
                          x1="1"
                          y1="8"
                          x2="34"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="5 6"
                          className="arrow-dash"
                        />

                        {/* Arrow head */}
                        <polygon
                          points="34,4 42,8 34,12"
                          fill="currentColor"
                          className="arrow-head"
                        />
                      </svg>

                      <div className={clsx("mt-1 text-[11px] font-mono whitespace-nowrap", cc.text)}>
                        {step.text || "→"}
                      </div>
                    </div>
                  );
                }
                // NODE
                const iconType = (step.iconType || "EMOJI") as IconType;

                let iconEl: React.ReactNode = <span className="text-lg">📍</span>;

                if (iconType === "EMOJI") {
                  iconEl = <span className="text-lg">{step.icon || "📍"}</span>;
                }

                if (iconType === "IMAGE") {
                  iconEl = step.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={step.icon} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="text-lg">🖼️</span>
                  );
                }

                if (iconType === "TECH") {
                  console.log("Step:",step)
                  const techId = step.iconRef?.id;
                  const tech = techId ? getTechById(techId) : undefined;

                  iconEl = tech?.iconClass ? (
                    <i className={`${tech.iconClass} colored`} style={{ fontSize: 22, lineHeight: 1 }} />
                  ) : (
                    <span className="text-lg">⚙️</span>
                  );
                }

                return (
                  <div
                    key={stableKey("node", idx, step.id)}
                    className="flex flex-col items-center gap-2 min-w-23 max-w-35 text-center animate-[fadeInUp_220ms_ease-out_forwards] opacity-0"
                    style={{ animationDelay: `${idx * 60}ms` } as any}
                  >
                    <div
                      className={clsx(
                        "h-12 w-12 rounded-2xl grid place-items-center bg-white border border-slate-900/10 shadow-sm ring-2",
                        cc.ring
                      )}
                      title={step.iconRef?.name || step.label || ""}
                    >
                      {iconEl}
                    </div>

                    <div className="text-[12px] font-semibold text-slate-900 font-serif">
                      {step.label || "Step"}
                    </div>

                    {step.desc ? (
                      <div className="text-[11px] text-slate-500 leading-snug">
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
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
              /* Subtle “flow” motion: dashes move to the right */
            @keyframes dashMove {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -22; }
            }

            /* Tiny, subtle head “nudge” (optional but nice) */
            @keyframes headNudge {
              0%, 100% { transform: translateX(0); opacity: 0.9; }
              50% { transform: translateX(0.6px); opacity: 1; }
            }

            :global(.arrow-dash) {
              animation: dashMove 1.25s linear infinite;
              opacity: 0.85;
            }

            :global(.arrow-head) {
              transform-origin: center;
              animation: headNudge 1.25s ease-in-out infinite;
            }

            /* Respect reduced motion */
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
