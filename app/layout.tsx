import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SkipLink } from "./components/SkipLink";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Max Example - Front-End Engineer",
  description:
    "Senior front-end engineer specializing in building fast, accessible, and user-focused web applications with React, Next.js, and TypeScript.",
  keywords: [
    "front-end developer",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "portfolio",
  ],
  authors: [{ name: "Max Example" }],
  creator: "Max Example",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maxexample.com",
    title: "Max Example - Front-End Engineer",
    description:
      "Senior front-end engineer specializing in building fast, accessible, and user-focused web applications.",
    siteName: "Max Example Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Example - Front-End Engineer",
    description:
      "Senior front-end engineer specializing in building fast, accessible, and user-focused web applications.",
    creator: "@maxexample",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateViewport() {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0a192f" },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
