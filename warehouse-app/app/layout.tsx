import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sklad — Қойма есебі",
  description: "Тауар позицияларының қойма есебін басқару жүйесі",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
