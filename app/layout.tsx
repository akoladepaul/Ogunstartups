import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "OgunStartups — Ogun State Innovation Directory",
    template: "%s | OgunStartups",
  },
  description:
    "The central database for all startups, innovation hubs, and business support organizations in Ogun State, Nigeria. Discover, connect, and grow.",
  keywords: ["Ogun State", "startups", "Nigeria", "innovation", "entrepreneurs", "tech hub"],
  authors: [{ name: "Paul Akolade" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "OgunStartups",
    title: "OgunStartups — Ogun State Innovation Directory",
    description:
      "The central database for all startups, innovation hubs, and business support organizations in Ogun State, Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OgunStartups",
    description: "Discover Ogun State's startup ecosystem.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
