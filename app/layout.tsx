import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VibeCode - Personal Productivity Tracker",
  description: "Track your goals, actions, and daily progress to achieve your ambitions",
};

import WorkspaceLayout from "@/components/WorkspaceLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-primary))] selection:bg-[hsl(var(--primary))]/20`}>
        <WorkspaceLayout>{children}</WorkspaceLayout>
      </body>
    </html>
  );
}
