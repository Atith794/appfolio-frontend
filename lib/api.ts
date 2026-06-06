export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path: string, opts: RequestInit = {}) {
  console.log("API_BASE:",API_BASE)
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, opts);

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data?.message ? data.message : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// export async function apiFetch(path: string, options?: RequestInit) {
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const res = await fetch(`${baseUrl}${path}`, options);
//   // const res = await fetch(`${path}`, options);


//   const contentType = res.headers.get("content-type") || "";
//   const isJson = contentType.includes("application/json");

//   const data = isJson ? await res.json() : await res.text();

//   if (!res.ok) {
//     throw new Error(
//       typeof data === "object" && data?.message
//         ? data.message
//         : `Request failed with status ${res.status}`
//     );
//   }

//   return data;
// }