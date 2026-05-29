import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AWS Study Pal — SAA-C03 Exam Prep",
    template: "%s | AWS Study Pal",
  },
  description:
    "Free AWS Solutions Architect Associate (SAA-C03) exam prep. 330 practice questions, 120 flashcards, 84 service references, and a progress dashboard. Study smarter.",
  keywords: [
    "AWS SAA-C03",
    "AWS Solutions Architect Associate",
    "AWS practice exam",
    "AWS study guide",
    "cloud certification",
    "AWS flashcards",
  ],
  authors: [{ name: "AWS Study Pal" }],
  openGraph: {
    title: "AWS Study Pal — SAA-C03 Exam Prep",
    description:
      "330 practice questions · 120 flashcards · 84 service references. Free AWS SAA-C03 exam prep that actually works.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Study Pal — SAA-C03 Exam Prep",
    description:
      "330 practice questions · 120 flashcards · 84 service references. Free AWS SAA-C03 exam prep.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
