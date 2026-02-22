import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelFlow | Logistics Engine",
  description: "Autonomous Agentic Reconciliation Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}