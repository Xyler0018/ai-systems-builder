import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Systems Builder",
  description: "Learning Operating System for AI systems builders",
  applicationName: "AI Systems Builder",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/robot-head.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/robot-head.svg", type: "image/svg+xml", sizes: "any" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
