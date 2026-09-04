import type { Metadata } from "next";
import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import { profile } from "@/data/profile";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
export const metadata: Metadata = { title: `${profile.brand} — ${profile.name}`, description: "Software Developer focado em aplicações web, interfaces e produtos digitais.", openGraph: { title: `${profile.brand} — ${profile.name}`, description: "Software Developer focado em aplicações web, interfaces e produtos digitais.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={`${inter.variable} ${interTight.variable} ${geistMono.variable}`}><Navbar />{children}<Footer /></body></html>; }