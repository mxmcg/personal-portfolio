import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { SkipLink } from "./components/SkipLink";

// Option 1: Space Grotesk (headings) + DM Sans (body)
// Modern, geometric sans-serif pairing great for a dev profile
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Option 2: Poppins (headings) + Open Sans (body)
// Uncomment these and swap in the className below for a cleaner, friendlier look
// import { Poppins, Open_Sans } from "next/font/google";
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
//   variable: "--font-heading",
// });
// const openSans = Open_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

export const metadata: Metadata = {
  title: "Max McGee - Senior Full Stack Engineer",
  description:
    "Senior Full Stack Engineer specializing in web and mobile applications for Fortune 500 brands and enterprise clients.",
  keywords: [
    "full-stack developer",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "portfolio",
  ],
  authors: [{ name: "Max McGee" }],
  creator: "Max McGee",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maxmcgee.com",
    title: "Max McGee - Senior Full Stack Engineer",
    description:
      "Senior Full Stack Engineer specializing in web and mobile applications for Fortune 500 brands and enterprise clients.",
    siteName: "Max McGee Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max McGee - Senior Full Stack Engineer",
    description:
      "Senior Full Stack Engineer specializing in web and mobile applications for Fortune 500 brands and enterprise clients.",
    creator: "@maxmcgee",
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
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
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
