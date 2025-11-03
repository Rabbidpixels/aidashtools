'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tool } from '@/lib/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart3, Wrench } from 'lucide-react'

interface ToolAnalytics {
  tool: Tool
  clickCount: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ToolAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyClicks, setDailyClicks] = useState(0)
  const [monthlyClicks, setMonthlyClicks] = useState(0)
  const [yearlyClicks, setYearlyClicks] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)

    // Fetch all categories
    const { data: categories } = await createClient()
      .from('categories')
      .select('*')

    // Fetch all tools
    const { data: tools } = await createClient()
      .from('tools')
      .select('*')
      .order('name')

    // Fetch all clicks with timestamps
    const { data: clicks } = await createClient()
      .from('tool_clicks')
      .select('tool_id, clicked_at')

    if (!tools || !clicks) {
      setLoading(false)
      return
    }

    // Calculate time periods
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisYear = new Date(now.getFullYear(), 0, 1)

    // Create category map
    const categoryMap: Record<string, string> = {}
    categories?.forEach((category: any) => {
      categoryMap[category.id] = category.name
    })

    // Count clicks per tool and by time period
    const clickCounts: Record<string, number> = {}
    let dailyCount = 0
    let monthlyCount = 0
    let yearlyCount = 0

    clicks.forEach((click: any) => {
      const clickDate = new Date(click.clicked_at)
      clickCounts[click.tool_id] = (clickCounts[click.tool_id] || 0) + 1

      if (clickDate >= today) dailyCount++
      if (clickDate >= thisMonth) monthlyCount++
      if (clickDate >= thisYear) yearlyCount++
    })

    // Combine tools with their click counts
    const analyticsData: ToolAnalytics[] = (tools as Tool[]).map((tool) => ({
      tool: {
        ...tool,
        categoryName: categoryMap[tool.category_id] || 'Unknown',
      } as any,
      clickCount: clickCounts[tool.id] || 0,
    }))

    // Sort by click count (descending)
    analyticsData.sort((a, b) => b.clickCount - a.clickCount)

    setAnalytics(analyticsData)
    setDailyClicks(dailyCount)
    setMonthlyClicks(monthlyCount)
    setYearlyClicks(yearlyCount)
    setTotalClicks(clicks.length)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track how users interact with your tools</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Clicks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{dailyClicks.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Clicks today</p>
          </div>
        </div>

        {/* Monthly Clicks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{monthlyClicks.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Clicks this month</p>
          </div>
        </div>

        {/* Yearly Clicks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Year</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{yearlyClicks.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Clicks this year</p>
          </div>
        </div>

        {/* Lifetime Clicks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lifetime</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalClicks.toLocaleString()}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">All-time clicks</p>
          </div>
        </div>
      </div>

      {/* Analytics Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tool Performance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click statistics for each tool</p>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">Loading analytics...</p>
          ) : analytics.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              No tools yet. Add some tools to see analytics.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tool Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Clicks</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item, index) => (
                    <tr key={item.tool.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{item.tool.name}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {(item.tool as any).categoryName || 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{item.clickCount}</span>
                      </td>
                      <td className="py-4 px-4">
                        {item.tool.featured ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            Featured
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
