// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "@clerk/nextjs";
// import { apiFetch } from "@/lib/api";
// import { TECH_CATALOG, TECH_BY_ID, TechItem } from "@/lib/techCatalog";

// type StepKind = "NODE" | "ARROW";
// type IconType = "EMOJI" | "TECH" | "IMAGE";

// type FlowStep = {
//   kind: StepKind;
//   order: number;
//   label?: string;
//   desc?: string;
//   iconType?: IconType;
//   icon?: string;
//   iconRef?: { id: string; name: string; category: string };
//   text?: string;
//   color?: string;
// };

// type Flow = {
//   id: string;
//   title: string;
//   emoji?: string;
//   order: number;
//   steps: FlowStep[];
// };

// type Walkthroughs = {
//   intro?: string;
//   flows: Flow[];
// };

// const COLORS = ["blue", "green", "purple", "orange", "pink", "cyan", "yellow"];

// export function UserFlowWalkthroughsPanel({ appId }: { appId: string }) {
//   const { getToken } = useAuth();
//   const [data, setData] = useState<Walkthroughs>({ intro: "", flows: [] });
//   const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     async function load() {
//       const token = await getToken();
//       if (!token) return;

//       const res = await apiFetch(`/apps/${appId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         cache: "no-store",
//       });

//       const wf = (res as any).app?.userFlowWalkthroughs;
//       if (wf) setData(wf);
//       setLoading(false);
//     }

//     load();
//   }, [appId]);

//   function normalizeOrders() {
//     setData((prev) => ({
//       ...prev,
//       flows: prev.flows.map((f, i) => ({
//         ...f,
//         order: i,
//         steps: f.steps.map((s, j) => ({ ...s, order: j })),
//       })),
//     }));
//   }

//   function addFlow() {
//     setData((prev) => ({
//       ...prev,
//       flows: [
//         ...prev.flows,
//         {
//           id: crypto.randomUUID(),
//           title: "New Flow",
//           emoji: "📌",
//           order: prev.flows.length,
//           steps: [],
//         },
//       ],
//     }));
//   }

//   function addStep(kind: StepKind) {
//     setData((prev) => {
//       const flows = [...prev.flows];
//       const flow = flows[selectedFlowIndex];
//       flow.steps.push({
//         kind,
//         order: flow.steps.length,
//         iconType: "EMOJI",
//         color: "blue",
//       });
//       return { ...prev, flows };
//     });
//   }

//   async function save() {
//     try {
//       setSaving(true);
//       const token = await getToken();
//       if (!token) return;

//       await apiFetch(`/apps/${appId}/user-flow-walkthroughs`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       alert("Saved successfully");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const filteredTech = useMemo(() => {
//     return TECH_CATALOG.filter((t:any) =>
//       t?.name?.toLowerCase().includes(search?.toLowerCase())
//     );
//   }, [search]);

//   if (loading) return <p>Loading...</p>;

//   const selectedFlow = data.flows[selectedFlowIndex];

// //   return (
// //     <section className="mt-4 space-y-4">
// //       {/* Intro */}
// //       <textarea
// //         placeholder="Optional intro for this section..."
// //         value={data.intro || ""}
// //         onChange={(e) =>
// //           setData((prev) => ({ ...prev, intro: e.target.value }))
// //         }
// //         className="w-full rounded-lg border px-3 py-2 text-sm"
// //       />

// //       {/* Flow Tabs */}
// //       <div className="flex flex-wrap gap-2">
// //         {data.flows.map((flow, i) => (
// //           <button
// //             key={flow.id}
// //             onClick={() => setSelectedFlowIndex(i)}
// //             className={`px-3 py-2 rounded-lg text-sm border ${
// //               selectedFlowIndex === i
// //                 ? "bg-primary/15 border-primary text-primary"
// //                 : "bg-white border-slate-200"
// //             }`}
// //           >
// //             {flow.emoji} {flow.title}
// //           </button>
// //         ))}

// //         <button
// //           onClick={addFlow}
// //           className="px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary"
// //         >
// //           + Add Flow
// //         </button>
// //       </div>

// //       {/* Selected Flow */}
// //       {selectedFlow && (
// //         <div className="space-y-3 border rounded-xl p-3 bg-white">
// //           <input
// //             value={selectedFlow.title}
// //             onChange={(e) => {
// //               const flows = [...data.flows];
// //               flows[selectedFlowIndex].title = e.target.value;
// //               setData({ ...data, flows });
// //             }}
// //             className="w-full border rounded px-3 py-2 text-sm"
// //             placeholder="Flow title"
// //           />

// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => addStep("NODE")}
// //               className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
// //             >
// //               + Node
// //             </button>
// //             <button
// //               onClick={() => addStep("ARROW")}
// //               className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
// //             >
// //               + Arrow
// //             </button>
// //           </div>

// //           {selectedFlow.steps.map((step, idx) => (
// //             <div key={idx} className="border rounded-lg p-3 space-y-2">
// //               <div className="text-xs font-semibold">
// //                 {idx + 1}. {step.kind}
// //               </div>

// //               {step.kind === "NODE" && (
// //                 <>
// //                   <input
// //                     placeholder="Label"
// //                     value={step.label || ""}
// //                     onChange={(e) => {
// //                       step.label = e.target.value;
// //                       setData({ ...data });
// //                     }}
// //                     className="w-full border rounded px-2 py-1 text-sm"
// //                   />

// //                   <input
// //                     placeholder="Description"
// //                     value={step.desc || ""}
// //                     onChange={(e) => {
// //                       step.desc = e.target.value;
// //                       setData({ ...data });
// //                     }}
// //                     className="w-full border rounded px-2 py-1 text-sm"
// //                   />

// //                   {/* Icon Type */}
// //                   <select
// //                     value={step.iconType}
// //                     onChange={(e) => {
// //                       step.iconType = e.target.value as IconType;
// //                       setData({ ...data });
// //                     }}
// //                     className="border rounded px-2 py-1 text-sm"
// //                   >
// //                     <option value="EMOJI">Emoji</option>
// //                     <option value="TECH">Tech</option>
// //                     <option value="IMAGE">Image URL</option>
// //                   </select>

// //                   {/* Emoji */}
// //                   {step.iconType === "EMOJI" && (
// //                     <input
// //                       placeholder="Emoji"
// //                       value={step.icon || ""}
// //                       onChange={(e) => {
// //                         step.icon = e.target.value;
// //                         setData({ ...data });
// //                       }}
// //                       className="border rounded px-2 py-1 text-sm"
// //                     />
// //                   )}

// //                   {/* Image */}
// //                   {step.iconType === "IMAGE" && (
// //                     <input
// //                       placeholder="Image URL"
// //                       value={step.icon || ""}
// //                       onChange={(e) => {
// //                         step.icon = e.target.value;
// //                         setData({ ...data });
// //                       }}
// //                       className="border rounded px-2 py-1 text-sm"
// //                     />
// //                   )}

// //                   {/* Tech Picker */}
// //                   {step.iconType === "TECH" && (
// //                     <div className="space-y-2">
// //                       <input
// //                         placeholder="Search tech..."
// //                         value={search}
// //                         onChange={(e) => setSearch(e.target.value)}
// //                         className="w-full border rounded px-2 py-1 text-sm"
// //                       />

// //                       <div className="max-h-40 overflow-y-auto border rounded p-2">
// //                         {filteredTech.map((tech: any) => (
// //                           <div
// //                             key={tech.id}
// //                             onClick={() => {
// //                               step.iconRef = {
// //                                 id: tech.id,
// //                                 name: tech.name,
// //                                 category: tech.category,
// //                               };
// //                               setData({ ...data });
// //                             }}
// //                             className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
// //                           >
// //                             {tech.iconClass && (
// //                               <i className={`${tech.iconClass} text-lg`} />
// //                             )}
// //                             <span className="text-sm">{tech.name}</span>
// //                           </div>
// //                         ))}
// //                       </div>

// //                       {step.iconRef?.id && (
// //                         <div className="flex items-center gap-2 text-sm">
// //                           <i
// //                             className={
// //                               TECH_BY_ID[step.iconRef.id]?.iconClass || ""
// //                             }
// //                           />
// //                           {step.iconRef.name}
// //                         </div>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Color */}
// //                   <select
// //                     value={step.color}
// //                     onChange={(e) => {
// //                       step.color = e.target.value;
// //                       setData({ ...data });
// //                     }}
// //                     className="border rounded px-2 py-1 text-sm"
// //                   >
// //                     {COLORS.map((c) => (
// //                       <option key={c} value={c}>
// //                         {c}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </>
// //               )}

// //               {step.kind === "ARROW" && (
// //                 <input
// //                   placeholder="Arrow text (e.g. POST /login)"
// //                   value={step.text || ""}
// //                   onChange={(e) => {
// //                     step.text = e.target.value;
// //                     setData({ ...data });
// //                   }}
// //                   className="w-full border rounded px-2 py-1 text-sm"
// //                 />
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       <button
// //         onClick={save}
// //         disabled={saving}
// //         className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm"
// //       >
// //         {saving ? "Saving..." : "Save Walkthrough"}
// //       </button>
// //     </section>
// //   );
//     return (
//         <section style={{ marginTop: 16 }}>
//             <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">

//             {/* Header */}
//             <div className="flex items-start justify-between gap-3">
//                 <div>
//                 <h3 className="text-base font-semibold text-slate-800 font-serif">
//                     User Flow Walkthroughs
//                 </h3>
//                 <p className="text-sm text-slate-500">
//                     Create structured flow explanations. These will render beautifully on your public Appfolio.
//                 </p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                 <button
//                     onClick={save}
//                     disabled={saving}
//                     className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 flex items-center gap-2"
//                 >
//                     {saving ? "Saving..." : "Save"}
//                 </button>
//                 </div>
//             </div>

//             {/* Intro */}
//             <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-sm font-semibold text-slate-900 mb-2">
//                 Section Intro
//                 </p>
//                 <textarea
//                 value={data.intro || ""}
//                 onChange={(e) =>
//                     setData((prev) => ({ ...prev, intro: e.target.value }))
//                 }
//                 placeholder="Optional intro text shown above the flows..."
//                 className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
//                 />
//             </div>

//             {/* Flow Tabs */}
//             <div className="mt-4 flex flex-wrap gap-2">
//                 {data.flows.map((flow, i) => {
//                 const isActive = selectedFlowIndex === i;
//                 return (
//                     <button
//                     key={flow.id}
//                     onClick={() => setSelectedFlowIndex(i)}
//                     className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
//                         isActive
//                         ? "bg-primary/15 border-primary/40 text-primary"
//                         : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
//                     }`}
//                     >
//                     {flow.emoji} {flow.title}
//                     </button>
//                 );
//                 })}

//                 <button
//                 onClick={addFlow}
//                 className="px-3 py-2 rounded-xl text-sm font-semibold border bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
//                 >
//                 + Add Flow
//                 </button>
//             </div>

//             {/* Selected Flow Card */}
//             {selectedFlow && (
//                 <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">

//                 {/* Flow Title */}
//                 <div>
//                     <p className="text-sm font-semibold text-slate-900 mb-2">
//                     Flow Title
//                     </p>
//                     <input
//                     value={selectedFlow.title}
//                     placeholder="Enter the flow title"
//                     onChange={(e) => {
//                         const flows = [...data.flows];
//                         flows[selectedFlowIndex].title = e.target.value;
//                         setData({ ...data, flows });
//                     }}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-black placeholder:text-slate-400"
//                     />
//                 </div>

//                 {/* Add Step Buttons */}
//                 <div className="flex gap-2">
//                     <button
//                     onClick={() => addStep("NODE")}
//                     className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//                     >
//                     + Node
//                     </button>
//                     <button
//                     onClick={() => addStep("ARROW")}
//                     className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
//                     >
//                     + Arrow
//                     </button>
//                 </div>

//                 {/* Steps */}
//                 <div className="space-y-3">
//                     {selectedFlow.steps.map((step, idx) => (
//                     <div
//                         key={idx}
//                         className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
//                     >
//                         <div className="text-xs font-semibold text-slate-600">
//                         Step {idx + 1} • {step.kind}
//                         </div>

//                         {step.kind === "NODE" && (
//                         <>
//                             <input
//                             placeholder="Step label"
//                             value={step.label || ""}
//                             onChange={(e) => {
//                                 step.label = e.target.value;
//                                 setData({ ...data });
//                             }}
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 text-black placeholder:text-slate-400"
//                             />

//                             <input
//                             placeholder="Step description"
//                             value={step.desc || ""}
//                             onChange={(e) => {
//                                 step.desc = e.target.value;
//                                 setData({ ...data });
//                             }}
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 text-black placeholder:text-slate-400"
//                             />

//                             {/* Tech Picker Section */}
//                             {step.iconType === "TECH" && (
//                             <div className="mt-2">
//                                 <p className="text-sm font-semibold text-slate-900 mb-2">
//                                 Pick Technology
//                                 </p>

//                                 <div className="relative w-full max-w-md">
//                                 <input
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     placeholder="Search tech…"
//                                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
//                                 />
//                                 </div>

//                                 <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//                                 {filteredTech.map((tech) => (
//                                     <button
//                                     key={tech.id}
//                                     type="button"
//                                     onClick={() => {
//                                         step.iconRef = {
//                                         id: tech.id,
//                                         name: tech.name,
//                                         category: tech.category,
//                                         };
//                                         setData({ ...data });
//                                     }}
//                                     className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-3 text-left transition-all"
//                                     >
//                                     {tech.iconClass ? (
//                                         <div className="h-6 w-6 grid place-items-center rounded-md bg-white/90">
//                                         <i className={`${tech.iconClass} colored text-xl`} />
//                                         </div>
//                                     ) : (
//                                         <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold grid place-items-center">
//                                         {tech.name[0]}
//                                         </div>
//                                     )}

//                                     <div className="flex-1">
//                                         <div className="text-sm font-semibold text-slate-900">
//                                         {tech.name}
//                                         </div>
//                                         <div className="text-xs text-slate-500">
//                                         {tech.category}
//                                         </div>
//                                     </div>
//                                     </button>
//                                 ))}
//                                 </div>
//                             </div>
//                             )}
//                         </>
//                         )}

//                         {step.kind === "ARROW" && (
//                         <input
//                             placeholder="Arrow text (e.g. POST /login)"
//                             value={step.text || ""}
//                             onChange={(e) => {
//                             step.text = e.target.value;
//                             setData({ ...data });
//                             }}
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 text-black placeholder:text-shadow-black"
//                         />
//                         )}
//                     </div>
//                     ))}
//                 </div>
//                 </div>
//             )}
//             </div>
//         </section>
//     );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { TECH_CATALOG, TECH_BY_ID } from "@/lib/techCatalog";
import { Plus, Trash2 } from "lucide-react";

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

const EMOJI_PRESETS = [
  "🔐","👤","📝","✅","❌","⚠️","⏳","🔄",
  "🏠","🔍","📦","📄","📤","📥","🗂️","🧾",
  "💬","📞","🔔","📍","💳","🛒","☁️","🖼️",
  "🧠","⚙️","🧩","🔗","🛡️","📊","🧪","🚀",
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
    //   if (wf) setData(wf);
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
            // className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
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
                // className={`px-3 py-2 rounded-xl text-sm font-semibold border ${
                //   selectedFlowIndex === i
                //     ? "bg-primary/15 border-primary text-primary"
                //     : "bg-white border-slate-200"
                // }`}
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
                // className="p-1 text-slate-400 hover:text-red-600"
                className="p-1 rounded-lg text-danger hover:text-danger hover:bg-danger/10 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addFlow}
            // className="flex px-3 py-2 rounded-lg bg-primary/10 text-primary"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          >
            <span className="px-0.5 py-1"><Plus size={18}/> </span>Add Flow
          </button>
        </div>

        {/* Steps */}
        {selectedFlow && (
          // <div className="mt-4 bg-white border rounded-2xl p-4 space-y-4 shadow-sm">
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
              // className="w-full border rounded-xl px-4 py-3 text-sm text-black"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />

            <div className="flex gap-2">
              <button
                onClick={() => addStep("NODE")}
                // className="flex px-3 py-2 rounded-lg bg-primary/10 text-primary"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
              >
                <span className="px-0.5 py-1"><Plus size={18}/> </span>Add Node
              </button>
              <button
                onClick={() => addStep("ARROW")}
                // className="flex px-3 py-2 rounded-lg bg-primary/10 text-primary"
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
                  // className="border rounded-xl bg-slate-50 p-4 space-y-3 relative"
                  className="border border-slate-200 rounded-xl bg-slate-50 p-4 space-y-3 relative"
                >
                  <button
                    onClick={() => deleteStep(step.id)}
                    // className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
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
                        // className="w-full border rounded px-3 py-2 text-sm text-black"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                      />

                      {/* Icon Type Dropdown */}
                      {/* <select
                        value={step.iconType}
                        onChange={(e) => {
                          const next = e.target.value as IconType;
                          setData(prev => ({
                            ...prev,
                            flows: prev.flows.map((f, i) =>
                              i === selectedFlowIndex
                                ? {
                                    ...f,
                                    steps: f.steps.map(s => {
                                      if (s.id !== step.id) return s;
                                      if (next === "EMOJI") return { ...s, iconType: next, iconRef: undefined };
                                      if (next === "TECH") return { ...s, iconType: next, icon: "" };
                                      return { ...s, iconType: next };
                                    }),
                                  }
                                : f
                            ),
                          }));
                        }}
                        // className="border rounded px-3 py-2 text-sm text-black"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                      >
                        <option value="EMOJI">Emoji</option>
                        <option value="TECH">Tech</option>
                        <option value="IMAGE">Image URL</option>
                      </select> */}
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
                      {/* Tech Picker */}
                      {/* {step.iconType === "TECH" && (
                        <>
                          <input
                            placeholder="Search tech..."
                            value={search}
                            onChange={(e) =>
                              setSearchMap(prev => ({
                                ...prev,
                                [step.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {filteredTech.map((tech) => (
                              
                              <button
                                key={tech.id}
                                type="button"
                                onClick={() => {
                                  return(
                                    setData(prev => ({
                                    ...prev,
                                    flows: prev.flows.map((f, i) =>
                                      i === selectedFlowIndex
                                        ? {
                                            ...f,
                                            steps: f.steps.map(s =>
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
                                    }))

                                  )
                                }
                                  
                                }
                                // className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white hover:bg-slate-100 text-black"

                                // className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-black
                                // ${step.iconRef?.id === tech.id ? "bg-primary/10 border-primary" : "bg-white hover:bg-slate-100"}`}

                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition
                                ${step.iconRef?.id === tech.id
                                  ? "bg-primary/10 border-primary/40 text-primary"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {tech.iconClass && (
                                  <i className={`${tech.iconClass} colored text-lg`} />
                                )
                                }
                                <span className="text-sm">{tech.name}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )} */}
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

                      {/* Emoji Picker */}
                      {/* {step.iconType === "EMOJI" && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-600">Pick an emoji</div>

                          <div className="grid grid-cols-8 gap-2">
                            {EMOJI_PRESETS.map((em) => {
                              const active = (step.icon || "") === em;
                              return (
                                <button
                                  key={em}
                                  type="button"
                                  onClick={() =>
                                    setData(prev => ({
                                      ...prev,
                                      flows: prev.flows.map((f, i) =>
                                        i === selectedFlowIndex
                                          ? {
                                              ...f,
                                              steps: f.steps.map(s =>
                                                s.id === step.id ? { ...s, icon: em } : s
                                              ),
                                            }
                                          : f
                                      ),
                                    }))
                                  }
                                  // className={`h-9 w-9 rounded-lg border text-lg flex items-center justify-center
                                  //   ${active ? "bg-primary/10 border-primary" : "bg-white hover:bg-slate-100 border-slate-200"}`}
                                  // aria-label={`Select ${em}`}
                                  className={`h-9 w-9 rounded-lg border text-lg flex items-center justify-center transition
                                  ${active
                                    ? "bg-primary/10 border-primary/40"
                                    : "bg-white hover:bg-slate-50 border-slate-200"
                                  }`}
                                >
                                  {em}
                                </button>
                              );
                            })}
                          </div>

                          <input
                            placeholder="Or type an emoji…"
                            value={step.icon || ""}
                            onChange={(e) =>
                              setData(prev => ({
                                ...prev,
                                flows: prev.flows.map((f, i) =>
                                  i === selectedFlowIndex
                                    ? {
                                        ...f,
                                        steps: f.steps.map(s =>
                                          s.id === step.id ? { ...s, icon: e.target.value } : s
                                        ),
                                      }
                                    : f
                                ),
                              }))
                            }
                            // className="w-full border rounded px-3 py-2 text-sm text-black"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                          />
                        </div>
                      )} */}
                     
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

                          <div className="flex flex-wrap gap-2">
                            {EMOJI_PRESETS.map((em) => (
                              <Chip
                                key={em}
                                active={(step.icon || "") === em}
                                onClick={() =>
                                  setData((prev) => ({
                                    ...prev,
                                    flows: prev.flows.map((f, i) =>
                                      i === selectedFlowIndex
                                        ? {
                                            ...f,
                                            steps: f.steps.map((s) =>
                                              s.id === step.id ? { ...s, icon: em } : s
                                            ),
                                          }
                                        : f
                                    ),
                                  }))
                                }
                                title={`Select ${em}`}
                              >
                                <span className="text-base">{em}</span>
                              </Chip>
                            ))}
                          </div>

                          <div className="text-xs text-slate-500 font-serif">
                            Or type your own:
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40">
                            <input
                              placeholder="Type an emoji…"
                              value={step.icon || ""}
                              onChange={(e) =>
                                setData((prev) => ({
                                  ...prev,
                                  flows: prev.flows.map((f, i) =>
                                    i === selectedFlowIndex
                                      ? {
                                          ...f,
                                          steps: f.steps.map((s) =>
                                            s.id === step.id ? { ...s, icon: e.target.value } : s
                                          ),
                                        }
                                      : f
                                  ),
                                }))
                              }
                              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {step.iconRef?.id && (
                    <div 
                      // className="text-xs text-slate-700"
                      className="text-xs text-slate-500 font-serif"
                    >
                      {/* Selected: <span className="font-semibold">{step.iconRef.name}</span> */}
                      {/* Selecte: <span className="font-semibold text-slate-800">{step.iconRef.name}</span> */}
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
                      // className="w-full border rounded px-3 py-2 text-sm text-black placeholder:text-primary/70"
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
