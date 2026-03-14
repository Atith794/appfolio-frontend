"use client";

import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { loadRazorpay } from "@/lib/loadRazorpay";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  HelpCircle,
} from "lucide-react";

type Currency = "USD" | "GBP" | "INR";
type Billing = "MONTHLY" | "YEARLY";

function detectCurrency(): Currency {
  
  const locale =
    (typeof navigator !== "undefined" && navigator.language) || "en-US";

  const l = locale.toUpperCase();
  if (l.includes("IN")) return "INR";
  if (l.includes("GB")) return "GBP";
  if (l.includes("US")) return "USD";
  return "USD";
}

function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 0,
  }).format(amount);
}

const PRICES: Record<
  Currency,
  {
    monthly: number;
    yearly: number;
    yearlyAnchor?: number;
  }
> = {
  USD: { monthly: 15, yearly: 60, yearlyAnchor: 15 * 12 },
  GBP: { monthly: 12, yearly: 48, yearlyAnchor: 12 * 12 },
  INR: { monthly: 499, yearly: 1999, yearlyAnchor: 499 * 12 },
};

const FEATURE_ROWS = [
  { key: "apps", label: "Unlimited apps", free: true, pro: true },
  { key: "share", label: "Public share links", free: true, pro: true },
  {
    key: "shots",
    label: "Screenshots per app",
    free: "6",
    pro: "20",
  },
  {
    key: "groups",
    label: "Screenshot groups",
    free: false,
    pro: true,
  },
  {
    key: "cover",
    label: "Choose cover screenshot + themes",
    free: false,
    pro: true,
  },
  {
    key: "walkthrough",
    label: "Userflow walkthrough builder",
    free: true,
    pro: true,
  },
  {
    key: "premiumSections",
    label: "Architecture + Integrations & Key Decisions",
    free: "Preview (locked)",
    pro: "Unlocked",
  },
  {
    key: "branding",
    label: "Remove Appfolio branding",
    free: false,
    pro: true,
  },
  {
    key: "badge",
    label: "Pro badge",
    free: false,
    pro: true,
  },
];

const FAQS = [
  {
    q: "Is Pro a subscription or one-time?",
    a: "Pro is available as a monthly subscription or a discounted yearly plan. You can choose what fits you.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your Pro features remain active until the end of the billing period. After that, your account falls back to Free with locked previews for Pro sections.",
  },
  {
    q: "Why regional pricing?",
    a: "We price by region to stay fair and accessible while maintaining a premium product experience.",
  },
  {
    q: "Can I switch from monthly to yearly later?",
    a: "Yes. You can upgrade to yearly anytime (recommended for best value).",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [currency, setCurrency] = useState<Currency>("USD");
  const [billing, setBilling] = useState<Billing>("YEARLY");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const price = PRICES[currency];
  const proPrice = billing === "MONTHLY" ? price.monthly : price.yearly;

  async function startStripeCheckout(token: string, billing: Billing, currency: Currency) {
    const data = await apiFetch("/billing/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ billing, currency }),
    });

    if (!data?.url) throw new Error("Stripe checkout session URL missing");
    window.location.href = data.url; // redirect to Stripe
  }

  const savePct = useMemo(() => {
    if (!price.yearlyAnchor) return null;
    const yearly = price.yearly;
    const anchor = price.yearlyAnchor;
    const saved = anchor - yearly;
    if (saved <= 0) return null;
    const pct = Math.round((saved / anchor) * 100);
    return { saved, pct, anchor };
  }, [price]);

  // Payment routing: IN -> Razorpay (now), else -> Stripe (later)
  const provider = useMemo(() => {
    return currency === "INR" ? "RAZORPAY" : "STRIPE";
  }, [currency]);

  async function handleUpgrade(nextBilling?: Billing) {

    const chosenBilling = nextBilling ?? billing;

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        alert("Please login to upgrade.");
        return;
      }

      if (currency === "INR") {
        const ok = await loadRazorpay();
        if (!ok) {
          alert("Razorpay SDK failed to load");
          return;
        }

        const subData = await apiFetch("/billing/razorpay/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ billing: chosenBilling, currency: "INR" }),
        });

        if (subData?.alreadyPro) {
          alert("You are already Pro ✅");
          router.push("/dashboard");
          return;
        }

        const options = {
          key: subData.keyId,
          subscription_id: subData.subscriptionId,
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
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          alert(resp?.error?.description || "Payment failed");
        });
        rzp.open();
        return;
      }

      await startStripeCheckout(token, chosenBilling, currency);
    } catch (e: any) {
      alert(e?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
        >
          Dashboard
        </button>
      </div>

      {/* Hero */}
      <section className="mt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
          <Sparkles size={14} />
          Premium engineer portfolio, not a generic project list
        </div>

        <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-serif">
          Pricing that upgrades your credibility
        </h1>
        <p className="mt-3 text-slate-500 font-serif max-w-2xl">
          Recruiters don’t read long text. Appfolio helps you present your app like a case study —
          screenshots, user flows, architecture and decisions.
        </p>

        {/* Trust strip */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={14} /> Secure payments
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeCheck size={14} /> Cancel anytime
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles size={14} /> Pro unlocks premium sections
          </span>
        </div>
      </section>

      {/* Controls */}
      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Billing toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 w-fit">
            <button
              type="button"
              onClick={() => setBilling("MONTHLY")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === "YEARLY"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Yearly
              {savePct?.pct ? (
                <span className="ml-2 text-[11px] px-2 py-[2px] rounded-full border-2 border-primary text-primary font-mono">
                  Save {savePct.pct}%
                </span>
              ) : null}
            </button>
          </div>

          {/* Currency selector */}
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Free */}
        <div className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-bold text-slate-900 font-serif">Free</div>
              <div className="mt-1 text-sm text-slate-500 font-mono">Get started</div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-serif">
              {formatPrice(0, currency)}
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
            className="mt-6 w-full px-4 py-3 rounded-xl text-sm font-semibold font-serif bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all"
          >
            Continue with Free <ArrowRight className="inline ml-2" size={16} />
          </button>
        </div>
        <div className="group border-2 border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-primary/5 hover:border-primary/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-black text-slate-900 font-serif">
                Pro Yearly
              </div>
              <div className="mt-1 text-sm text-slate-500 font-mono">Best for serious job hunters</div>
            </div>
            <span className="text-[11px] px-2 py-[2px] rounded-full border-2 border-primary text-primary font-mono h-fit">
              BEST VALUE
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-serif">
              {formatPrice(price.yearly, currency)}
              <span className="ml-2 text-xs text-slate-500 font-mono">/ year</span>
            </div>
            {savePct?.pct ? (
              <div className="mt-2 text-xs text-primary/90 font-mono">
                Save {savePct.pct}% (vs monthly)
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
            className={`mt-6 w-full px-4 py-3 rounded-xl text-sm font-semibold font-serif
              bg-slate-900 text-white hover:bg-slate-800 transition-all
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            Choose Yearly <ArrowRight className="inline ml-2" size={16} />
          </button>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-serif">
              Compare plans
            </h2>
            <p className="text-sm text-slate-500 font-serif">
              The Pro plan is built to unlock premium portfolio credibility.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
            <div className="p-4 text-sm font-semibold text-slate-700 font-serif">Feature</div>
            <div className="p-4 text-sm font-semibold text-slate-700 font-serif">Free</div>
            <div className="p-4 text-sm font-semibold text-slate-700 font-serif">Pro</div>
          </div>

          {FEATURE_ROWS.map((row) => (
            <div key={row.key} className="grid grid-cols-3 border-b border-slate-100 last:border-b-0">
              <div className="p-4 text-sm text-slate-700 font-serif">{row.label}</div>
              <div className="p-4 text-sm text-slate-700 font-mono">
                {typeof row.free === "boolean" ? (row.free ? "✓" : "—") : row.free}
              </div>
              <div className="p-4 text-sm text-slate-700 font-mono">
                {typeof row.pro === "boolean" ? (row.pro ? "✓" : "—") : row.pro}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-black text-slate-900 font-serif">FAQ</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="font-semibold text-slate-900 font-serif">{f.q}</div>
              <div className="mt-2 text-sm text-slate-600 font-serif">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-lg font-black text-slate-900 font-serif">
              Ready to make your Appfolio recruiter-ready?
            </div>
            <div className="mt-1 text-sm text-slate-500 font-serif">
              Unlock premium sections and present your engineering decisions clearly.
            </div>
          </div>

          <button
            onClick={() => handleUpgrade("YEARLY")}
            disabled={loading}
            className={`px-5 py-3 rounded-xl text-sm font-semibold font-serif
              bg-primary/10 text-primary hover:bg-primary/20 transition-all
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            Upgrade to Pro <ArrowRight className="inline ml-2" size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}