import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "Latin Square Generator - Free 5×5 Practice",
    template: "%s | Latin Square Generator",
  },
  description:
    "Generate free 5×5 Latin square puzzles with Easy, Medium and Hard difficulty. Practice Latin square reasoning questions with a timer and instant solutions.",
  keywords: [
    "latin square generator",
    "5x5 latin square generator",
    "latin square puzzle generator",
    "latin square solver",
    "latin square practice",
    "latin square questions",
    "latin square reasoning questions",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}