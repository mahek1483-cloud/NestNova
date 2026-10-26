import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/common/MobileBottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "NestNova — Trusted Student Living in Gokak, Karnataka",
  description: "Find verified student PGs, hostels, rooms, mess and tiffin services in Gokak, Karnataka with transparent costs and physical verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} font-body antialiased min-h-screen flex flex-col bg-[#FBF8F3] text-[#1B2A2F]`}
      >
        <DemoBanner />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
