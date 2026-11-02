import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Peer-to-Peer Creative Workspace & Studio Sharing",
    template: "%s · StudioSpace",
  },
  description:
    "Discover, compare and book photography studios, sound stages, podcast lounges, music suites and art workshops — or host your own creative space on StudioSpace.",
  keywords: [
    "studio rental",
    "photo studio",
    "sound stage",
    "podcast room",
    "recording studio",
    "creative workspace",
    "book studio by hour",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>
          <Suspense
            fallback={
              <div className="h-16 w-full border-b bg-background" />
            }
          >
            <Navbar />
          </Suspense>


          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
