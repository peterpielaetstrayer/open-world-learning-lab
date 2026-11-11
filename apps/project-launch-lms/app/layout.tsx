import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open World Learning Lab",
  description:
    "Access and teach courses in Open World Learning Lab.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
