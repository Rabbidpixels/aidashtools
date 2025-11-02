'use client'

import { Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const scrollToCategory = (categoryName: string) => {
    const id = categoryName.toLowerCase().replace(/\s+/g, '-')
    const element = document.getElementById(id)
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
    <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => scrollToCategory(category.name)}
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
