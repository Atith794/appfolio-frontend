// "use client";

// import { useMemo, useState } from "react";

// type TechGroup = {
//   key: "frontend" | "backend" | "database" | "infra";
//   label: string;
//   items: string[];
// };

// function Chip({
//   active,
//   children,
//   onClick,
// }: {
//   active: boolean;
//   children: React.ReactNode;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
//         ${active
//           ? "bg-primary/15 border-primary/30 text-primary"
//           : "bg-white/70 border-slate-900/10 text-slate-600 hover:bg-slate-50"
//         }`}
//     >
//       {children}
//     </button>
//   );
// }

// export default function PublicTechStack({
//   groups,
//   renderBadge,
// }: {
//   groups: TechGroup[];
//   renderBadge: (id: string) => React.ReactNode;
// }) {
//   const nonEmpty = useMemo(
//     () => groups.filter((g) => (g.items?.length ?? 0) > 0),
//     [groups]
//   );

//   const [active, setActive] = useState<"all" | TechGroup["key"]>("all");

//   const visible = useMemo(() => {
//     if (active === "all") return nonEmpty;
//     return nonEmpty.filter((g) => g.key === active);
//   }, [active, nonEmpty]);

//   if (!nonEmpty.length) return null;

//   return (
//     <div className="space-y-5">
//       {/* Filter chips */}
//       <div className="flex flex-wrap items-center gap-2">
//         <Chip active={active === "all"} onClick={() => setActive("all")}>
//           All
//         </Chip>

//         {nonEmpty.map((g) => (
//           <Chip
//             key={g.key}
//             active={active === g.key}
//             onClick={() => setActive(g.key)}
//           >
//             {g.label} <span className="ml-1 font-mono text-[11px] opacity-70">{g.items.length}</span>
//           </Chip>
//         ))}
//       </div>

//       {/* Groups */}
//       <div className="grid gap-4">
//         {visible.map((g) => (
//           <div
//             key={g.key}
//             className="
//               rounded-2xl border border-slate-900/10 bg-white/70 p-4
//               shadow-sm transition-all
//               hover:bg-white hover:shadow-md hover:border-primary/25
//             "
//           >
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-extrabold text-slate-900 font-serif">
//                 {g.label}
//               </div>
//               <div className="text-[11px] font-mono text-slate-400">
//                 {g.items.length} items
//               </div>
//             </div>

//             <div className="mt-3 flex flex-wrap gap-3">
//               {g.items.map((id) => (
//                 <span key={`${g.key}-${id}`}>{renderBadge(id)}</span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Small hint */}
//       <div className="text-[11px] text-slate-500 font-serif">
//         Tip: Hover a group to focus. Use “Integrations & Key Decisions” for auth, state, storage, messaging, etc.
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useMemo, useState } from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";

type TechGroup = {
  key: "frontend" | "backend" | "database" | "infra";
  label: string;
  items: string[];
};

function initials(name: string) {
  const parts = (name || "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function getTechById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
        ${active
          ? "bg-primary/15 border-primary/30 text-primary"
          : "bg-white/70 border-slate-900/10 text-slate-600 hover:bg-slate-50"
        }`}
    >
      {children}
    </button>
  );
}

function TechBadge({ id }: { id: string }) {
  const item = getTechById(id);
  const name = item?.name ?? id;

  return (
    <span
      title={name}
      className="
        group relative flex w-[112px] flex-col items-center justify-center gap-2
        rounded-2xl border border-slate-900/10 bg-white px-4 py-3 shadow-sm
        transition-all duration-200
        hover:-translate-y-[1px] hover:shadow-md hover:border-primary/25
        active:scale-[0.98]
      "
    >
      <span
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          ring-1 ring-transparent
          group-hover:ring-primary/15
          transition
        "
      />

      {item?.iconClass ? (
        <i
          className={`${item.iconClass} colored transition-transform duration-200 group-hover:scale-[1.05]`}
          style={{ fontSize: 34, lineHeight: 1 }}
        />
      ) : (
        <span
          className="
            grid h-10 w-10 place-items-center rounded-xl bg-slate-100
            text-[11px] font-black text-slate-700
            transition-transform duration-200 group-hover:scale-[1.05]
          "
        >
          {initials(name)}
        </span>
      )}

      <span className="text-center text-[11px] font-semibold text-slate-700 font-serif">
        {name}
      </span>
    </span>
  );
}

export default function PublicTechStack({ groups }: { groups: TechGroup[] }) {
  const nonEmpty = useMemo(
    () => groups.filter((g) => (g.items?.length ?? 0) > 0),
    [groups]
  );

  const [active, setActive] = useState<"all" | TechGroup["key"]>("all");

  const visible = useMemo(() => {
    if (active === "all") return nonEmpty;
    return nonEmpty.filter((g) => g.key === active);
  }, [active, nonEmpty]);

  if (!nonEmpty.length) return null;

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={active === "all"} onClick={() => setActive("all")}>
          All
        </Chip>

        {nonEmpty.map((g) => (
          <Chip key={g.key} active={active === g.key} onClick={() => setActive(g.key)}>
            {g.label}{" "}
            <span className="ml-1 font-mono text-[11px] opacity-70">{g.items.length}</span>
          </Chip>
        ))}
      </div>

      {/* Groups */}
      <div className="grid gap-4">
        {visible.map((g) => (
          <div
            key={g.key}
            className="
              rounded-2xl border border-slate-900/10 bg-white/70 p-4
              shadow-sm transition-all
              hover:bg-white hover:shadow-md hover:border-primary/25
            "
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900 font-serif">
                {g.label}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {g.items.length} items
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              {g.items.map((id) => (
                <TechBadge key={`${g.key}-${id}`} id={id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
