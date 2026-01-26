'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="h-9 px-3 gap-2" disabled>
        <Moon className="h-5 w-5" />
        <span className="text-sm font-medium">Dark | Light</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      className="h-9 px-3 gap-2"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">Dark | Light</span>
    </Button>
  )
}
