import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Webper - Professional Image Compression",
    template: "%s | Webper"
  },
  description: "Secure, private, and fast image compression tool. Optimize WebP, PNG, and JPEG images locally in your browser. No limits, no ads, 100% free.",
  keywords: [
    "image compression",
    "compress images",
    "webp converter",
    "png optimizer",
    "jpeg compressor",
    "client-side compression",
    "private image tool",
    "secure compression",
    "webper",
    "fast image optimization"
  ],
  authors: [{ name: "Wahib Irawan", url: "https://github.com/wahibirawan" }],
  creator: "Wahib Irawan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webper.app",
    title: "Webper - Professional Image Compression",
    description: "Optimize images without limits. 100% private, client-side compression. No ads, no data collection.",
    siteName: "Webper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webper - Professional Image Compression",
    description: "Optimize images without limits. 100% private, client-side compression. No ads, no data collection.",
    creator: "@wahibirawan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
