import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE } from "@/constants";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Level up your coding speed by typing real TypeScript, React, CSS and more from production-grade projects. Track WPM, accuracy and grade in real time.",
  keywords: [
    "typing practice",
    "code typing",
    "wpm test",
    "developer typing",
    "monkeytype for code",
    "typescript typing",
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Practice typing with real production code. Track WPM, accuracy, and grade in real time.",
    type: "website",
  },
  metadataBase: new URL("https://typestack.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
