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
  }, [])

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

  // Search destinations with debouncing
  useEffect(() => {
    if (!rajaOngkirAvailable || searchQuery.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        const res = await fetch(`/api/rajaongkir/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error("Error searching destinations:", error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, rajaOngkirAvailable])

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
        await fetchAddresses()
        setShowForm(false)
        setEditingId(null)
        resetForm()
        if (onAddressChange) onAddressChange()
      }
    } catch (error) {
      console.error("Error saving address:", error)
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

  const handleSelectDestination = (destination: any) => {
    setFormData({
      ...formData,
      cityId: destination.id,
      provinceId: destination.id, // Use same ID for compatibility (V2 doesn't have separate provinceId)
      city: destination.city || destination.district || destination.name,
      province: destination.province || "",
      zipCode: destination.postal_code || formData.zipCode,
    })
    setSearchQuery("")
    setShowSearchResults(false)
    setSearchResults([])
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus alamat ini?")) return

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchAddresses()
        if (selectedAddressId === id && addresses.length > 1) {
          const nextAddr = addresses.find((a) => a.id !== id)
          if (nextAddr) onSelectAddress(nextAddr)
        }
        if (onAddressChange) onAddressChange()
      }
    } catch (error) {
      console.error("Error deleting address:", error)
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
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pilih Alamat Pengiriman
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Tambah Alamat
            </button>
          </div>

          {/* Info helper */}
          {addresses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tips:</span> Alamat dengan badge{" "}
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                  ✓ Ongkir Otomatis
                </span>{" "}
                mendukung perhitungan ongkir real-time dari RajaOngkir.
              </p>
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">Belum ada alamat tersimpan</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium"
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
                              ✓ Ongkir Otomatis
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
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-blue-900 text-lg">
              {editingId ? "Edit Alamat" : "Tambah Alamat Baru"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
                        💡 Pilih kecamatan untuk perhitungan ongkir yang lebih akurat
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
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-800 mb-1">✓ Lokasi dipilih:</p>
                        <p className="text-sm text-green-700">
                          {formData.province} → {formData.city}
                          {formData.districtId && districts.find(d => d.id.toString() === formData.districtId) && (
                            <> → {districts.find(d => d.id.toString() === formData.districtId)?.name}</>
                          )}
                        </p>
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
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-800 mb-1">✓ Lokasi dipilih:</p>
                        <p className="text-sm text-green-700">
                          {formData.city}, {formData.province}
                          {formData.zipCode && ` - ${formData.zipCode}`}
                        </p>
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
                  <p className="font-semibold mb-1">⚠️ RajaOngkir tidak tersedia</p>
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
                className="flex-1 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Alamat"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold disabled:opacity-50"
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
