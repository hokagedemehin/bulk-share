import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import ProjectProviders from "@/util/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bulk Share",
  description: "Team up with people to buy in bulk and save money",
  keywords: [
    "bulk share",
    "bulk buying",
    "group buying",
    "save money",
    "shared groups",
    "community",
    "shopping",
    "discounts",
    "savings",
    "collaboration",
    "team up",
    "buying together",
    "shared purchases",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://bulk-share.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    title: "Bulk Share",
    description: "Team up with people to buy in bulk and save money",
    url: "https://bulk-share.vercel.app",
    siteName: "Bulk Share",
    images: [
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
        width: 1200,
        height: 630,
        alt: "Bulk Share",
      },
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
        width: 800,
        height: 600,
        alt: "Bulk Share",
      },
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
        width: 1800,
        height: 1600,
        alt: "My bulk share alt",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Share",
    description: "Team up with people to buy in bulk and save money",
    images: [
      "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
    ],
    site: "@bulkshare",
    creator: "@hokage_demehin",
    creatorId: "@hokage_demehin",
    siteId: "@bulkshare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}
      >
        <AppRouterCacheProvider>
          <ProjectProviders>{children}</ProjectProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
