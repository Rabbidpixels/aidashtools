import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  // Fetch footer settings
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('*')
    .in('key', ['footer_copyright', 'footer_disclosure', 'footer_tiktok_url', 'footer_facebook_url'])

  const settingsMap: Record<string, string> = {}
  settings?.forEach((setting: any) => {
    settingsMap[setting.key] = setting.value || ''
  })

  const copyright = settingsMap.footer_copyright || `© ${currentYear} AI Dashboard. Site created by RabbidPixelsLLC. All rights reserved.`
  const disclosure = settingsMap.footer_disclosure || 'Some links on this website are affiliate links. This means we may earn a commission if you click on the link and make a purchase, at no additional cost to you.'
  const tiktokUrl = settingsMap.footer_tiktok_url || 'https://www.tiktok.com/@YOUR_TIKTOK_USERNAME'
  const facebookUrl = settingsMap.footer_facebook_url || 'https://www.facebook.com/YOUR_FACEBOOK_PAGE'

  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Social Links */}
          <div className="flex justify-center items-center gap-5 mb-6 flex-wrap">
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground font-semibold px-5 py-2.5 bg-secondary border-2 border-border rounded-full transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span>TikTok</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground font-semibold px-5 py-2.5 bg-secondary border-2 border-border rounded-full transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-5">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              Terms of Service
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">•</span>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">•</span>
            <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              Disclaimer
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">•</span>
            <Link href="/affiliate-disclosure" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              Affiliate Disclosure
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">•</span>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              Contact Us
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">•</span>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:underline transition">
              About Us
            </Link>
          </div>

          {/* Disclosure */}
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            <strong>Disclosure:</strong> {disclosure}
          </p>

          {/* Copyright */}
          <p className="text-sm font-semibold text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
