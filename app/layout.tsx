import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/UI/shadcn/toaster";
import { useEffect, useState } from "react";
// import ThemeSwitcher from './components/themeSwitcher';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "factory",
  description: "(주)다성",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="dasung-theme">
            {children}
          </ThemeProvider>
          <Toaster />
        </PrimeReactProvider>
      </body>
    </html>
  );
}
