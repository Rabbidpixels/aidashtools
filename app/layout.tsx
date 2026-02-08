import type { Metadata } from 'next';
import Script from 'next/script'
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
  alternates: {
    canonical: 'https://aidashtools.com',
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
        url: 'https://aidashtools.com/robot.png',
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
    images: [{ url: 'https://aidashtools.com/robot.png', alt: 'AidashTools AI Robot' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none">
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7675327870485351"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <JsonLd />
      </body>
    </html>
  );
}

function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://aidashtools.com/#website',
        url: 'https://aidashtools.com',
        name: 'AidashTools',
        description: 'Discover the most powerful AI tools for chatbots, image generation, video creation, music production, programming, web design, and data analytics.',
        publisher: { '@id': 'https://aidashtools.com/#organization' },
      },
      {
        '@type': 'Organization',
        '@id': 'https://aidashtools.com/#organization',
        name: 'AidashTools',
        url: 'https://aidashtools.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://aidashtools.com/robot.png',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
