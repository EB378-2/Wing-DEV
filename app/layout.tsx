import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Marshall Protocol",

  title: {
    default: "Marshal Protocol",
    template: "Protocol",
  },
  icons: { icon: "/favicon.ico" },
  description: "Protocol for managing flight operations and weather data",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marshal Protocol",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Marshall Protocol",
    title: { default: "Marshal", template: "Protocol" },
    description: "Protocol for managing flight operations and weather data",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}