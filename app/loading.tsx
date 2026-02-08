export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="bg-card border-b border-border py-5">
        <div className="container mx-auto px-4">
          <div className="h-9 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="space-y-8">
            <div className="h-10 w-96 bg-muted rounded animate-pulse" />
            <div className="h-5 w-full max-w-2xl bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
