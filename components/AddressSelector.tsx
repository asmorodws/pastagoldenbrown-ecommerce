"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { MapPin, Plus, Check, Edit, Trash2, X } from "lucide-react"

interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
  isDefault: boolean
  cityId?: string | null
  provinceId?: string | null
  districtId?: string | null
}

interface AddressFormData {
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
  isDefault: boolean
  cityId: string
  provinceId: string
  districtId: string
}

interface RajaOngkirProvince {
  id: number
  name: string
}

interface RajaOngkirCity {
  id: number
  name: string
  zip_code: string
}

interface RajaOngkirDistrict {
  id: number
  name: string
  zip_code: string
}

interface AddressSelectorProps {
  selectedAddressId?: string
  onSelectAddress: (address: Address) => void
  onAddressChange?: () => void
}

export default function AddressSelector({ selectedAddressId, onSelectAddress, onAddressChange }: AddressSelectorProps) {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    recipientName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    country: "Indonesia",
    isDefault: false,
    cityId: "",
    provinceId: "",
    districtId: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [rajaOngkirAvailable, setRajaOngkirAvailable] = useState(true)
  
  // Client-side cache untuk search results (mengurangi API calls)
  const [searchCache, setSearchCache] = useState<Map<string, { data: any[], timestamp: number }>>(new Map())
  
  // Cascade dropdown states
  const [useDropdowns, setUseDropdowns] = useState(true)
  const [provinces, setProvinces] = useState<RajaOngkirProvince[]>([])
  const [cities, setCities] = useState<RajaOngkirCity[]>([])
  const [districts, setDistricts] = useState<RajaOngkirDistrict[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)

  useEffect(() => {
    fetchAddresses()
    checkRajaOngkirAvailability()
    if (useDropdowns) {
      loadProvinces()
    }
    // Load search cache dari localStorage
    loadSearchCacheFromStorage()
  }, [])

  // Load cache dari localStorage
  const loadSearchCacheFromStorage = () => {
    try {
      const cached = localStorage.getItem('rajaongkir_search_cache')
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, { data: any[], timestamp: number }>
        const cacheMap = new Map(Object.entries(parsed))
        setSearchCache(cacheMap)
      }
    } catch (error) {
      console.error('Error loading search cache:', error)
    }
  }

  // Save cache ke localStorage
  const saveSearchCacheToStorage = (cache: Map<string, any>) => {
    try {
      const obj = Object.fromEntries(cache)
      localStorage.setItem('rajaongkir_search_cache', JSON.stringify(obj))
    } catch (error) {
      console.error('Error saving search cache:', error)
    }
  }

  // Load provinces on mount (for dropdown mode)
  const loadProvinces = async () => {
    try {
      setLoadingProvinces(true)
      const res = await fetch("/api/rajaongkir/provinces")
      if (res.ok) {
        const data = await res.json()
        setProvinces(data)
      }
    } catch (error) {
      console.error("Error loading provinces:", error)
    } finally {
      setLoadingProvinces(false)
    }
  }

  // Load cities when province changes
  const loadCities = async (provinceId: string) => {
    if (!provinceId) {
      setCities([])
      return
    }
    try {
      setLoadingCities(true)
      const res = await fetch(`/api/rajaongkir/cities?province=${provinceId}`)
      if (res.ok) {
        const data = await res.json()
        setCities(data)
      }
    } catch (error) {
      console.error("Error loading cities:", error)
    } finally {
      setLoadingCities(false)
    }
  }

  // Load districts when city changes
  const loadDistricts = async (cityId: string) => {
    if (!cityId) {
      setDistricts([])
      return
    }
    try {
      setLoadingDistricts(true)
      const res = await fetch(`/api/rajaongkir/districts?city=${cityId}`)
      if (res.ok) {
        const data = await res.json()
        setDistricts(data)
      }
    } catch (error) {
      console.error("Error loading districts:", error)
    } finally {
      setLoadingDistricts(false)
    }
  }

  // Handle province selection
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value
    const province = provinces.find(p => p.id.toString() === provinceId)
    
    setFormData({
      ...formData,
      provinceId,
      province: province?.name || "",
      cityId: "",
      city: "",
      districtId: "",
      zipCode: "",
    })
    setCities([])
    setDistricts([])
    
    if (provinceId) {
      loadCities(provinceId)
    }
  }

  // Handle city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    const city = cities.find(c => c.id.toString() === cityId)
    
    setFormData({
      ...formData,
      cityId,
      city: city?.name || "",
      districtId: "",
      zipCode: city?.zip_code || formData.zipCode,
    })
    setDistricts([])
    
    if (cityId) {
      loadDistricts(cityId)
    }
  }

  // Handle district selection
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value
    const district = districts.find(d => d.id.toString() === districtId)
    
    setFormData({
      ...formData,
      districtId,
      zipCode: district?.zip_code || formData.zipCode,
    })
  }

  // Check if RajaOngkir is available
  const checkRajaOngkirAvailability = async () => {
    try {
      const res = await fetch("/api/rajaongkir/search?q=jakarta&limit=1")
      if (res.ok) {
        const data = await res.json()
        setRajaOngkirAvailable(data && data.length > 0)
      } else {
        setRajaOngkirAvailable(false)
      }
    } catch (error) {
      console.error("Error checking RajaOngkir:", error)
      setRajaOngkirAvailable(false)
    }
  }

  // Optimized search dengan caching dan prefix filtering
  useEffect(() => {
    if (!rajaOngkirAvailable || searchQuery.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const normalizedQuery = searchQuery.toLowerCase().trim()
    
    // 1. Check exact cache hit
    const cached = searchCache.get(normalizedQuery)
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 hari
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      setSearchResults(cached.data)
      setShowSearchResults(true)
      return
    }

    // 2. Try prefix cache filtering (untuk autocomplete)
    // Cari cache untuk prefix yang lebih pendek dan filter locally
    let foundPrefixCache = false
    for (let len = normalizedQuery.length - 1; len >= 3; len--) {
      const prefix = normalizedQuery.slice(0, len)
      const prefixCached = searchCache.get(prefix)
      
      if (prefixCached && (Date.now() - prefixCached.timestamp) < CACHE_TTL) {
        // Filter hasil prefix cache dengan query lengkap
        const filtered = prefixCached.data.filter((item: any) => {
          const name = (item.label || item.name || '').toLowerCase()
          return name.includes(normalizedQuery)
        })
        
        if (filtered.length > 0) {
          setSearchResults(filtered)
          setShowSearchResults(true)
          // Cache filtered result juga
          const newCache = new Map(searchCache)
          newCache.set(normalizedQuery, { data: filtered, timestamp: Date.now() })
          setSearchCache(newCache)
          saveSearchCacheToStorage(newCache)
          foundPrefixCache = true
          break
        }
      }
    }

    if (foundPrefixCache) return

    // 3. Jika tidak ada cache, baru hit API (dengan debounce lebih panjang)
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        const res = await fetch(`/api/rajaongkir/search?q=${encodeURIComponent(normalizedQuery)}&limit=15`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data)
          setShowSearchResults(true)
          
          // Cache hasil API
          const newCache = new Map(searchCache)
          newCache.set(normalizedQuery, { data, timestamp: Date.now() })
          setSearchCache(newCache)
          saveSearchCacheToStorage(newCache)
          
          // Cleanup old cache (keep max 50 entries)
          if (newCache.size > 50) {
            const sortedEntries = Array.from(newCache.entries())
              .sort((a, b) => b[1].timestamp - a[1].timestamp)
            const trimmedCache = new Map(sortedEntries.slice(0, 50))
            setSearchCache(trimmedCache)
            saveSearchCacheToStorage(trimmedCache)
          }
        }
      } catch (error) {
        console.error("Error searching destinations:", error)
      } finally {
        setIsSearching(false)
      }
    }, 800) // Debounce lebih panjang: 800ms (dari 500ms)

    return () => clearTimeout(timer)
  }, [searchQuery, rajaOngkirAvailable, searchCache])

  // Auto-fill form with user data when opening form
  useEffect(() => {
    if (showForm && !editingId && session?.user) {
      setFormData(prev => ({
        ...prev,
        recipientName: session.user.name || prev.recipientName,
        phone: session.user.phone || prev.phone,
      }))
    }
  }, [showForm, editingId, session])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
        
        // Auto-select default address if no selection
        if (!selectedAddressId && data.length > 0) {
          const defaultAddr = data.find((a: Address) => a.isDefault) || data[0]
          onSelectAddress(defaultAddr)
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submit
    if (isSaving) return
    
    setIsSaving(true)

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const savedAddress = await res.json()
        
        // Optimistic update: Update local state immediately
        if (editingId) {
          // Update existing address
          setAddresses(prev => prev.map(addr => 
            addr.id === editingId ? savedAddress : addr
          ))
        } else {
          // Add new address
          setAddresses(prev => [...prev, savedAddress])
        }
        
        // Close form and reset
        setShowForm(false)
        setEditingId(null)
        resetForm()
        
        // Show success toast
        import("react-hot-toast").then(({ default: toast }) => {
          toast.success(
            editingId ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan",
            { duration: 2000 }
          )
        })
        
        // Notify parent component
        if (onAddressChange) onAddressChange()
      } else {
        // Show error toast
        const error = await res.json()
        import("react-hot-toast").then(({ default: toast }) => {
          toast.error(error.message || "Gagal menyimpan alamat", { duration: 3000 })
        })
      }
    } catch (error) {
      console.error("Error saving address:", error)
      // Show error toast
      import("react-hot-toast").then(({ default: toast }) => {
        toast.error("Terjadi kesalahan saat menyimpan alamat", { duration: 3000 })
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (address: Address) => {
    setFormData({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
      cityId: address.cityId || "",
      provinceId: address.provinceId || "",
      districtId: address.districtId || "",
    })
    setEditingId(address.id)
    setShowForm(true)
    
    // Load cascade data if editing an address with IDs
    if (address.provinceId) {
      await loadCities(address.provinceId)
    }
    if (address.cityId) {
      await loadDistricts(address.cityId)
    }
  }

  const handleSelectDestination = async (destination: any) => {
    // IMPORTANT: Search API returns subdistrict-level ID in destination.id
    // We need to get proper city_id for shipping calculation
    // destination.id = subdistrict ID (e.g., 17737 for Rawamangun)
    // We need city_id (e.g., 139 for Jakarta Timur)
    
    console.log('=== Selected Destination from Search ===')
    console.log('Raw destination data:', destination)
    
    let cityId = destination.city_id || ""
    
    // If city_id not provided by API, derive it from city_name
    if (!cityId && destination.city_name) {
      try {
        console.log('Deriving city_id from city_name:', destination.city_name)
        const { getCityIdFromName } = await import("@/lib/rajaongkir")
        const derivedCityId = await getCityIdFromName(destination.city_name, destination.province_id)
        cityId = derivedCityId || destination.id // Fallback to subdistrict ID if derivation fails
        console.log('Derived city_id:', derivedCityId)
      } catch (error) {
        console.error("Error deriving city_id:", error)
        cityId = destination.id // Fallback to subdistrict ID
      }
    }
    
    const finalData = {
      cityId: cityId,
      provinceId: destination.province_id || "",
      districtId: destination.id || "", // Use subdistrict ID as districtId for precision
      city: destination.city_name || destination.city || destination.name,
      province: destination.province_name || destination.province || "",
      zipCode: destination.zip_code || destination.postal_code || formData.zipCode,
    }
    
    console.log('=== Final IDs to be saved ===')
    console.log('City ID (for fallback):', finalData.cityId)
    console.log('District ID (for precision):', finalData.districtId)
    console.log('Province ID:', finalData.provinceId)
    
    setFormData({
      ...formData,
      ...finalData
    })
    setSearchQuery("")
    setShowSearchResults(false)
    setSearchResults([])
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus alamat ini?")) return

    try {
      // Optimistic update: Remove from UI immediately
      const deletedAddress = addresses.find(a => a.id === id)
      setAddresses(prev => prev.filter(a => a.id !== id))
      
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      
      if (res.ok) {
        // Update selected address if needed
        if (selectedAddressId === id && addresses.length > 1) {
          const nextAddr = addresses.find((a) => a.id !== id)
          if (nextAddr) onSelectAddress(nextAddr)
        }
        
        // Show success toast
        import("react-hot-toast").then(({ default: toast }) => {
          toast.success("Alamat berhasil dihapus", { duration: 2000 })
        })
        
        if (onAddressChange) onAddressChange()
      } else {
        // Rollback on error
        if (deletedAddress) {
          setAddresses(prev => [...prev, deletedAddress])
        }
        import("react-hot-toast").then(({ default: toast }) => {
          toast.error("Gagal menghapus alamat", { duration: 3000 })
        })
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      // Re-fetch to restore state
      fetchAddresses()
      import("react-hot-toast").then(({ default: toast }) => {
        toast.error("Terjadi kesalahan", { duration: 3000 })
      })
    }
  }

  const resetForm = () => {
    setFormData({
      label: "",
      recipientName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      zipCode: "",
      country: "Indonesia",
      isDefault: false,
      cityId: "",
      provinceId: "",
      districtId: "",
    })
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
    setCities([])
    setDistricts([])
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Address List */}
      {!showForm && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900">Pilih Alamat Pengiriman</h3>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Alamat
            </button>
          </div>

          

          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-white border-2 border-slate-200 rounded-xl">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-4">Belum ada alamat tersimpan</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              >
                Tambah Alamat Baru
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress(addr)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedAddressId === addr.id
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300"
                      }`}>
                        {selectedAddressId === addr.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                          {addr.cityId ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                              Ongkir Otomatis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded flex items-center gap-1">
                              ⚠ Manual
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-700">{addr.recipientName}</p>
                        <p className="text-sm text-slate-600">{addr.phone}</p>
                        <p className="text-sm text-slate-600 mt-1">{addr.address}</p>
                        <p className="text-sm text-slate-600">
                          {addr.city}, {addr.province} {addr.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(addr)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(addr.id)
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">
              {editingId ? "Edit Alamat" : "Tambah Alamat Baru"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Label Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Rumah, Kantor, dll"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Nama lengkap penerima"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {rajaOngkirAvailable ? (
              <div className="space-y-4">
                {/* Toggle between dropdown and search mode */}
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-blue-900">
                    {useDropdowns ? "Mode: Pilih dari dropdown" : "Mode: Cari lokasi"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseDropdowns(!useDropdowns)
                      // Reset form data when switching modes
                      setFormData({
                        ...formData,
                        cityId: "",
                        provinceId: "",
                        districtId: "",
                        city: "",
                        province: "",
                        zipCode: "",
                      })
                      setCities([])
                      setDistricts([])
                      setSearchQuery("")
                      setSearchResults([])
                      if (!useDropdowns) {
                        loadProvinces()
                      }
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gunakan {useDropdowns ? "Pencarian" : "Dropdown"}
                  </button>
                </div>

                {useDropdowns ? (
                  /* Cascade Dropdown Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.provinceId}
                        onChange={handleProvinceChange}
                        disabled={loadingProvinces}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                      >
                        <option value="">
                          {loadingProvinces ? "Memuat provinsi..." : "Pilih provinsi"}
                        </option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kota/Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.cityId}
                        onChange={handleCityChange}
                        disabled={!formData.provinceId || loadingCities}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                      >
                        <option value="">
                          {loadingCities
                            ? "Memuat kota..."
                            : formData.provinceId
                            ? "Pilih kota/kabupaten"
                            : "Pilih provinsi terlebih dahulu"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kecamatan (Opsional - untuk ongkir lebih akurat)
                      </label>
                      <select
                        value={formData.districtId}
                        onChange={handleDistrictChange}
                        disabled={!formData.cityId || loadingDistricts}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                      >
                        <option value="">
                          {loadingDistricts
                            ? "Memuat kecamatan..."
                            : formData.cityId
                            ? "Pilih kecamatan (opsional)"
                            : "Pilih kota terlebih dahulu"}
                        </option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        Pilih kecamatan untuk perhitungan ongkir yang lebih akurat
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kode Pos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode || ""}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="12345"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {formData.cityId && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <p className="font-semibold text-green-800 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Lokasi dipilih dengan ID RajaOngkir
                        </p>
                        <p className="text-sm text-green-700">
                          {formData.province} → {formData.city}
                          {formData.districtId && districts.find(d => d.id.toString() === formData.districtId) && (
                            <> → {districts.find(d => d.id.toString() === formData.districtId)?.name}</>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.districtId && (
                            <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-semibold" title="District ID untuk perhitungan ongkir presisi">
                              Akurat (District ID)
                            </span>
                          )}
                          {formData.cityId && !formData.districtId && (
                            <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-semibold" title="City ID untuk perhitungan ongkir">
                              City ID
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Search Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cari Lokasi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                          placeholder="Ketik nama kota, kecamatan, atau kelurahan... (min 3 karakter)"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-3">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        {showSearchResults && searchResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((result, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectDestination(result)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0"
                              >
                                <div className="font-semibold text-slate-900">{result.name}</div>
                                <div className="text-sm text-slate-600">
                                  {result.subdistrict && `${result.subdistrict}, `}
                                  {result.district && `${result.district}, `}
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
                        <p className="text-sm text-slate-500 mt-1">Ketik minimal 3 karakter untuk mencari</p>
                      )}
                    </div>

                    {formData.cityId && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <p className="font-semibold text-green-800 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Lokasi dipilih dengan ID RajaOngkir
                        </p>
                        <p className="text-sm text-green-700">
                          {formData.city}, {formData.province}
                          {formData.zipCode && ` - ${formData.zipCode}`}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.districtId && (
                            <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-semibold" title="District ID untuk perhitungan ongkir presisi">
                              Akurat (District ID)
                            </span>
                          )}
                          {formData.cityId && !formData.districtId && (
                            <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-semibold" title="City ID untuk perhitungan ongkir">
                              City ID
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Provinsi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.province || ""}
                          readOnly={!!formData.cityId}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          placeholder="Pilih dari pencarian"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Kota/Kabupaten <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city || ""}
                          readOnly={!!formData.cityId}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Pilih dari pencarian"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent read-only:bg-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Kode Pos <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.zipCode || ""}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          placeholder="12345"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-4">
                  <p className="font-semibold mb-1">RajaOngkir tidak tersedia</p>
                  <p>Silakan isi provinsi dan kota secara manual. Perhitungan ongkir otomatis tidak dapat dilakukan.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Nama provinsi"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Nama kota"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="12345"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 cursor-pointer">
                Jadikan alamat utama
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Alamat"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
