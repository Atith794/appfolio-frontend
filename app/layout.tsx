import { ClerkProvider } from "@clerk/nextjs";
import "devicon/devicon.min.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
