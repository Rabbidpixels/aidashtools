'use client'

import { Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const scrollToCategory = (slug: string) => {
    const element = document.getElementById(slug)
    if (element) {
      const offset = 100 // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav aria-label="Tool categories" className="bg-card border-b border-border sticky top-[73px] z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => scrollToCategory(category.slug)}
              className="bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
