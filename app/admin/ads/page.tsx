'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Ad } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    location: '',
    code_snippet: '',
    active: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    setLoading(true)
    const { data, error } = await createClient()
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ads:', error)
    } else {
      setAds(data || [])
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setSelectedAd(null)
    setFormData({ location: '', code_snippet: '', active: false })
    setFormOpen(true)
  }

  const handleEdit = (ad: Ad) => {
    setSelectedAd(ad)
    setFormData({
      location: ad.location,
      code_snippet: ad.code_snippet || '',
      active: ad.active,
    })
    setFormOpen(true)
  }

  const handleDelete = (ad: Ad) => {
    setSelectedAd(ad)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedAd) return

    setIsDeleting(true)
    const { error } = await createClient()
      .from('ads')
      .delete()
      .eq('id', selectedAd.id)

    if (error) {
      console.error('Error deleting ad:', error)
      alert('Failed to delete ad')
    } else {
      await fetchAds()
      setDeleteDialogOpen(false)
      setSelectedAd(null)
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const adData = {
      location: formData.location,
      code_snippet: formData.code_snippet || null,
      active: formData.active,
    }

    if (selectedAd) {
      // Update existing ad
      const { error } = await createClient()
        .from('ads')
        // @ts-expect-error - Type issue with Supabase client in client component
        .update(adData)
        .eq('id', selectedAd.id)

      if (error) {
        console.error('Error updating ad:', error)
        alert('Failed to update ad')
      } else {
        await fetchAds()
        setFormOpen(false)
      }
    } else {
      // Create new ad
      const { error } = await createClient()
        .from('ads')
        // @ts-expect-error - Type issue with Supabase client in client component
        .insert(adData)

      if (error) {
        console.error('Error creating ad:', error)
        alert('Failed to create ad')
      } else {
        await fetchAds()
        setFormOpen(false)
      }
    }
    setIsSubmitting(false)
  }

  const toggleActive = async (ad: Ad) => {
    const { error } = await createClient()
      .from('ads')
      // @ts-expect-error - Type issue with Supabase client in client component
      .update({ active: !ad.active })
      .eq('id', ad.id)

    if (error) {
      console.error('Error updating active status:', error)
      alert('Failed to update active status')
    } else {
      await fetchAds()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your advertisement placements</p>
        </div>
        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Ad
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</p>
          ) : ads.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No ads yet. Create your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Code Snippet</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Active</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{ad.location}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {ad.code_snippet ? ad.code_snippet.substring(0, 50) + '...' : '-'}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={ad.active}
                          onCheckedChange={() => toggleActive(ad)}
                        />
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ad)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ad)}
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
              {selectedAd ? 'Edit Ad' : 'Create Ad'}
            </DialogTitle>
            <DialogDescription>
              {selectedAd
                ? 'Update the ad placement details below'
                : 'Add a new ad placement'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a location...</option>
                <option value="header">Header (Top of page)</option>
                <option value="left-skyscraper">Left Skyscraper (Sidebar left)</option>
                <option value="right-skyscraper">Right Skyscraper (Sidebar right)</option>
                <option value="category-banner">Category Banner (Between categories)</option>
                <option value="footer">Footer (Bottom of page)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Choose where this ad should appear on your site
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code_snippet">Code Snippet</Label>
              <textarea
                id="code_snippet"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.code_snippet}
                onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
                placeholder="Paste your ad code here (e.g., Google AdSense, banner HTML)"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                disabled={isSubmitting}
              />
              <Label htmlFor="active">Active</Label>
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
                {isSubmitting ? 'Saving...' : selectedAd ? 'Update' : 'Create'}
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
        itemName={selectedAd?.location}
        isDeleting={isDeleting}
      />
    </div>
  )
}
