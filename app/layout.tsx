import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Practice mathematics daily, strengthen your problem-solving skills, take on challenges, and compete with other students in real-time multiplayer.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mathematicsdaily.com"),
  title: "Mathematics Daily",
  description,
  openGraph: {
    title: "Mathematics Daily",
    description,
    url: "https://mathematicsdaily.com",
    siteName: "Mathematics Daily",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mathematics Daily",
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", type: "image/x-icon", sizes: "any" },
      { url: "/icon.svg?v=2", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-icon.png?v=2", type: "image/png", sizes: "256x256" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
