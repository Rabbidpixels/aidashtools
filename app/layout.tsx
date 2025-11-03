import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://aidashtools.com'),
  title: {
    default: 'AidashTools - Discover the Best AI Tools Directory',
    template: '%s | AidashTools'
  },
  description: 'Discover the most powerful AI tools for chatbots, image generation, video creation, music production, programming, web design, and data analytics. Your ultimate AI tools directory.',
  keywords: [
    'AI tools',
    'artificial intelligence',
    'AI directory',
    'chatbot AI',
    'AI image generation',
    'AI video creation',
    'AI music production',
    'AI programming tools',
    'machine learning tools',
    'productivity tools',
    'AI web design',
    'data analytics AI'
  ],
  authors: [{ name: 'AidashTools' }],
  creator: 'AidashTools',
  publisher: 'AidashTools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aidashtools.com',
    title: 'AidashTools - Discover the Best AI Tools Directory',
    description: 'Discover the most powerful AI tools for chatbots, image generation, video creation, music production, programming, web design, and data analytics.',
    siteName: 'AidashTools',
    images: [
      {
        url: '/robot.png',
        width: 400,
        height: 400,
        alt: 'AidashTools AI Robot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AidashTools - Discover the Best AI Tools Directory',
    description: 'Discover the most powerful AI tools for chatbots, image generation, video creation, and more.',
    images: ['/robot.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
