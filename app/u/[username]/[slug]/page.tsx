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
  const effectivePlan = ((data as any)?.meta?.effectivePlan as Plan) || "FREE";
  return (
    <PublicAppView
      data={data}
      effectivePlan={effectivePlan}
      showBackLink={true}
    />
  );
}