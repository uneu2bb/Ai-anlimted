import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Unlimited Pro",
  description: "منصة ذكاء اصطناعي قوية مع دعم الصور والنماذج المتعددة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
