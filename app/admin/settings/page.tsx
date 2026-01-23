'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateSettings } from '@/app/actions/revalidate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    footer_copyright: '',
    footer_disclosure: '',
    footer_tiktok_url: '',
    footer_facebook_url: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)

    const { data, error } = await createClient()
      .from('settings')
      .select('*')
      .in('key', ['footer_copyright', 'footer_disclosure', 'footer_tiktok_url', 'footer_facebook_url'])

    if (error) {
      console.error('Error fetching settings:', error)
    } else {
      const settings: Record<string, string> = {}
      data?.forEach((setting: any) => {
        settings[setting.key] = setting.value || ''
      })
      setFormData({
        footer_copyright: settings.footer_copyright || '',
        footer_disclosure: settings.footer_disclosure || '',
        footer_tiktok_url: settings.footer_tiktok_url || '',
        footer_facebook_url: settings.footer_facebook_url || '',
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const settings = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
      }))

      const result = await updateSettings(settings)

      if (!result.success) {
        console.error('Error updating settings:', 'error' in result ? result.error : 'Unknown error')
        alert('Failed to save settings: ' + ('error' in result ? result.error : ''))
      } else {
        alert('Settings saved successfully!')
      }
    } catch (err) {
      console.error('Exception saving settings:', err)
      alert('An error occurred while saving settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your site-wide settings and footer content</p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Footer Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Customize the footer content displayed on your public site
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer_copyright">Copyright Text</Label>
                <Input
                  id="footer_copyright"
                  value={formData.footer_copyright}
                  onChange={(e) => setFormData({ ...formData, footer_copyright: e.target.value })}
                  placeholder="© 2025 AI Dashboard. Site created by..."
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  The copyright notice displayed at the bottom of the footer
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_disclosure">Affiliate Disclosure</Label>
                <Textarea
                  id="footer_disclosure"
                  value={formData.footer_disclosure}
                  onChange={(e) => setFormData({ ...formData, footer_disclosure: e.target.value })}
                  placeholder="Some links on this website are affiliate links..."
                  rows={4}
                  disabled={saving}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Full disclosure text about affiliate links
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_tiktok_url">TikTok URL</Label>
                <Input
                  id="footer_tiktok_url"
                  type="url"
                  value={formData.footer_tiktok_url}
                  onChange={(e) => setFormData({ ...formData, footer_tiktok_url: e.target.value })}
                  placeholder="https://www.tiktok.com/@your_username"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_facebook_url">Facebook URL</Label>
                <Input
                  id="footer_facebook_url"
                  type="url"
                  value={formData.footer_facebook_url}
                  onChange={(e) => setFormData({ ...formData, footer_facebook_url: e.target.value })}
                  placeholder="https://www.facebook.com/your_page"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
