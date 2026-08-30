import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = { title:"Latin Square Trainer", description:"Timed 5×5 Latin square practice." };
export default function RootLayout({children}:{readonly children:React.ReactNode}){return <html lang="en"><body>{children}<Analytics /></body></html>}
