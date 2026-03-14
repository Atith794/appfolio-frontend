"use client";

import React from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";

type TechGroup = {
  key: "frontend" | "backend" | "database" | "infra";
  label: string;
  items: string[];
};

function getTechById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function TechChip({ id }: { id: string }) {
  const item = getTechById(id);
  const name = item?.name ?? id;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
      {item?.iconClass ? (
        <i className={`${item.iconClass} colored`} style={{ fontSize: 16, lineHeight: 1 }} />
      ) : (
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
      )}
      {name}
    </span>
  );
}

export default function PublicTechStack({ groups }: { groups: TechGroup[] }) {
  const nonEmpty = groups.filter((g) => (g.items?.length ?? 0) > 0);

  if (!nonEmpty.length) return null;

  return (
    <div className="space-y-6">
      {nonEmpty.map((g) => (
        <div key={g.key}>
          <div className="mb-3 text-sm font-semibold text-slate-500">{g.label}</div>
          <div className="flex flex-wrap gap-3">
            {g.items.map((id) => (
              <TechChip key={`${g.key}-${id}`} id={id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}