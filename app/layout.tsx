import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAMFAM",
  description:
    "FAMFAM's mission is to create a harmonious community where electronic music lovers can thrive together, embodying the essence of a family within a family. Join us to foster a full-circle ecosystem of giving and receiving, underpinned by trust, karma, and the genuine desire to do good.",
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
