import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppShell } from "@/components/lite/app-shell";
import { HomeProvider } from "@/components/lite/home-provider";
import { home } from "@/data/home";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: home.name, template: `%s · ${home.name}` },
  description: "A free smart home dashboard built with Thock UI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <HomeProvider>
            <AppShell>{children}</AppShell>
          </HomeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
