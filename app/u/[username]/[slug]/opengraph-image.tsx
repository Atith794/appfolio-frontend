import { API_BASE } from "@/lib/api";

export default async function Image({ params }: any) {
  const res = await fetch(`${API_BASE}/public/u/${params.username}/${params.slug}`);
  const data = await res.json();

  return new Response(
    `<img src="${data.app.coverImageUrl}" />`,
    { headers: { "Content-Type": "image/jpeg" } }
  );
}

export async function generateMetadata({ params }: any) {
  const res = await fetch(`${API_BASE}/public/u/${params.username}/${params.slug}`);
  const data = await res.json();

  return {
    title: data.app.name,
    description: data.app.shortDescription,
    openGraph: {
      images: [data.app.coverImageUrl]
    }
  };
}
