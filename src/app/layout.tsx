import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mapadapalavra.online"),
  title: "Mapa da Palavra | Guia Visual dos 66 Livros da Bíblia",
  description: "Mapa da Palavra é um guia visual físico para estudar os 66 livros da Bíblia com clareza, direção e constância.",
  alternates: {
    canonical: "https://mapadapalavra.online",
  },
  openGraph: {
    title: "Mapa da Palavra | Guia Visual dos 66 Livros da Bíblia",
    description: "Mapa da Palavra é um guia visual físico para estudar os 66 livros da Bíblia com clareza, direção e constância.",
    url: "https://mapadapalavra.online",
    siteName: "Mapa da Palavra",
    images: [
      {
        url: "https://mapadapalavra.online/assets/imagem_mapa_palavra4.webp",
        width: 1200,
        height: 1200,
        alt: "Mapa da Palavra",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  other: {
    "facebook-domain-verification": "pw5shmtez24xmwrgi2hjjz6riawa93",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId="GTM-TNRXNN47" />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
