'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    featured: false,
    visible: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await createClient()
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setFormData({ name: '', description: '', featured: false, visible: true })
    setFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      featured: category.featured,
      visible: category.visible ?? true,
    })
    setFormOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCategory) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories?id=${selectedCategory.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (!result.success) {
        console.error('Error deleting category:', result.error)
        alert('Failed to delete category')
      } else {
        await fetchCategories()
        setDeleteDialogOpen(false)
        setSelectedCategory(null)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const categoryData = {
      name: formData.name,
      description: formData.description || null,
      featured: formData.featured,
      visible: formData.visible,
    }

    try {
      if (selectedCategory) {
        // Update existing category
        const response = await fetch('/api/categories', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedCategory.id,
            ...categoryData,
          }),
        })
        const result = await response.json()

        if (!result.success) {
          console.error('Error updating category:', result.error)
          alert('Failed to update category')
        } else {
          await fetchCategories()
          setFormOpen(false)
        }
      } else {
        // Create new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        })
        const result = await response.json()

        if (!result.success) {
          console.error('Error creating category:', result.error)
          alert('Failed to create category. ' + (result.error || ''))
        } else {
          await fetchCategories()
          setFormOpen(false)
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
    setIsSubmitting(false)
  }

  const toggleFeatured = async (category: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, field: 'featured', value: !category.featured })
      })
      const result = await res.json()

      if (!result.success) {
        console.error('Error updating featured status:', result.error)
        alert('Failed to update featured status')
      } else {
        await fetchCategories()
      }
    } catch (err) {
      console.error('Error updating featured status:', err)
      alert('Failed to update featured status')
    }
  }

  const toggleVisible = async (category: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, field: 'visible', value: !category.visible })
      })
      const result = await res.json()

      if (!result.success) {
        console.error('Error updating visibility status:', result.error)
        alert('Failed to update visibility status')
      } else {
        await fetchCategories()
      }
    } catch (err) {
      console.error('Error updating visibility status:', err)
      alert('Failed to update visibility status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your tool categories</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No categories yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Visible</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Featured</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{category.name}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {category.description || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={category.visible ?? true}
                          onCheckedChange={() => toggleVisible(category)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={category.featured}
                          onCheckedChange={() => toggleFeatured(category)}
                        />
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? 'Update the category details below'
                : 'Add a new category to organize your tools'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                disabled={isSubmitting}
              />
              <Label htmlFor="visible">Visible on site</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                disabled={isSubmitting}
              />
              <Label htmlFor="featured">Featured</Label>
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
                {isSubmitting ? 'Saving...' : selectedCategory ? 'Update' : 'Create'}
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
        itemName={selectedCategory?.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}
