"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { TECH_CATALOG, TECH_BY_ID } from "@/lib/techCatalog";
import {
  Lock, User, FileEdit, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCcw,
  Home, Search, Package, FileText, Upload, Download, Folder, Receipt,
  MessageCircle, Phone, Bell, MapPin, CreditCard, ShoppingCart, Cloud, Image,
  Brain, Settings, Puzzle, Link, Shield, BarChart3, FlaskConical, Rocket, Plus, Trash2,
  Database
} from "lucide-react";

type StepKind = "NODE" | "ARROW";
type IconType = "EMOJI" | "TECH" | "IMAGE";

type FlowStep = {
  id: string;
  kind: StepKind;
  order: number;
  label?: string;
  desc?: string;
  iconType?: IconType;
  icon?: string;
  iconRef?: { id: string; name: string; category: string };
  text?: string;
  color?: string;
};

type Flow = {
  id: string;
  title: string;
  emoji?: string;
  order: number;
  steps: FlowStep[];
};

type Walkthroughs = {
  intro?: string;
  flows: Flow[];
};

// const EMOJI_PRESETS = [
//   "🔐","👤","📝","✅","❌","⚠️","⏳","🔄",
//   "🏠","🔍","📦","📄","📤","📥","🗂️","🧾",
//   "💬","📞","🔔","📍","💳","🛒","☁️","🖼️",
//   "🧠","⚙️","🧩","🔗","🛡️","📊","🧪","🚀",
// ];

const ICON_PRESETS = [
  { key: "lock", Icon: Lock },
  { key: "user", Icon: User },
  { key: "fileEdit", Icon: FileEdit },
  { key: "checkCircle", Icon: CheckCircle },
  { key: "xCircle", Icon: XCircle },
  { key: "alertTriangle", Icon: AlertTriangle },
  { key: "clock", Icon: Clock },
  { key: "refreshCcw", Icon: RefreshCcw },

  { key: "home", Icon: Home },
  { key: "search", Icon: Search },
  { key: "package", Icon: Package },
  { key: "fileText", Icon: FileText },
  { key: "upload", Icon: Upload },
  { key: "download", Icon: Download },
  { key: "folder", Icon: Folder },
  { key: "receipt", Icon: Receipt },

  { key: "messageCircle", Icon: MessageCircle },
  { key: "phone", Icon: Phone },
  { key: "bell", Icon: Bell },
  { key: "mapPin", Icon: MapPin },
  { key: "creditCard", Icon: CreditCard },
  { key: "shoppingCart", Icon: ShoppingCart },
  { key: "cloud", Icon: Cloud },
  { key: "image", Icon: Image },

  { key: "brain", Icon: Brain },
  { key: "settings", Icon: Settings },
  { key: "puzzle", Icon: Puzzle },
  { key: "link", Icon: Link },
  { key: "shield", Icon: Shield },
  { key: "barChart3", Icon: BarChart3 },
  { key: "flaskConical", Icon: FlaskConical },
  { key: "rocket", Icon: Rocket },
  { key: "database", Icon: Database}
];

const COLORS = ["blue", "green", "purple", "orange", "pink", "cyan", "yellow"];

export function UserFlowWalkthroughsPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();
  const [data, setData] = useState<Walkthroughs>({ intro: "", flows: [] });
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchMap, setSearchMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;

      const res = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const wf = (res as any).app?.userFlowWalkthroughs;
    if (wf) {
    const normalized = {
    ...wf,
    flows: (wf.flows || []).map((flow: any, fi: number) => ({
      id: flow.id || crypto.randomUUID(),
      title: flow.title || "",
      emoji: flow.emoji || "📌",
      order: flow.order ?? fi,
      steps: (flow.steps || []).map((step: any, si: number) => ({
        id: step.id || crypto.randomUUID(),
        kind: step.kind,
        order: step.order ?? si,
        label: step.label,
        desc: step.desc,
        iconType: step.iconType || "EMOJI",
        icon: step.icon,
        iconRef: step.iconRef,
        text: step.text,
        color: step.color || "blue",
      })),
    })),
    };

    setData(normalized);
    }
      setLoading(false);
    }

    load();
  }, [appId]);

  function addFlow() {
    setData(prev => ({
      ...prev,
      flows: [
        ...prev.flows,
        {
          id: crypto.randomUUID(),
          title: "New Flow",
          emoji: "📌",
          order: prev.flows.length,
          steps: [],
        },
      ],
    }));
  }

  function deleteFlow(index: number) {
    setData(prev => ({
      ...prev,
      flows: prev.flows.filter((_, i) => i !== index),
    }));
    setSelectedFlowIndex(0);
  }

  function addStep(kind: StepKind) {
    setData(prev => {
      const flows = prev.flows.map((f, i) =>
        i === selectedFlowIndex
          ? {
              ...f,
              steps: [
                ...f.steps,
                {
                  id: crypto.randomUUID(),
                  kind,
                  order: f.steps.length,
                  iconType: "EMOJI",
                  color: "blue",
                },
              ],
            }
          : f
      );
      return { ...prev, flows };
    });
  }

  function deleteStep(stepId: string) {
    setData(prev => ({
      ...prev,
      flows: prev.flows.map((f, i) =>
        i === selectedFlowIndex
          ? { ...f, steps: f.steps.filter(s => s.id !== stepId) }
          : f
      ),
    }));
  }

  async function save() {
    try {
      setSaving(true);
      const token = await getToken();
      if (!token) return;

      await apiFetch(`/apps/${appId}/user-flow-walkthroughs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      setSaving(false);
      alert("Saved");
    } catch (error) {
      console.error("Error:",error);
    } finally{
      setSaving(false);
    }
  }

  function SearchBar({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40">
        <span className="text-slate-400 text-sm">⌕</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />
      </div>
    );
  }

  function Chip({
    active,
    children,
    onClick,
    title,
  }: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition
          ${
            active
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
      >
        {children}
      </button>
    );
  }

  function SelectedPill({ children }: { children: React.ReactNode }) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {children}
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  const selectedFlow = data.flows[selectedFlowIndex];

  return (
    <section style={{ marginTop: 16 }}>
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-slate-800 font-serif">
              User Flow Walkthroughs
            </h3>
            <p className="text-sm text-slate-500 font-serif">
              Create structured flow explanations.
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Flow Tabs */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {data.flows.map((flow, i) => (
            <div key={flow.id} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedFlowIndex(i)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                  selectedFlowIndex === i
                    ? "bg-primary/10 border-primary/40 text-primary font-serif font-medium"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-serif font-medium"
                }`}
              >
                {/* {flow.emoji}  */}
                {flow.title}
              </button>

              <button
                onClick={() => deleteFlow(i)}
                className="p-1 rounded-lg text-danger hover:text-danger hover:bg-danger/10 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addFlow}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          >
            <span className="px-0.5 py-1"><Plus size={18}/> </span>Add Flow
          </button>
        </div>

        {/* Steps */}
        {selectedFlow && (
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
            <input
              value={selectedFlow.title}
              onChange={(e) => {
                setData(prev => ({
                  ...prev,
                  flows: prev.flows.map((f, i) =>
                    i === selectedFlowIndex ? { ...f, title: e.target.value } : f
                  ),
                }));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />

            <div className="flex gap-2">
              <button
                onClick={() => addStep("NODE")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
              >
                <span className="px-0.5 py-1"><Plus size={18}/> </span>Add Node
              </button>
              <button
                onClick={() => addStep("ARROW")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
              >
                <span className="px-0.5 py-1"><Plus size={18}/> </span>Add Arrow
              </button>
            </div>

            {selectedFlow.steps.map((step) => {
              const search = searchMap[step.id] || "";
              const filteredTech = TECH_CATALOG.filter(t =>
                t.name.toLowerCase().includes(search.toLowerCase())
              );

              return (
                <div
                  key={step.id}
                  className="border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-3 relative"
                >
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="absolute top-3 right-3 p-2 rounded-lg text-danger hover:text-danger hover:bg-danger/10 transition"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div 
                    className="text-xs font-semibold text-slate-700 font-mono"
                  >
                    {step.kind}
                  </div>

                  {step.kind === "NODE" && (
                    <>
                      <input
                        placeholder="Label"
                        value={step.label || ""}
                        onChange={(e) =>
                          setData(prev => ({
                            ...prev,
                            flows: prev.flows.map((f, i) =>
                              i === selectedFlowIndex
                                ? {
                                    ...f,
                                    steps: f.steps.map(s =>
                                      s.id === step.id
                                        ? { ...s, label: e.target.value }
                                        : s
                                    ),
                                  }
                                : f
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                      />

                      <div className="flex flex-wrap gap-2 font-serif">
                        <Chip
                          active={step.iconType === "EMOJI"}
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              flows: prev.flows.map((f, i) =>
                                i === selectedFlowIndex
                                  ? {
                                      ...f,
                                      steps: f.steps.map((s) =>
                                        s.id === step.id ? { ...s, iconType: "EMOJI", iconRef: undefined } : s
                                      ),
                                    }
                                  : f
                              ),
                            }));
                          }}
                        >
                          Emoji
                        </Chip>

                        <Chip
                          active={step.iconType === "TECH"}
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              flows: prev.flows.map((f, i) =>
                                i === selectedFlowIndex
                                  ? {
                                      ...f,
                                      steps: f.steps.map((s) =>
                                        s.id === step.id ? { ...s, iconType: "TECH", icon: "" } : s
                                      ),
                                    }
                                  : f
                              ),
                            }));
                          }}
                        >
                          Tech
                        </Chip>
                      </div>
                       {step.iconType === "TECH" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-slate-800 font-serif">
                              Pick a tech
                            </div>

                            {step.iconRef?.id ? (
                              <SelectedPill>
                                <span className="text-slate-700">Selected:</span>
                                <span className="font-semibold text-primary">{step.iconRef.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setData((prev) => ({
                                      ...prev,
                                      flows: prev.flows.map((f, i) =>
                                        i === selectedFlowIndex
                                          ? {
                                              ...f,
                                              steps: f.steps.map((s) =>
                                                s.id === step.id ? { ...s, iconRef: undefined } : s
                                              ),
                                            }
                                          : f
                                      ),
                                    }));
                                  }}
                                  className="ml-1 rounded-full px-2 py-0.5 text-[11px] hover:bg-primary/15"
                                  title="Clear"
                                >
                                  ✕
                                </button>
                              </SelectedPill>
                            ) : (
                              <div className="text-xs text-slate-500">No tech selected</div>
                            )}
                          </div>

                          <SearchBar
                            value={search}
                            onChange={(v) =>
                              setSearchMap((prev) => ({
                                ...prev,
                                [step.id]: v,
                              }))
                            }
                            placeholder="Search tech..."
                          />

                          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                            {filteredTech.map((tech) => {
                              const active = step.iconRef?.id === tech.id;
                              return (
                                <Chip
                                  key={tech.id}
                                  active={active}
                                  onClick={() => {
                                    setData((prev) => ({
                                      ...prev,
                                      flows: prev.flows.map((f, i) =>
                                        i === selectedFlowIndex
                                          ? {
                                              ...f,
                                              steps: f.steps.map((s) =>
                                                s.id === step.id
                                                  ? {
                                                      ...s,
                                                      iconRef: {
                                                        id: tech.id,
                                                        name: tech.name,
                                                        category: tech.category,
                                                      },
                                                    }
                                                  : s
                                              ),
                                            }
                                          : f
                                      ),
                                    }));
                                  }}
                                  title={tech.category}
                                >
                                  {tech.iconClass ? (
                                    <i className={`${tech.iconClass} colored text-base`} />
                                  ) : null}
                                  <span className="whitespace-nowrap">{tech.name}</span>
                                </Chip>
                              );
                            })}
                          </div>
                        </div>
                      )}

                     
                      {step.iconType === "EMOJI" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-800 font-serif">
                              Pick an emoji
                            </div>

                            {step.icon?.trim() ? (
                              <SelectedPill>
                                <span className="text-slate-700">Selected:</span>
                                <span className="text-base">{step.icon}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setData((prev) => ({
                                      ...prev,
                                      flows: prev.flows.map((f, i) =>
                                        i === selectedFlowIndex
                                          ? {
                                              ...f,
                                              steps: f.steps.map((s) =>
                                                s.id === step.id ? { ...s, icon: "" } : s
                                              ),
                                            }
                                          : f
                                      ),
                                    }));
                                  }}
                                  className="ml-1 rounded-full px-2 py-0.5 text-[11px] hover:bg-primary/15"
                                  title="Clear"
                                >
                                  ✕
                                </button>
                              </SelectedPill>
                            ) : (
                              <div className="text-xs text-slate-500">No emoji selected</div>
                            )}
                          </div>

                          {ICON_PRESETS.map(({ key, Icon }) => (
                            <Chip
                              key={key}
                              active={(step.icon || "") === key}
                              onClick={() =>
                                setData((prev) => ({
                                  ...prev,
                                  flows: prev.flows.map((f, i) =>
                                    i === selectedFlowIndex
                                      ? {
                                          ...f,
                                          steps: f.steps.map((s) =>
                                            s.id === step.id ? { ...s, icon: key } : s
                                          ),
                                        }
                                      : f
                                  ),
                                }))
                              }
                              title={`Select ${key}`}
                            >
                              <Icon size={16} className="text-slate-700" />
                            </Chip>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {step.iconRef?.id && (
                    <div 
                      // className="text-xs text-slate-700"
                      className="text-xs text-slate-500 font-serif"
                    >
                    </div>
                  )}

                  {step.kind === "ARROW" && (
                    <input
                      placeholder="Arrow text"
                      value={step.text || ""}
                      onChange={(e) =>
                        setData(prev => ({
                          ...prev,
                          flows: prev.flows.map((f, i) =>
                            i === selectedFlowIndex
                              ? {
                                  ...f,
                                  steps: f.steps.map(s =>
                                    s.id === step.id
                                      ? { ...s, text: e.target.value }
                                      : s
                                  ),
                                }
                              : f
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                  )}
                  
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </section>
  );
}
