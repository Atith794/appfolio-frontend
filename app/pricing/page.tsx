"use client";

import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { loadRazorpay } from "@/lib/loadRazorpay";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PricingPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const token = await getToken();
      if (!token) {
        alert("Please login to upgrade.");
        return;
      }

      // 1) Create order
      const orderData: any = await apiFetch("/billing/create-order", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
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
        description: "Lifetime Pro access",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 2) Verify payment
          await apiFetch("/billing/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(response)
          });

          // 3) Redirect to dashboard
          router.push("/dashboard");
          router.refresh();
        },
        theme: { color: "#111111" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        alert(resp?.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (e: any) {
      alert(e.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>Pricing</h1>

      <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Free</div>
          <div style={{ marginTop: 6, color: "#666" }}>₹0</div>
          <ul style={{ marginTop: 12, color: "#444", paddingLeft: 18 }}>
            <li>Unlimited apps</li>
            <li>Up to 6 screenshots/app</li>
            <li>Walkthrough builder</li>
            <li>Public share links</li>
          </ul>
        </div>

        <div style={{ border: "1px solid #111", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Pro</div>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>₹399 <span style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>(one-time)</span></div>
          <ul style={{ marginTop: 12, color: "#444", paddingLeft: 18 }}>
            <li>Up to 12 screenshots/app</li>
            <li>Remove branding</li>
            <li>Cover themes + choose cover screenshot</li>
            <li>Pro badge on profile</li>
          </ul>

          <button
            onClick={upgrade}
            disabled={loading}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Opening payment..." : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </main>
  );
}