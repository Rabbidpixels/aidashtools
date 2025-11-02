'use client'

export default function TestEnvPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-card p-8 rounded-lg border">
        <h1 className="text-2xl font-bold mb-6">Environment Variable Test</h1>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-2">NEXT_PUBLIC_SUPABASE_URL:</h2>
            <p className="font-mono text-sm bg-muted p-2 rounded break-all">
              {url || 'MISSING'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type: {typeof url} | Length: {url?.length || 0}
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
            <p className="font-mono text-sm bg-muted p-2 rounded break-all">
              {key ? `${key.substring(0, 50)}...` : 'MISSING'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Type: {typeof key} | Length: {key?.length || 0}
            </p>
          </div>

          <div className="pt-4 border-t">
            <h2 className="font-semibold mb-2">All process.env (NEXT_PUBLIC_*):</h2>
            <pre className="font-mono text-xs bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(
                Object.entries(process.env)
                  .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
                  .reduce((acc, [key, value]) => {
                    acc[key] = value ? `${value.substring(0, 30)}...` : 'undefined'
                    return acc
                  }, {} as Record<string, string>),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
