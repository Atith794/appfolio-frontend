"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import type { Plan } from "@/lib/planConfig";
import { PublicAppView } from "@/components/public/PublicAppView";

export default function PreviewClient({ appId }: { appId: string }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [realPlan, setRealPlan] = useState<Plan>("FREE");
  const [previewPlan, setPreviewPlan] = useState<Plan>("FREE");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const plan = ((res as any)?.meta?.plan as Plan) || "FREE";
      setData({ user: (res as any)?.user ?? { username: "", displayName: "" }, app: (res as any)?.app, meta: { plan } });
      setRealPlan(plan);
      setPreviewPlan(plan);
      setLoading(false);
    })();
  }, [appId]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading preview…</div>;
  if (!data?.app) return <div className="p-6 text-sm text-red-600">App not found</div>;
  {console.log("Plan Status",realPlan)}

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800 font-serif">Preview</div>
            {realPlan === "FREE" ? <div className="text-xs text-slate-500">Compare Free vs Pro rendering.</div>:null}
          </div>

          <div className="flex items-center gap-3">
            {realPlan === "FREE" ? (
              <div className="flex rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreviewPlan("FREE")}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    previewPlan === "FREE"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlan("PRO")}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    previewPlan === "PRO"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Pro
                </button>
              </div>
            ) : (
              null
            )}
            {realPlan === "FREE" && previewPlan === "PRO" ? (
              <button
                type="button"
                onClick={() => (window.location.href = "/pricing")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <PublicAppView
        data={data}
        effectivePlan={previewPlan}
        showBackLink={false}
      />
    </div>
  );
}
