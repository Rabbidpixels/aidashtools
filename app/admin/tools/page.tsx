'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tool, Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    info_link: '',
    category_id: '',
    featured: false,
    visible: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    // Fetch categories
    const { data: categoriesData } = await createClient()
      .from('categories')
      .select('*')
      .order('name')

    setCategories((categoriesData || []) as Category[])

    // Fetch tools - featured first, then by display_order
    const { data: toolsData, error } = await createClient()
      .from('tools')
      .select('*')
      .order('category_id')
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tools:', error)
    } else {
      setTools((toolsData || []) as Tool[])
    }
    setLoading(false)
  }

  // Group tools by category
  const toolsByCategory = categories.map(category => ({
    category,
    tools: tools.filter(t => t.category_id === category.id)
  })).filter(group => group.tools.length > 0)

  const handleCreate = () => {
    setSelectedTool(null)
    setFormData({ name: '', description: '', link: '', info_link: '', category_id: '', featured: false, visible: true })
    setFormOpen(true)
  }

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool)
    setFormData({
      name: tool.name,
      description: tool.description || '',
      link: tool.link || '',
      info_link: tool.info_link || '',
      category_id: tool.category_id,
      featured: tool.featured,
      visible: tool.visible,
    })
    setFormOpen(true)
  }

  const handleDelete = (tool: Tool) => {
    setSelectedTool(tool)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTool) return

    setIsDeleting(true)
    const { error } = await createClient()
      .from('tools')
      .delete()
      .eq('id', selectedTool.id)

    if (error) {
      console.error('Error deleting tool:', error)
      alert('Failed to delete tool')
    } else {
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedTool(null)
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const toolData = {
      name: formData.name,
      description: formData.description || null,
      link: formData.link || null,
      info_link: formData.info_link || null,
      category_id: formData.category_id,
      featured: formData.featured,
      visible: formData.visible,
    }

    if (selectedTool) {
      // Update existing tool
      const { error } = await createClient()
        .from('tools')
        // @ts-expect-error - Type issue with Supabase client
        .update(toolData)
        .eq('id', selectedTool.id)

      if (error) {
        console.error('Error updating tool:', error)
        alert('Failed to update tool')
      } else {
        await fetchData()
        setFormOpen(false)
      }
    } else {
      // Create new tool - get max display_order for category
      const categoryTools = tools.filter(t => t.category_id === formData.category_id)
      const maxOrder = categoryTools.length > 0
        ? Math.max(...categoryTools.map(t => t.display_order || 0))
        : 0

      const { error } = await createClient()
        .from('tools')
        // @ts-expect-error - Type issue with Supabase client
        .insert({ ...toolData, display_order: maxOrder + 1 })

      if (error) {
        console.error('Error creating tool:', error)
        alert('Failed to create tool')
      } else {
        await fetchData()
        setFormOpen(false)
      }
    }
    setIsSubmitting(false)
  }

  const toggleFeatured = async (tool: Tool) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tool.id, field: 'featured', value: !tool.featured })
      })
      const result = await res.json()

      if (!result.success) {
        console.error('Error updating featured status:', result.error)
        alert('Failed to update featured status')
      } else {
        await fetchData()
      }
    } catch (err) {
      console.error('Error updating featured status:', err)
      alert('Failed to update featured status')
    }
  }

  const toggleVisible = async (tool: Tool) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tool.id, field: 'visible', value: !tool.visible })
      })
      const result = await res.json()

      if (!result.success) {
        console.error('Error updating visibility status:', result.error)
        alert('Failed to update visibility status')
      } else {
        await fetchData()
      }
    } catch (err) {
      console.error('Error updating visibility status:', err)
      alert('Failed to update visibility status')
    }
  }

  const moveToolOrder = async (tool: Tool, direction: 'up' | 'down') => {
    const categoryTools = tools.filter(t => t.category_id === tool.category_id)
    const currentIndex = categoryTools.findIndex(t => t.id === tool.id)

    if (currentIndex === -1) return
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === categoryTools.length - 1) return

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapTool = categoryTools[swapIndex]

    // Swap display_order values
    const { error: error1 } = await createClient()
      .from('tools')
      // @ts-expect-error - Type issue with Supabase client
      .update({ display_order: swapTool.display_order })
      .eq('id', tool.id)

    const { error: error2 } = await createClient()
      .from('tools')
      // @ts-expect-error - Type issue with Supabase client
      .update({ display_order: tool.display_order })
      .eq('id', swapTool.id)

    if (error1 || error2) {
      console.error('Error reordering tools:', error1 || error2)
      alert('Failed to reorder tools')
    } else {
      await fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tools</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your AI tools by category</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</p>
        </div>
      ) : tools.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">No tools yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {toolsByCategory.map(({ category, tools: categoryTools }) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {categoryTools.map((tool, index) => (
                    <div
                      key={tool.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveToolOrder(tool, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveToolOrder(tool, 'down')}
                          disabled={index === categoryTools.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Tool info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                          {tool.featured && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                              ⭐ Featured
                            </span>
                          )}
                          {!tool.visible && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              Hidden
                            </span>
                          )}
                        </div>
                        {tool.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{tool.description}</p>
                        )}
                        {tool.link && (
                          <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
                          >
                            {tool.link}
                          </a>
                        )}
                      </div>

                      {/* Visible toggle */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`visible-${tool.id}`} className="text-xs">Visible</Label>
                        <Switch
                          id={`visible-${tool.id}`}
                          checked={tool.visible}
                          onCheckedChange={() => toggleVisible(tool)}
                        />
                      </div>

                      {/* Featured toggle */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`featured-${tool.id}`} className="text-xs">Featured</Label>
                        <Switch
                          id={`featured-${tool.id}`}
                          checked={tool.featured}
                          onCheckedChange={() => toggleFeatured(tool)}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tool)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tool)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTool ? 'Edit Tool' : 'Create Tool'}
            </DialogTitle>
            <DialogDescription>
              {selectedTool
                ? 'Update the tool details below'
                : 'Add a new tool to your directory'}
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
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Tool Link (external)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                The external URL where users can try the tool
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="info_link">More Info Link (internal)</Label>
              <Input
                id="info_link"
                value={formData.info_link}
                onChange={(e) => setFormData({ ...formData, info_link: e.target.value })}
                placeholder="/tool-slug/about"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Optional internal link for the &quot;More Info&quot; button. Leave empty to use auto-generated tool page link.
              </p>
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
                {isSubmitting ? 'Saving...' : selectedTool ? 'Update' : 'Create'}
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
        itemName={selectedTool?.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}
