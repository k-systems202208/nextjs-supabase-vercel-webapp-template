import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Supabase + Vercel Template",
  description: "Reusable web application starter for Next.js, Supabase and Vercel.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#172033" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1420" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
