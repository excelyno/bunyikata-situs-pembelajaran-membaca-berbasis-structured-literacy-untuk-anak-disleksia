import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const openDyslexic = localFont({
  src: [
    {
      path: "./font/OpenDyslexic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/OpenDyslexic-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./font/OpenDyslexic-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./font/OpenDyslexic-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-dyslexic",
});

export const metadata: Metadata = {
  title: "BunyiKata - Terapi Disleksia",
  description: "Aplikasi terapi disleksia interaktif untuk anak-anak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${openDyslexic.variable} h-full antialiased`}
    >
      <body className={`${openDyslexic.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
