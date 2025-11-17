'use client'

import { useState } from 'react'

interface CacheStats {
  total_entries: number
  by_endpoint: Array<{
    endpoint: string
    count: number
  }>
  recent_cache: Array<{
    endpoint: string
    updated_at: string
    ttl_seconds: number
    age_seconds: number
  }>
}

export default function CacheManagerCard() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [message, setMessage] = useState('')

  const warmCache = async (type: 'all' | 'popular' | 'searches' | 'origin') => {
    setLoading(true)
    setMessage('')
    
    try {
      const url = `/api/admin/cache/warm?type=${type}`
      const res = await fetch(url, { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setMessage(`✅ ${data.message} (${data.duration_ms}ms)`)
        // Refresh stats
        loadStats()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Failed to warm cache: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/cache/warm')
      const data = await res.json()
      
      if (data.success) {
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('Failed to load cache stats:', error)
    }
  }

  const clearOldCache = async () => {
    if (!confirm('Clear cache entries older than 60 days?')) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cache/clear', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setMessage(`✅ Cleared ${data.deleted_count} old cache entries`)
        loadStats()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Failed to clear cache: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">⚡ RajaOngkir Cache Manager</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-gray-600">
            Pre-warm cache untuk mengurangi API calls dan mempercepat response time
          </p>
        </div>

        {/* Cache Warming Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Warm Cache</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => warmCache('all')}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : '🔥 Warm All Essential Cache'}
            </button>

            <button
              onClick={() => warmCache('popular')}
              disabled={loading}
              className="w-full px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🏙️ Warm Popular Cities
            </button>

            <button
              onClick={() => warmCache('searches')}
              disabled={loading}
              className="w-full px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Warm Popular Searches
            </button>

            <button
              onClick={loadStats}
              disabled={loading}
              className="w-full px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Refresh Stats
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Cache Statistics */}
        {stats && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Cache Statistics</h3>
            
            {/* Total Entries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Total Cache Entries</div>
                <div className="text-2xl font-bold text-blue-900">{stats.total_entries}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Unique Endpoints</div>
                <div className="text-2xl font-bold text-purple-900">{stats.by_endpoint.length}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">API Calls Saved</div>
                <div className="text-2xl font-bold text-green-900">~{stats.total_entries * 0.8 | 0}</div>
              </div>
            </div>

            {/* By Endpoint */}
            <div>
              <h4 className="font-medium mb-2">Cache by Endpoint</h4>
              <div className="space-y-2">
                {stats.by_endpoint.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                    <span className="text-sm font-mono text-gray-700">{item.endpoint}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count} entries</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Cache */}
            <div>
              <h4 className="font-medium mb-2">Recent Cache Activity</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.recent_cache.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded border text-sm">
                    <div className="flex-1">
                      <div className="font-mono text-gray-700">{item.endpoint}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        TTL: {item.ttl_seconds}s | Age: {item.age_seconds}s
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.updated_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Old Cache */}
            <div className="pt-4 border-t">
              <button
                onClick={clearOldCache}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Clear Cache Older Than 60 Days
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Cache Strategy</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Provinsi/Kota: 30 hari (data statis)</li>
            <li>• Search Results: 7 hari (pencarian sering diulang)</li>
            <li>• Shipping Cost: 1 jam (harga dinamis)</li>
            <li>• Stale-while-revalidate: Update di background</li>
            <li>• Stale-on-error: Fallback jika API down</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
