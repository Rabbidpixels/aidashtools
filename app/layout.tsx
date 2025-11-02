import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'AidashTools - Discover the Best AI Tools',
  description: 'A curated directory of powerful AI tools to boost your productivity and creativity. Find and explore the best AI tools for your projects.',
  keywords: ['AI tools', 'artificial intelligence', 'productivity', 'AI directory', 'machine learning'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
