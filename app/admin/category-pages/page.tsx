'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CategoryPage, Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react'

interface CategoryPageWithCategory extends CategoryPage {
  category?: Category
}

export default function CategoryPagesPage() {
  const [pages, setPages] = useState<CategoryPageWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<CategoryPageWithCategory | null>(null)
  const [formData, setFormData] = useState({
    category_id: '',
    slug: '',
    title: '',
    content: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch categories for dropdown
      const { data: categoriesData, error: catError } = await createClient()
        .from('categories')
        .select('*')
        .order('name')

      if (catError) throw new Error('Failed to load categories')
      setCategories((categoriesData || []) as Category[])

      // Fetch category pages
      const { data: pagesData, error: pagesError } = await createClient()
        .from('category_pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (pagesError) throw new Error('Failed to load category pages')

      // Join with categories data
      const pagesWithCategories = (pagesData || []).map((page: CategoryPage) => ({
        ...page,
        category: (categoriesData || []).find((c: Category) => c.id === page.category_id)
      }))
      setPages(pagesWithCategories)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to connect to database. Please check your connection and refresh.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedPage(null)
    setFormData({ category_id: '', slug: '', title: '', content: '' })
    setFormOpen(true)
  }

  const handleEdit = (page: CategoryPageWithCategory) => {
    setSelectedPage(page)
    setFormData({
      category_id: page.category_id,
      slug: page.slug,
      title: page.title,
      content: page.content,
    })
    setFormOpen(true)
  }

  const handleDelete = (page: CategoryPageWithCategory) => {
    setSelectedPage(page)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPage) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/category-pages?id=${selectedPage.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (!result.success) {
        console.error('Error deleting category page:', result.error)
        alert('Failed to delete category page')
      } else {
        await fetchData()
        setDeleteDialogOpen(false)
        setSelectedPage(null)
      }
    } catch (error) {
      console.error('Error deleting category page:', error)
      alert('Failed to delete category page')
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (selectedPage) {
        // Update existing page
        const response = await fetch('/api/category-pages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedPage.id,
            ...formData,
          }),
        })
        const result = await response.json()

        if (!result.success) {
          console.error('Error updating category page:', result.error)
          alert('Failed to update category page')
        } else {
          await fetchData()
          setFormOpen(false)
        }
      } else {
        // Create new page
        const response = await fetch('/api/category-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const result = await response.json()

        if (!result.success) {
          console.error('Error creating category page:', result.error)
          alert('Failed to create category page. ' + (result.error || ''))
        } else {
          await fetchData()
          setFormOpen(false)
        }
      }
    } catch (error) {
      console.error('Error saving category page:', error)
      alert('Failed to save category page')
    }
    setIsSubmitting(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Category Pages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create detailed pages for categories (URL: /{'{category-slug}'}/{'{page-slug}'})</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</p>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline">
                Try Again
              </Button>
            </div>
          ) : pages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No category pages yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Page Title</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Assigned Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">URL</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {page.title}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {page.category?.name || 'Unknown Category'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        <a
                          href={`/${page.category?.slug || 'unknown'}/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                        >
                          /{page.category?.slug || 'unknown'}/{page.slug}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(page)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(page)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? 'Edit Category Page' : 'Create Category Page'}
            </DialogTitle>
            <DialogDescription>
              {selectedPage
                ? 'Update the category page details below'
                : 'Create a new about page for a category'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Assign to Category *</Label>
              <select
                id="category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category_id}
                onChange={(e) => {
                  const selectedCategory = categories.find(c => c.id === e.target.value)
                  if (selectedCategory && !selectedPage) {
                    const categorySlug = selectedCategory.slug || generateSlug(selectedCategory.name)
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                      title: `What is a ${selectedCategory.name}?`,
                      slug: `what-is-a-${categorySlug}`,
                    })
                  } else {
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                }}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: selectedPage ? formData.slug : generateSlug(e.target.value)
                  })
                }}
                placeholder="What is a Chatbot?"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Page Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/{categories.find(c => c.id === formData.category_id)?.slug || '{category-slug}'}/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  placeholder="what-is-a-chatbot"
                  required
                  disabled={isSubmitting}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Full URL: /{categories.find(c => c.id === formData.category_id)?.slug || '{category-slug}'}/{formData.slug || 'your-slug'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Page Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write detailed content about this category..."
                rows={15}
                required
                disabled={isSubmitting}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting for rich content.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : selectedPage ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={selectedPage?.title}
        isDeleting={isDeleting}
      />
    </div>
  )
}
