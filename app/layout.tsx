import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Supabase + Vercel Template",
  description: "Reusable web application starter for Next.js, Supabase and Vercel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
