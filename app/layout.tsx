import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI UNLIMITED",
  description: "Anified AI workspace with smart provider fallback.",
};

export default function RootLayout({props}: readonly { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{props.children}</body></html>;
}
