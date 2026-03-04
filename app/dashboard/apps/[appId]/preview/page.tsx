import { API_BASE } from "@/lib/api";
import PreviewClient from "./preview-client";

async function getApp(appId: string, token: string) {
  const res = await fetch(`${API_BASE}/apps/${appId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({
  params,
}: {
//   params: { appId: string };
params: Promise<{ appId: string }>;
}) {
  // If you’re using Clerk in server components, use auth() / currentUser() accordingly.
  // If not available here, you can do this page as a client component and fetch from client.
  // Keeping it simple: make client fetch instead (recommended if your token retrieval is client-only).
  const { appId } = await params;
  return <PreviewClient appId={appId} />;
}
