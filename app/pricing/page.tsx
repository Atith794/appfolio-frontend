"use client";

import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { loadRazorpay } from "@/lib/loadRazorpay";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Billing = "MONTHLY" | "YEARLY";

type PricingContext = {
  country: string;
  region: string;
  currency: "INR" | "USD" | "GBP" | "EUR";
  provider: "razorpay" | "stripe";
  prices: {
    monthly: number;
    yearly: number;
    yearlyAnchor: number;
  };
};

const FEATURE_ROWS = [
  { key: "apps", label: "Unlimited apps", free: true, pro: true },
  { key: "share", label: "Public share links", free: true, pro: true },
  { key: "shots", label: "Screenshots per app", free: "6", pro: "20" },
  { key: "groups", label: "Screenshot groups", free: false, pro: true },
  { key: "cover", label: "Choose cover screenshot + themes", free: false, pro: true },
  { key: "walkthrough", label: "Userflow walkthrough builder", free: true, pro: true },
  {
    key: "premiumSections",
    label: "Architecture + Integrations & Key Decisions",
    free: "Preview (locked)",
    pro: "Unlocked",
  },
  { key: "branding", label: "Remove Appfolio branding", free: false, pro: true },
  { key: "badge", label: "Pro badge", free: false, pro: true },
];

const FAQS = [
  {
    q: "Is Pro a subscription or one-time?",
    a: "Pro is available as a monthly subscription or a discounted yearly plan.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your Pro access remains active until the end of the billing period.",
  },
  {
    q: "Why regional pricing?",
    a: "We price by region to stay fair and accessible while maintaining a premium product experience.",
  },
  {
    q: "Can I switch from monthly to yearly later?",
    a: "Yes. You can move to yearly later for better value.",
  },
];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [billing, setBilling] = useState<Billing>("YEARLY");
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingContext | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setPricingError(null);
        const data = await apiFetch("/billing/pricing-context");
        if (!mounted) return;
        setPricing(data);
      } catch (e: any) {
        if (!mounted) return;
        setPricingError(e?.message || "Unable to load pricing");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const savePct = useMemo(() => {
    if (!pricing?.prices?.yearlyAnchor) return null;
    const saved = pricing.prices.yearlyAnchor - pricing.prices.yearly;
    if (saved <= 0) return null;
    return Math.round((saved / pricing.prices.yearlyAnchor) * 100);
  }, [pricing]);

  async function handleUpgrade(nextBilling?: Billing) {
    const chosenBilling = nextBilling ?? billing;
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        alert("Please login to upgrade.");
        return;
      }

      const data = await apiFetch("/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billing: chosenBilling }),
      });

      if (data?.alreadyPro) {
        alert("You are already Pro ✅");
        router.push("/dashboard");
        return;
      }

      if (data?.provider === "razorpay") {
        const ok = await loadRazorpay();
        if (!ok) {
          alert("Razorpay SDK failed to load");
          return;
        }

        const rzp = new (window as any).Razorpay({
          key: data.keyId,
          subscription_id: data.subscriptionId,
          name: "Appfolio Pro",
          description: chosenBilling === "MONTHLY" ? "Pro Monthly" : "Pro Yearly",
          handler: async (resp: any) => {
            await apiFetch("/billing/razorpay/verify-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(resp),
            });

            router.push("/dashboard");
            router.refresh();
          },
        });

        rzp.on("payment.failed", function (resp: any) {
          alert(resp?.error?.description || "Payment failed");
        });

        rzp.open();
        return;
      }

      if (data?.provider === "stripe" && data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.message || "Invalid checkout response");
    } catch (e: any) {
      alert(e?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  if (pricingError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-700">Unable to load pricing</h1>
          <p className="mt-2 text-sm text-red-600">{pricingError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!pricing) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-600">Loading pricing...</p>
        </div>
      </main>
    );
  }

  const monthlyPrice = formatPrice(pricing.prices.monthly, pricing.currency);
  const yearlyPrice = formatPrice(pricing.prices.yearly, pricing.currency);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary/90 hover:bg-primary/20"
        >
          Back
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary/90 hover:bg-primary/20"
        >
          Dashboard
        </button>
      </div>

      <section className="mt-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
          <Sparkles size={14} />
          Premium engineer portfolio, not a generic project list
        </div>

        <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Pricing that upgrades your credibility
        </h1>

        <p className="mt-3 max-w-2xl font-serif text-slate-500">
          Recruiters don’t read long text. Appfolio helps you present your app like a
          case study — screenshots, user flows, architecture and decisions.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={14} />
            Secure payments
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeCheck size={14} />
            Cancel anytime
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles size={14} />
            Pro unlocks premium sections
          </span>
        </div>

        <p className="mt-4 text-sm font-mono text-slate-500">
          Prices shown for your region in {pricing.currency}.
        </p>
      </section>

      <section className="mt-8">
        <div className="inline-flex w-fit rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setBilling("MONTHLY")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "MONTHLY"
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBilling("YEARLY")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "YEARLY"
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Yearly
            {savePct ? (
              <span className="ml-2 rounded-full border-2 border-primary px-2 py-[2px] text-[11px] font-mono text-primary">
                Save {savePct}%
              </span>
            ) : null}
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="group rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-primary/50 hover:bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-serif text-lg font-bold text-slate-900">Free</div>
              <div className="mt-1 font-mono text-sm text-slate-500">Get started</div>
            </div>

            <div className="font-serif text-2xl font-black text-slate-900">
              {formatPrice(0, pricing.currency)}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {["Unlimited apps", "Up to 6 screenshots/app", "Walkthrough builder", "Public share link"].map(
              (f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
                    <Check size={14} />
                  </span>
                  <span className="font-serif">{f}</span>
                </div>
              )
            )}
            <div className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
                <HelpCircle size={14} />
              </span>
              <span className="font-serif">
                Architecture + Key Decisions sections shown as{" "}
                <span className="font-mono text-primary/80">locked preview</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200"
          >
            Continue with Free
            <ArrowRight className="ml-2 inline" size={16} />
          </button>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 p-6 transition-all hover:border-primary/40 hover:bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-serif text-lg font-black text-slate-900">Pro Monthly</div>
              <div className="mt-1 font-mono text-sm text-slate-500">Flexible billing</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-serif text-3xl font-black text-slate-900">
              {monthlyPrice}
              <span className="ml-2 font-mono text-xs text-slate-500">/ month</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {["Everything in Pro", "Good for short job-search cycles", "Cancel anytime"].map(
              (f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
                    <Check size={14} />
                  </span>
                  <span className="font-serif">{f}</span>
                </div>
              )
            )}
          </div>

          <button
            onClick={() => handleUpgrade("MONTHLY")}
            disabled={loading}
            className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-slate-400"
                : "cursor-pointer bg-slate-900 hover:bg-slate-800"
            }`}
          >
            Choose Monthly
            <ArrowRight className="ml-2 inline" size={16} />
          </button>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 transition-all hover:border-primary/40 hover:bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-serif text-lg font-black text-slate-900">Pro Yearly</div>
              <div className="mt-1 font-mono text-sm text-slate-500">
                Best for serious job hunters
              </div>
            </div>

            <span className="h-fit rounded-full border-2 border-primary px-2 py-[2px] text-[11px] font-mono text-primary">
              BEST VALUE
            </span>
          </div>

          <div className="mt-4">
            <div className="font-serif text-3xl font-black text-slate-900">
              {yearlyPrice}
              <span className="ml-2 font-mono text-xs text-slate-500">/ year</span>
            </div>

            {savePct ? (
              <div className="mt-2 font-mono text-xs text-primary/90">
                Save {savePct}% (vs monthly)
              </div>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {[
              "Everything in Pro",
              "Maximum savings",
              "Perfect for 6–12 months of job switching",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
                  <Check size={14} />
                </span>
                <span className="font-serif">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleUpgrade("YEARLY")}
            disabled={loading}
            className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-slate-400"
                : "cursor-pointer bg-slate-900 hover:bg-slate-800"
            }`}
          >
            Choose Yearly
            <ArrowRight className="ml-2 inline" size={16} />
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="font-serif text-xl font-black text-slate-900">Compare plans</h2>
          <p className="text-sm font-serif text-slate-500">
            The Pro plan is built to unlock premium portfolio credibility.
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
            <div className="p-4 font-serif text-sm font-semibold text-slate-700">Feature</div>
            <div className="p-4 font-serif text-sm font-semibold text-slate-700">Free</div>
            <div className="p-4 font-serif text-sm font-semibold text-slate-700">Pro</div>
          </div>

          {FEATURE_ROWS.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-3 border-b border-slate-100 last:border-b-0"
            >
              <div className="p-4 font-serif text-sm text-slate-700">{row.label}</div>
              <div className="p-4 font-mono text-sm text-slate-700">
                {typeof row.free === "boolean" ? (row.free ? "✓" : "—") : row.free}
              </div>
              <div className="p-4 font-mono text-sm text-slate-700">
                {typeof row.pro === "boolean" ? (row.pro ? "✓" : "—") : row.pro}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-black text-slate-900">FAQ</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="font-serif font-semibold text-slate-900">{f.q}</div>
              <div className="mt-2 font-serif text-sm text-slate-600">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}