import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieConsent } from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriByMeli — Repas sains personnalisés, livrés | Diététicienne D.E. Guadeloupe",
  description:
    "Des déjeuners frais, pesés et dosés pour ton corps par une diététicienne Diplômée d'État. Compose ton menu en 2 minutes — livraison offerte, places limitées. Bilan nutritionnel offert.",
  keywords: [
    "diététicienne",
    "naturopathe",
    "Guadeloupe",
    "Martinique",
    "Antilles",
    "nutrition",
    "bilan alimentaire",
    "alimentation saine",
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ScrollToTop />
        <CookieConsent />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('contextmenu',function(e){e.preventDefault()});document.addEventListener('dragstart',function(e){e.preventDefault()});`,
          }}
        />
      </body>
    </html>
  );
}
