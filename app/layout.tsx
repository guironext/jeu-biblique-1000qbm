import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/app/ui/motion-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1000 QBM+",
  description:
    "Jeu biblique de questions à choix unique, organisé en stages et en sections.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
