'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createToolPage, updateToolPage, deleteToolPage } from '@/app/actions/revalidate'
import type { ToolPage, Tool } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react'

interface ToolPageWithTool extends ToolPage {
  tool?: Tool
}

export default function ToolPagesPage() {
  const [pages, setPages] = useState<ToolPageWithTool[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<ToolPageWithTool | null>(null)
  const [formData, setFormData] = useState({
    tool_id: '',
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

    // Fetch tools for dropdown
    const { data: toolsData } = await createClient()
      .from('tools')
      .select('*')
      .order('name')

    setTools((toolsData || []) as Tool[])

    // Fetch tool pages
    const { data: pagesData, error } = await createClient()
      .from('tool_pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tool pages:', error)
    } else {
      // Join with tools data
      const pagesWithTools = (pagesData || []).map((page: ToolPage) => ({
        ...page,
        tool: (toolsData || []).find((t: Tool) => t.id === page.tool_id)
      }))
      setPages(pagesWithTools)
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setSelectedPage(null)
    setFormData({ tool_id: '', slug: '', title: '', content: '' })
    setFormOpen(true)
  }

  const handleEdit = (page: ToolPageWithTool) => {
    setSelectedPage(page)
    setFormData({
      tool_id: page.tool_id,
      slug: page.slug,
      title: page.title,
      content: page.content,
    })
    setFormOpen(true)
  }

  const handleDelete = (page: ToolPageWithTool) => {
    setSelectedPage(page)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPage) return

    setIsDeleting(true)
    const result = await deleteToolPage(selectedPage.id)

    if (!result.success) {
      console.error('Error deleting tool page:', result.error)
      alert('Failed to delete tool page')
    } else {
      await fetchData()
      setDeleteDialogOpen(false)
      setSelectedPage(null)
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (selectedPage) {
      // Update existing page
      const result = await updateToolPage(selectedPage.id, formData.slug, formData)

      if (!result.success) {
        console.error('Error updating tool page:', result.error)
        alert('Failed to update tool page')
      } else {
        await fetchData()
        setFormOpen(false)
      }
    } else {
      // Create new page
      const result = await createToolPage(formData)

      if (!result.success) {
        console.error('Error creating tool page:', result.error)
        alert('Failed to create tool page. ' + (result.error || ''))
      } else {
        await fetchData()
        setFormOpen(false)
      }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Tool Pages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create detailed pages for individual tools (URL: /tool/slug)</p>
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
          ) : pages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No tool pages yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Page Title</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Assigned Tool</th>
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
                        {page.tool?.name || 'Unknown Tool'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        <a
                          href={`/tool/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                        >
                          /tool/{page.slug}
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
              {selectedPage ? 'Edit Tool Page' : 'Create Tool Page'}
            </DialogTitle>
            <DialogDescription>
              {selectedPage
                ? 'Update the tool page details below'
                : 'Create a new about page for a tool'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tool">Assign to Tool *</Label>
              <select
                id="tool"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.tool_id}
                onChange={(e) => setFormData({ ...formData, tool_id: e.target.value })}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a tool</option>
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
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
                placeholder="What is ChatGPT?"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/tool/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  placeholder="what-is-chatgpt"
                  required
                  disabled={isSubmitting}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be the URL path for the page: /tool/{formData.slug || 'your-slug'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Page Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write detailed content about this tool..."
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
