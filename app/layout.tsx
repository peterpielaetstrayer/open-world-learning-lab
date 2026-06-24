import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Open World Learning Lab",
  description:
    "An open-source education design project exploring open-world learning, place-based education, AI glasses, human mentorship, and rigorous real-world learning environments.",
  openGraph: {
    title: "Open World Learning Lab",
    description:
      "An open-source education design project exploring open-world learning, place-based education, AI glasses, human mentorship, and rigorous real-world learning environments.",
    type: "website",
    locale: "en_US",
    siteName: "Open World Learning Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open World Learning Lab",
    description:
      "An open-source education design project exploring open-world learning, place-based education, AI glasses, human mentorship, and rigorous real-world learning environments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
