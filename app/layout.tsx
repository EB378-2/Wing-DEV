import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
 
// Load the font from the public directory
const goodTimesFont = localFont({
  src: [
    {
      path: '../public/fonts/GoodTimesRg-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    // You can add other font weights/styles here if available
    // {
    //   path: '../public/fonts/GoodTimesRg-Regular.woff2',
    //   weight: '400',
    //   style: 'normal',
    // }
  ],
  variable: '--font-good-times', // CSS variable for optional use
  display: 'swap', // Better performance
})

export const metadata: Metadata = {
  applicationName: "Marshall Protocol",
  title: {
    default: "Marshal Protocol",
    template: "Protocol",
  },
  icons: { icon: "/favicon.ico" },
  description: "Protocol for managing flight operations and weather data",
  manifest: "/pwa/manifest.json",
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
    <html lang="en" className={goodTimesFont.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}