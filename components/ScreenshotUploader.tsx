"use client";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export function ScreenshotUploader({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  async function handleUpload(file: File) {
    const token = await getToken();
    if (!token) return;

    // 1. get signature
    const sigRes = await fetch("http://localhost:4000/uploads/cloudinary-signature", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const sig = await sigRes.json();
    // console.log("Signature api_key:",sig);
    // 2. upload to cloudinary
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", sig.timestamp);
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    //   `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
    //   `cloudinary://226893994726635:EW9A5SHJDsfo4_FGy599-SxvZ3w@dw6fuieud`,
      form
    );

    // 3. save metadata
    await fetch(`http://localhost:4000/apps/${appId}/screenshots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        url: uploadRes.data.secure_url,
        width: uploadRes.data.width,
        height: uploadRes.data.height
      })
    });

    alert("Uploaded");
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
    />
  );
}