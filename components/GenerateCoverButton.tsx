"use client";

import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { useState } from "react";

export function GenerateCoverButton({ appId }: { appId: string }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  async function generateCover() {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        alert("Not authenticated");
        return;
      }

      await apiFetch(`/apps/${appId}/generate-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Cover generated successfully");
    } catch (e: any) {
      alert(e.message || "Failed to generate cover");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={generateCover}
        disabled={loading}
        className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
      >
      {loading ? "Generating..." : "Generate Cover"}
      </button>
    </>
  );
}
