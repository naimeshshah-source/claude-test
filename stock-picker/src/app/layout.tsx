import type { Metadata } from "next";
import { Caveat, Kalam } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stock Picker — Sector Picks",
  description: "Hand-picked top 5 stocks by sector",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${kalam.variable} antialiased`} style={{ backgroundColor: "#fdfcf7", color: "#1a1a1a" }}>
        <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
