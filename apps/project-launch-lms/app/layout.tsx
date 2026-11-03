import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Launch Lab | From Curiosity to Action",
  description:
    "Discover a project direction, test what is feasible, and begin with a meaningful first step.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
