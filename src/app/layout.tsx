import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import cn from "@/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ICO Maker",
  description: "Create and View ICO's with Ease",
  authors: {
    name: "Ethan Pollack",
    url: "https://epoll31.com",
  },
  keywords: [
    "ICO",
    "Icon",
    "Image",
    "Maker",
    "Generator",
    "Converter",
    "ico",
    "Ico",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-100")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
