import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Noto_Sans,
  Open_Sans,
  Montserrat,
  Bricolage_Grotesque,
} from "next/font/google";
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

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  weight: ["400", "500", "600", "700", "800"],
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
  metadataBase: new URL("https://bulk-share.com"),
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
    url: "https://bulk-share.com",
    siteName: "Bulk Share",
    images: [
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1751819068/icon-512_eqmwke.png",
        width: 1200,
        height: 630,
        alt: "Bulk Share",
      },
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1751819068/icon-512_eqmwke.png",
        width: 800,
        height: 600,
        alt: "Bulk Share",
      },
      {
        url: "https://res.cloudinary.com/luvely/image/upload/v1751819068/icon-512_eqmwke.png",
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
      "https://res.cloudinary.com/luvely/image/upload/v1751819068/icon-512_eqmwke.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${notoSans.variable} ${openSans.variable} ${montserrat.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <ProjectProviders>{children}</ProjectProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
