'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import type { Tool, Category } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface ToolWithCategory extends Tool {
  category?: Category
}

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    category_id: '',
    featured: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    // Fetch categories
    const { data: categoriesData } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name')

    setCategories((categoriesData || []) as Category[])

    // Fetch tools
    const { data: toolsData, error } = await supabaseAdmin
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tools:', error)
    } else {
      // Add category info to tools
      const toolsWithCategories = (toolsData || []).map((tool: any) => ({
        ...tool,
        category: (categoriesData || []).find((cat: any) => cat.id === tool.category_id)
      }))
      setTools(toolsWithCategories as ToolWithCategory[])
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setSelectedTool(null)
    setFormData({ name: '', description: '', link: '', category_id: '', featured: false })
    setFormOpen(true)
  }

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool)
    setFormData({
      name: tool.name,
      description: tool.description || '',
      link: tool.link || '',
      category_id: tool.category_id,
      featured: tool.featured,
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
    const { error } = await supabaseAdmin
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
      category_id: formData.category_id,
      featured: formData.featured,
    }

    if (selectedTool) {
      // Update existing tool
      const { error } = await supabaseAdmin
        .from('tools')
        // @ts-expect-error - Type issue with Supabase client in client component
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
      // Create new tool
      const { error} = await supabaseAdmin
        .from('tools')
        // @ts-expect-error - Type issue with Supabase client in client component
        .insert(toolData)

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
    const { error } = await supabaseAdmin
      .from('tools')
      // @ts-expect-error - Type issue with Supabase client in client component
      .update({ featured: !tool.featured })
      .eq('id', tool.id)

    if (error) {
      console.error('Error updating featured status:', error)
      alert('Failed to update featured status')
    } else {
      await fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-muted-foreground">Manage your AI tools</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : tools.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tools yet. Create your first one!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tool.category?.name || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">
                      {tool.link ? (
                        <a href={tool.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {tool.link}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={tool.featured}
                        onCheckedChange={() => toggleFeatured(tool)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                disabled={isSubmitting}
              />
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
