import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAMFAM",
  description:
    "FAMFAM is an innovative platform dedicated to music enthusiasts, curating a vibrant blend of music, fashion, and art that embodies the contemporary spirit of our age. Coming soon.",
  authors: [{ name: "FAMFAM" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
