// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { apiFetch } from "@/lib/api";
// import { loadRazorpay } from "@/lib/loadRazorpay";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function PricingPage() {
//   const { getToken } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   async function upgrade() {
//     setLoading(true);
//     try {
//       const ok = await loadRazorpay();
//       if (!ok) {
//         alert("Razorpay SDK failed to load");
//         return;
//       }

//       const token = await getToken();
//       if (!token) {
//         alert("Please login to upgrade.");
//         return;
//       }

//       // 1) Create order
//       const orderData: any = await apiFetch("/billing/create-order", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (orderData?.alreadyPro) {
//         alert("You are already Pro ✅");
//         router.push("/dashboard");
//         return;
//       }

//       const options = {
//         key: orderData.keyId,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Appfolio Pro",
//         description: "Lifetime Pro access",
//         order_id: orderData.orderId,
//         handler: async function (response: any) {
//           // 2) Verify payment
//           await apiFetch("/billing/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify(response)
//           });

//           // 3) Redirect to dashboard
//           router.push("/dashboard");
//           router.refresh();
//         },
//         theme: { color: "#111111" }
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.on("payment.failed", function (resp: any) {
//         alert(resp?.error?.description || "Payment failed");
//       });
//       rzp.open();
//     } catch (e: any) {
//       alert(e.message || "Upgrade failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
//       <h1 style={{ fontSize: 28, fontWeight: 900 }}>Pricing</h1>

//       <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
//         <div style={{ border: "1px solid #ddd", borderRadius: 16, padding: 16 }}>
//           <div style={{ fontWeight: 800, fontSize: 18 }}>Free</div>
//           <div style={{ marginTop: 6, color: "#666" }}>₹0</div>
//           <ul style={{ marginTop: 12, color: "#444", paddingLeft: 18 }}>
//             <li>Unlimited apps</li>
//             <li>Up to 6 screenshots/app</li>
//             <li>Walkthrough builder</li>
//             <li>Public share links</li>
//           </ul>
//         </div>

//         <div style={{ border: "1px solid #111", borderRadius: 16, padding: 16 }}>
//           <div style={{ fontWeight: 900, fontSize: 18 }}>Pro</div>
//           <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>₹399 <span style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>(one-time)</span></div>
//           <ul style={{ marginTop: 12, color: "#444", paddingLeft: 18 }}>
//             <li>Up to 12 screenshots/app</li>
//             <li>Remove branding</li>
//             <li>Cover themes + choose cover screenshot</li>
//             <li>Pro badge on profile</li>
//           </ul>

//           <button
//             onClick={upgrade}
//             disabled={loading}
//             style={{
//               marginTop: 14,
//               padding: "10px 14px",
//               borderRadius: 12,
//               border: "1px solid #111",
//               background: "#111",
//               color: "#fff",
//               cursor: loading ? "not-allowed" : "pointer",
//               opacity: loading ? 0.7 : 1
//             }}
//           >
//             {loading ? "Opening payment..." : "Upgrade to Pro"}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// V2
// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { apiFetch } from "@/lib/api";
// import { loadRazorpay } from "@/lib/loadRazorpay";
// import { useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import { Check, Sparkles, ArrowLeft } from "lucide-react";

// export default function PricingPage() {
//   const { getToken } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   async function upgrade() {
//     setLoading(true);
//     try {
//       const ok = await loadRazorpay();
//       if (!ok) {
//         alert("Razorpay SDK failed to load");
//         return;
//       }

//       const token = await getToken();
//       if (!token) {
//         alert("Please login to upgrade.");
//         return;
//       }

//       const orderData: any = await apiFetch("/billing/create-order", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (orderData?.alreadyPro) {
//         alert("You are already Pro ✅");
//         router.push("/dashboard");
//         return;
//       }

//       const options = {
//         key: orderData.keyId,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Appfolio Pro",
//         description: "Lifetime Pro access",
//         order_id: orderData.orderId,
//         handler: async function (response: any) {
//           await apiFetch("/billing/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(response),
//           });

//           router.push("/dashboard");
//           router.refresh();
//         },
//         theme: { color: "#111111" },
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.on("payment.failed", function (resp: any) {
//         alert(resp?.error?.description || "Payment failed");
//       });
//       rzp.open();
//     } catch (e: any) {
//       alert(e.message || "Upgrade failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const freeFeatures = useMemo(
//     () => [
//       "Unlimited apps",
//       "Up to 6 screenshots/app",
//       "Walkthrough builder",
//       "Public share links",
//     ],
//     []
//   );

//   const proFeatures = useMemo(
//     () => [
//       "Up to 12 screenshots/app",
//       "Screenshot groups (Onboarding, Home, Checkout)",
//       "Remove branding",
//       "Cover themes + choose cover screenshot",
//       "Pro badge on profile",
//     ],
//     []
//   );

//   return (
//     <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
//       {/* Top bar (like panels) */}
//       <div className="flex items-center justify-between gap-3">
//         <button
//           onClick={() => router.back()}
//           className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer inline-flex items-center gap-2"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <button
//           onClick={() => router.push("/dashboard")}
//           className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
//         >
//           Dashboard
//         </button>
//       </div>

//       {/* Header */}
//       <div className="mt-8">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
//           <Sparkles size={14} />
//           Unlock professional credibility
//         </div>

//         <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-serif">
//           Pricing
//         </h1>
//         <p className="mt-2 text-slate-500 font-serif max-w-2xl">
//           Free gets you started. Pro unlocks the premium sections + extra polish for recruiters.
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="mt-8 grid gap-4 lg:grid-cols-2">
//         {/* FREE */}
//         <div className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 hover:border-primary/50 hover:bg-primary/5 transition-all">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <div className="text-lg font-bold text-slate-900 font-serif">Free</div>
//               <div className="mt-1 text-slate-500 font-mono text-sm">For getting started</div>
//             </div>

//             <div className="text-right">
//               <div className="text-2xl font-black text-slate-900 font-serif">₹0</div>
//               <div className="text-xs text-slate-500 font-mono">forever</div>
//             </div>
//           </div>

//           <div className="mt-5 space-y-2">
//             {freeFeatures.map((f) => (
//               <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
//                 <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">
//                   <Check size={14} />
//                 </span>
//                 <span className="font-serif">{f}</span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 flex flex-wrap gap-2">
//             <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
//               Public share
//             </span>
//             <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
//               Core builder
//             </span>
//             <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
//               Basic credibility
//             </span>
//           </div>
//         </div>

//         {/* PRO */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 relative overflow-hidden">
//           {/* subtle accent */}
//           <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />

//           <div className="relative">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-lg font-black text-slate-900 font-serif">
//                     Pro
//                   </div>
//                   <span className="text-[11px] px-2 py-[2px] rounded-full border-2 border-primary text-primary font-mono">
//                     RECOMMENDED
//                   </span>
//                 </div>
//                 <div className="mt-1 text-slate-500 font-mono text-sm">
//                   Lifetime access (one-time)
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className="text-3xl font-black text-slate-900 font-serif">
//                   ₹399
//                 </div>
//                 <div className="text-xs text-slate-500 font-mono">(one-time)</div>
//               </div>
//             </div>

//             <div className="mt-5 space-y-2">
//               {proFeatures.map((f) => (
//                 <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
//                   <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
//                     <Check size={14} />
//                   </span>
//                   <span className="font-serif">{f}</span>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={upgrade}
//               disabled={loading}
//               className={`mt-6 w-full px-4 py-3 rounded-xl text-sm font-semibold font-serif
//                 bg-primary/10 text-primary hover:bg-primary/20 transition-all
//                 ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
//               `}
//             >
//               {loading ? "Opening payment..." : "Upgrade to Pro"}
//               <span className="ml-2 text-[11px] px-2 py-[2px] rounded-full border-2 border-primary font-mono">
//                 PRO
//               </span>
//             </button>

//             <p className="mt-3 text-xs text-slate-500 font-mono">
//               Secure checkout via Razorpay. If you already have Pro, you’ll be redirected.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom hint (same style as your Info strip) */}
//       <div className="mt-6">
//         <p className="flex items-center gap-2 text-xs font-medium text-primary/80">
//           <Sparkles size={14} />
//           <span>
//             Pro is designed to make your Appfolio feel “recruiter-ready” with premium sections and polish.
//           </span>
//         </p>
//       </div>
//     </main>
//   );
// }


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

/**
 * $10M-startup pricing page structure:
 * - Hero + trust
 * - Billing toggle
 * - Currency selector
 * - 3 cards (Free, Pro Monthly, Pro Yearly)
 * - Feature comparison table
 * - FAQ
 * - Bottom CTA
 *
 * You can keep Razorpay for India and use Stripe for US/UK later.
 */

type Currency = "USD" | "GBP" | "INR";
type Billing = "MONTHLY" | "YEARLY";

function detectCurrency(): Currency {
  // Best-effort locale-based detection (fast, no IP lookup).
  // Fallback USD.
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
    // optional “anchor” for discount messaging (what yearly would cost if paid monthly)
    yearlyAnchor?: number;
  }
> = {
  USD: { monthly: 15, yearly: 60, yearlyAnchor: 15 * 12 },
  GBP: { monthly: 12, yearly: 48, yearlyAnchor: 12 * 12 },
  INR: { monthly: 499, yearly: 1999, yearlyAnchor: 499 * 12 },
};

// Feature set (keep aligned with your product decisions)
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

  async function handleUpgrade() {
    // For now: keep your Razorpay flow for INR.
    // For USD/GBP: show a “Stripe coming soon” message OR route to your Stripe checkout when implemented.
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        alert("Please login to upgrade.");
        return;
      }

      if (provider === "RAZORPAY") {
        const ok = await loadRazorpay();
        if (!ok) {
          alert("Razorpay SDK failed to load");
          return;
        }

        // You should pass billing + currency to backend so it creates correct order amount.
        // Example: POST /billing/create-order { plan: 'PRO', billing: 'MONTHLY'|'YEARLY', currency: 'INR' }
        const orderData: any = await apiFetch("/billing/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: "PRO",
            billing,
            currency,
          }),
        });

        if (orderData?.alreadyPro) {
          alert("You are already Pro ✅");
          router.push("/dashboard");
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Appfolio Pro",
          description:
            billing === "MONTHLY" ? "Pro Monthly subscription" : "Pro Yearly subscription",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            await apiFetch("/billing/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...response,
                billing,
                currency,
              }),
            });

            router.push("/dashboard");
            router.refresh();
          },
          theme: { color: "#111111" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          alert(resp?.error?.description || "Payment failed");
        });
        rzp.open();
        return;
      }

      // Stripe path (implement when ready):
      // 1) call backend to create stripe checkout session
      // 2) redirect to session url
      alert(
        "For US/UK payments, Stripe checkout is recommended. Wire Stripe next and this button will redirect to Stripe."
      );
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

        {/* Pro */}
        {/* <div className="rounded-2xl border border-slate-200 bg-white p-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black text-slate-900 font-serif">Pro</div>
                  <span className="text-[11px] px-2 py-[2px] rounded-full border-2 border-primary text-primary font-mono">
                    POPULAR
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500 font-mono">
                  {billing === "MONTHLY" ? "Billed monthly" : "Billed yearly (best value)"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-slate-900 font-serif">
                  {formatPrice(proPrice, currency)}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {billing === "MONTHLY" ? "/ month" : "/ year"}
                </div>
              </div>
            </div>

            {billing === "YEARLY" && savePct?.saved ? (
              <div className="mt-3 text-xs text-primary/90 font-mono">
                Save {formatPrice(savePct.saved, currency)} vs monthly
              </div>
            ) : null}

            <div className="mt-4 space-y-2">
              {[
                "Up to 20 screenshots/app",
                "Screenshot groups",
                "Choose cover screenshot + themes",
                "Remove branding + Pro badge",
                "Architecture + Integrations & Key Decisions unlocked",
              ].map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Check size={14} />
                  </span>
                  <span className="font-serif">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className={`mt-6 w-full px-4 py-3 rounded-xl text-sm font-semibold font-serif
                bg-primary/10 text-primary hover:bg-primary/20 transition-all
                ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {loading ? "Opening checkout..." : "Upgrade to Pro"}
              <span className="ml-2 text-[11px] px-2 py-[2px] rounded-full border-2 border-primary font-mono">
                PRO
              </span>
            </button>

            <p className="mt-3 text-xs text-slate-500 font-mono">
              Payment provider:{" "}
              <span className="text-slate-900">{provider}</span> (auto by currency)
            </p>
          </div>
        </div> */}

        {/* Yearly highlight card (always shown) */}
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
            onClick={() => {
              setBilling("YEARLY");
              handleUpgrade();
            }}
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
            onClick={() => {
              setBilling("YEARLY");
              handleUpgrade();
            }}
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