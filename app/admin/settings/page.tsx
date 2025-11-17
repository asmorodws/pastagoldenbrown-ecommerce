"use client"

import { useState, useEffect } from "react"
import { Settings, Globe, Mail, Bell, Shield, Database, Save, MapPin, Truck, Search } from "lucide-react"
import toast from "react-hot-toast"
import CacheManagerCard from "@/components/admin/CacheManagerCard"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "E-Commerce Store",
    siteUrl: "https://example.com",
    siteDescription: "Toko online terpercaya dengan berbagai produk berkualitas",
    contactEmail: "support@example.com",
    contactPhone: "+62 812-3456-7890",
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    maintenanceMode: false,
  })

  // Shipping origin states
  const [shippingOrigin, setShippingOrigin] = useState({
    cityId: "501", // Actual city ID for shipping calculation
    subdistrictId: "", // Optional: for more accurate origin
    cityName: "Jakarta Timur",
    provinceName: "DKI Jakarta",
  })
  const [loadingOrigin, setLoadingOrigin] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // Client-side cache untuk mengurangi API hits
  const [searchCache, setSearchCache] = useState<Map<string, { data: any[], timestamp: number }>>(new Map())

  useEffect(() => {
    fetchShippingOrigin()
    // Load search cache dari localStorage
    try {
      const cached = localStorage.getItem('admin_city_search_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        setSearchCache(new Map(Object.entries(parsed)))
      }
    } catch (error) {
      console.error('Error loading cache:', error)
    }
  }, [])

  const fetchShippingOrigin = async () => {
    try {
      setLoadingOrigin(true)
      const res = await fetch("/api/admin/settings/shipping-origin")
      if (res.ok) {
        const data = await res.json()
        if (data.originCityId) {
          // Fetch city name from RajaOngkir if needed
          setShippingOrigin(prev => ({
            ...prev,
            cityId: data.originCityId,
          }))
        }
      }
    } catch (error) {
      console.error("Error fetching shipping origin:", error)
    } finally {
      setLoadingOrigin(false)
    }
  }

  const searchCities = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const normalizedQuery = query.toLowerCase().trim()
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 hari
    
    // Check cache first
    const cached = searchCache.get(normalizedQuery)
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      setSearchResults(cached.data)
      setShowSearchResults(true)
      return
    }

    // Try prefix cache filtering
    for (let len = normalizedQuery.length - 1; len >= 3; len--) {
      const prefix = normalizedQuery.slice(0, len)
      const prefixCached = searchCache.get(prefix)
      
      if (prefixCached && (Date.now() - prefixCached.timestamp) < CACHE_TTL) {
        const filtered = prefixCached.data.filter((item: any) => {
          const name = (item.label || item.name || '').toLowerCase()
          return name.includes(normalizedQuery)
        })
        
        if (filtered.length > 0) {
          setSearchResults(filtered)
          setShowSearchResults(true)
          // Cache filtered result
          const newCache = new Map(searchCache)
          newCache.set(normalizedQuery, { data: filtered, timestamp: Date.now() })
          setSearchCache(newCache)
          try {
            localStorage.setItem('admin_city_search_cache', JSON.stringify(Object.fromEntries(newCache)))
          } catch (e) {}
          return
        }
      }
    }

    // Hit API jika tidak ada cache
    try {
      setIsSearching(true)
      const res = await fetch(`/api/rajaongkir/search?q=${encodeURIComponent(normalizedQuery)}&limit=15`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
        setShowSearchResults(true)
        
        // Cache hasil
        const newCache = new Map(searchCache)
        newCache.set(normalizedQuery, { data, timestamp: Date.now() })
        setSearchCache(newCache)
        
        // Save to localStorage (limit 50 entries)
        if (newCache.size > 50) {
          const sorted = Array.from(newCache.entries()).sort((a, b) => b[1].timestamp - a[1].timestamp)
          const trimmed = new Map(sorted.slice(0, 50))
          setSearchCache(trimmed)
          try {
            localStorage.setItem('admin_city_search_cache', JSON.stringify(Object.fromEntries(trimmed)))
          } catch (e) {}
        } else {
          try {
            localStorage.setItem('admin_city_search_cache', JSON.stringify(Object.fromEntries(newCache)))
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error("Error searching cities:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCity = async (city: any) => {
    // Extract city_id from the data
    // Search API returns subdistrict data with city information
    const cityId = city.city_id || city.cityId || city.id
    const subdistrictId = city.id // The full location ID (subdistrict level)
    
    const newOrigin = {
      cityId: cityId.toString(),
      subdistrictId: subdistrictId.toString(),
      cityName: city.city || city.city_name || city.name,
      provinceName: city.province || city.province_name || "",
    }

    setShippingOrigin(newOrigin)
    setSearchQuery("")
    setShowSearchResults(false)
    setSearchResults([])

    // Save immediately
    try {
      const res = await fetch("/api/admin/settings/shipping-origin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCityId: newOrigin.cityId,
          originSubdistrictId: newOrigin.subdistrictId,
          originCityName: `${newOrigin.cityName}, ${newOrigin.provinceName}`,
        }),
      })

      if (res.ok) {
        toast.success("Lokasi pengiriman berhasil diubah. Silakan restart server untuk menerapkan perubahan.")
      } else {
        toast.error("Gagal menyimpan pengaturan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const timer = setTimeout(() => searchCities(searchQuery), 800) // Increased to 800ms
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan")
  }

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-600 mt-1">Kelola pengaturan sistem dan konfigurasi toko</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Globe className="w-5 h-5" />
            <h2 className="text-xl font-bold">Pengaturan Umum</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Situs
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              URL Situs
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleChange("siteUrl", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi Situs
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange("siteDescription", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl font-bold">Informasi Kontak</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Kontak
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Shipping Origin Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Truck className="w-5 h-5" />
            <h2 className="text-xl font-bold">Pengaturan Pengiriman</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Lokasi Asal Pengiriman</p>
                <p className="text-sm text-blue-700">
                  Tentukan kota asal pengiriman untuk kalkulasi ongkir otomatis. 
                  Perubahan akan diterapkan setelah restart server.
                </p>
              </div>
            </div>
          </div>

          {loadingOrigin ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lokasi Toko Saat Ini
                </label>
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-bold text-green-900">
                        {shippingOrigin.cityName}
                        {shippingOrigin.provinceName && `, ${shippingOrigin.provinceName}`}
                      </p>
                      <p className="text-sm text-green-700">
                        City ID: {shippingOrigin.cityId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ubah Lokasi Toko
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    placeholder="Cari kota/kabupaten... (min 3 karakter)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3.5">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-300 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectCity(result)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-slate-900">{result.name}</div>
                          <div className="text-sm text-slate-600">
                            {result.city && `${result.city}, `}
                            {result.province}
                            {result.postal_code && ` - ${result.postal_code}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-sm text-slate-500 mt-2">
                    Ketik minimal 3 karakter untuk mencari
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">⚠️ Penting!</p>
                    <p className="text-sm text-amber-700 mb-2">
                      Setelah mengubah lokasi asal pengiriman, Anda perlu <strong>restart server</strong> agar perubahan diterapkan:
                    </p>
                    <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                      <li>Development: Stop server (Ctrl+C) lalu jalankan <code className="bg-amber-100 px-1 rounded">npm run dev</code> lagi</li>
                      <li>Production: Rebuild dan restart aplikasi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-bold">Notifikasi</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">Notifikasi Email</p>
              <p className="text-sm text-slate-600">Terima notifikasi melalui email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">Notifikasi Pesanan</p>
              <p className="text-sm text-slate-600">Notifikasi saat ada pesanan baru</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => handleChange("orderNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">Alert Stok</p>
              <p className="text-sm text-slate-600">Notifikasi saat stok produk rendah</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stockAlerts}
                onChange={(e) => handleChange("stockAlerts", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-bold">Sistem</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">Mode Maintenance</p>
              <p className="text-sm text-slate-600">Nonaktifkan akses sementara untuk maintenance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Database</p>
                <p className="text-sm text-blue-700">
                  Backup database dilakukan otomatis setiap hari pada pukul 02:00 WIB
                </p>
                <button
                  onClick={() => toast.success("Backup database dimulai")}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Backup Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Manager */}
      <CacheManagerCard />

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Save className="w-5 h-5" />
          Simpan Semua Pengaturan
        </button>
      </div>
    </div>
  )
}
