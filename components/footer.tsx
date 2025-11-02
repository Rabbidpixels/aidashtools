export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} AidashTools. All rights reserved.</p>
          <p className="mt-2">
            Discover and explore the best AI tools for your projects.
          </p>
        </div>
      </div>
    </footer>
  )
}
