import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven - Unique Handmade Treasures",
  description: "Discover and purchase unique handcrafted items from talented artisans. A marketplace celebrating creativity, craftsmanship, and authentic handmade products.",
  keywords: "handmade, artisan, crafts, unique gifts, handmade jewelry, pottery, woodworking, textiles",
  authors: [{ name: "Handcrafted Haven Team" }],
  openGraph: {
    title: "Handcrafted Haven - Unique Handmade Treasures",
    description: "Discover and purchase unique handcrafted items from talented artisans.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handcrafted Haven - Unique Handmade Treasures",
    description: "Discover and purchase unique handcrafted items from talented artisans.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream text-charcoal antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
