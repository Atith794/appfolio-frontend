"use client";

import React from "react";
import { TECH_CATALOG } from "@/lib/techCatalog";
import {
  Monitor,
  Cpu,
  Database,
  Cloud,
  Plug,
} from "lucide-react";

type TechGroup = {
  key: "frontend" | "backend" | "database" | "infra";
  label: string;
  items: string[];
};

type IntegrationItem = {
  key: string;
  value: string;
};

function getTechById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function getGroupIcon(key: TechGroup["key"]) {
  switch (key) {
    case "frontend":
      return <Monitor className="h-5 w-5 text-slate-500" />;
    case "backend":
      return <Cpu className="h-5 w-5 text-slate-500" />;
    case "database":
      return <Database className="h-5 w-5 text-slate-500" />;
    case "infra":
      return <Cloud className="h-5 w-5 text-slate-500" />;
    default:
      return <Monitor className="h-5 w-5 text-slate-500" />;
  }
}

function TechItem({ id }: { id: string }) {
  const item = getTechById(id);
  const name = item?.name ?? id;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
        {item?.iconClass ? (
          <i
            className={`${item.iconClass} colored`}
            style={{ fontSize: 18, lineHeight: 1 }}
          />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        )}
      </div>

      <div className="text-[15px] font-medium text-slate-800">{name}</div>
    </div>
  );
}

function TechCard({ group }: { group: TechGroup }) {
  return (
    <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
          {getGroupIcon(group.key)}
        </div>
        <h3 className="text-[20px] font-semibold text-slate-800">
          {group.label}
        </h3>
      </div>

      <div className="space-y-6">
        {group.items.map((id) => (
          <TechItem key={`${group.key}-${id}`} id={id} />
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({ item }: { item: IntegrationItem }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50">
          <Plug className="h-4 w-4 text-slate-500" />
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">
            {String(item.key || "")}
          </div>
          <div className="mt-1 text-sm leading-6 text-slate-500">
            {String(item.value || "")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicTechStack({
  groups,
  integrations = [],
}: {
  groups: TechGroup[];
  integrations?: IntegrationItem[];
}) {
  const nonEmpty = groups.filter((g) => (g.items?.length ?? 0) > 0);
  const visibleIntegrations = integrations.filter(
    (it) => String(it?.key || "").trim() || String(it?.value || "").trim()
  );

  if (!nonEmpty.length && !visibleIntegrations.length) return null;

  return (
    <div className="space-y-10">
      {nonEmpty.length ? (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            <span className="text-lg">&lt;/&gt;</span>
            <span>Tech Stack</span>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
            {nonEmpty.map((group) => (
              <TechCard key={group.key} group={group} />
            ))}
          </div>
        </div>
      ) : null}

      {visibleIntegrations.length ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            <Plug className="h-4 w-4" />
            <span>Integrations</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleIntegrations.slice(0, 4).map((item, idx) => (
              <IntegrationCard
                key={`${item.key}-${idx}`}
                item={item}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}