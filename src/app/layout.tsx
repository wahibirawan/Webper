import type { Metadata } from "next";
import { Space_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Webper",
  description: "Professional image compression tool. Simple, fast, and private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${pressStart2P.variable} font-mono antialiased min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        {children}
      </body>
    </html>
  );
}
