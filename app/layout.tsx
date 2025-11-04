import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: side-effect import of global CSS without type declarations
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Golden Brown Pasta - Produk Pasta Berkualitas Sejak 1980",
  description: "Golden Brown Pasta menyediakan produk pasta dan bahan makanan berkualitas dengan sertifikasi Halal MUI dan BPOM. Berdiri sejak 1980, kami berkomitmen memberikan produk terbaik untuk konsumen Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
