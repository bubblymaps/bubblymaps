import "@/styles/globals.css";

import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Bubbly Maps - Find water fountains near you",
  description: "The open source water fountain locator. Find bubblers near you. Open Code, Open Data.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" suppressHydrationWarning> 
        <body className={GeistSans.className}> 
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <Toaster position="top-center"/>
            <SessionProvider>{children}</SessionProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}
