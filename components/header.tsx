import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Logo - Replace logo.svg in public folder with your own */}
          <div className="relative w-10 h-10">
            <Image
              src="/logo.svg"
              alt="AidashTools"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AidashTools</h1>
            <p className="text-xs text-muted-foreground">AI Tools Directory</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
