import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:"Latin Square Trainer", description:"Timed 5×5 Latin square practice." };
export default function RootLayout({children}:{readonly children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
