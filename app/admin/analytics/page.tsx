'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tool } from '@/lib/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3 } from 'lucide-react'

interface ToolAnalytics {
  tool: Tool
  clickCount: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ToolAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)

    // Fetch all tools
    const { data: tools } = await createClient()
      .from('tools')
      .select('*')
      .order('name')

    // Fetch all clicks grouped by tool_id
    const { data: clicks } = await createClient()
      .from('tool_clicks')
      .select('tool_id')

    if (!tools || !clicks) {
      setLoading(false)
      return
    }

    // Count clicks per tool
    const clickCounts: Record<string, number> = {}
    clicks.forEach((click: any) => {
      clickCounts[click.tool_id] = (clickCounts[click.tool_id] || 0) + 1
    })

    // Combine tools with their click counts
    const analyticsData: ToolAnalytics[] = (tools as Tool[]).map((tool) => ({
      tool,
      clickCount: clickCounts[tool.id] || 0,
    }))

    // Sort by click count (descending)
    analyticsData.sort((a, b) => b.clickCount - a.clickCount)

    setAnalytics(analyticsData)
    setTotalClicks(clicks.length)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track how users interact with your tools</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">All-time tool clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
            <p className="text-xs text-muted-foreground">Tools being tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {analytics[0]?.tool.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics[0]?.clickCount || 0} clicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tool Performance</CardTitle>
          <CardDescription>Click statistics for each tool</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading analytics...</p>
          ) : analytics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tools yet. Add some tools to see analytics.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Tool Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Clicks</TableHead>
                  <TableHead>Featured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.map((item, index) => (
                  <TableRow key={item.tool.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.tool.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.tool.category_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{item.clickCount}</span>
                    </TableCell>
                    <TableCell>
                      {item.tool.featured ? (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
