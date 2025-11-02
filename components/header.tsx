import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  showAdminLink?: boolean
}

export function Header({ showAdminLink = false }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-foreground hover:opacity-90 transition-opacity">
            AI <span className="text-primary">Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {showAdminLink && (
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
