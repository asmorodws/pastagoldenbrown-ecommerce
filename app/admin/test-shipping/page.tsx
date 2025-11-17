"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Package, Truck, MapPin, Weight, DollarSign, Clock } from "lucide-react"

interface Location {
  id: string
  name: string
  city: string
  province: string
  district?: string
  subdistrict?: string
}

interface ShippingResult {
  courier: string
  courierName: string
  service: string
  description: string
  cost: number
  etd: string
}

const AVAILABLE_COURIERS = [
  { code: "jne", name: "JNE" },
  { code: "sicepat", name: "SiCepat" },
  { code: "jnt", name: "J&T Express" },
  { code: "ninja", name: "Ninja Xpress" },
  { code: "tiki", name: "TIKI" },
  { code: "anteraja", name: "AnterAja" },
  { code: "pos", name: "POS Indonesia" },
]

export default function ShippingTestPage() {
  // Origin
  const [originSearch, setOriginSearch] = useState("")
  const [originResults, setOriginResults] = useState<any[]>([])
  const [selectedOrigin, setSelectedOrigin] = useState<Location | null>(null)
  const [showOriginResults, setShowOriginResults] = useState(false)

  // Destination
  const [destSearch, setDestSearch] = useState("")
  const [destResults, setDestResults] = useState<any[]>([])
  const [selectedDest, setSelectedDest] = useState<Location | null>(null)
  const [showDestResults, setShowDestResults] = useState(false)

  // Form
  const [weight, setWeight] = useState("1000")
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>(["jne", "sicepat"])

  // Results
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ShippingResult[]>([])
  const [error, setError] = useState("")
  
  // Search cache untuk mengurangi API hits
  const [searchCache, setSearchCache] = useState<Map<string, { data: any[], timestamp: number }>>(new Map())

  // Auto-load origin from settings
  useEffect(() => {
    loadDefaultOrigin()
    // Load search cache
    try {
      const cached = localStorage.getItem('shipping_test_search_cache')
      if (cached) {
        setSearchCache(new Map(Object.entries(JSON.parse(cached))))
      }
    } catch (e) {}
  }, [])

  const loadDefaultOrigin = async () => {
    try {
      const res = await fetch("/api/settings/shipping-origin")
      if (res.ok) {
        const data = await res.json()
        setSelectedOrigin({
          id: data.cityId,
          name: data.cityName,
          city: data.cityName.split(",")[0] || "",
          province: data.cityName.split(",")[1]?.trim() || "",
        })
      }
    } catch (error) {
      console.error("Error loading origin:", error)
    }
  }

  const searchLocation = async (query: string, type: "origin" | "dest") => {
    if (query.length < 3) {
      if (type === "origin") {
        setOriginResults([])
        setShowOriginResults(false)
      } else {
        setDestResults([])
        setShowDestResults(false)
      }
      return
    }

    const normalizedQuery = query.toLowerCase().trim()
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000
    
    // Check cache
    const cached = searchCache.get(normalizedQuery)
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      if (type === "origin") {
        setOriginResults(cached.data)
        setShowOriginResults(true)
      } else {
        setDestResults(cached.data)
        setShowDestResults(true)
      }
      return
    }

    // Try prefix cache
    for (let len = normalizedQuery.length - 1; len >= 3; len--) {
      const prefix = normalizedQuery.slice(0, len)
      const prefixCached = searchCache.get(prefix)
      
      if (prefixCached && (Date.now() - prefixCached.timestamp) < CACHE_TTL) {
        const filtered = prefixCached.data.filter((item: any) => {
          const name = (item.label || item.name || '').toLowerCase()
          return name.includes(normalizedQuery)
        })
        
        if (filtered.length > 0) {
          if (type === "origin") {
            setOriginResults(filtered)
            setShowOriginResults(true)
          } else {
            setDestResults(filtered)
            setShowDestResults(true)
          }
          // Cache filtered
          const newCache = new Map(searchCache)
          newCache.set(normalizedQuery, { data: filtered, timestamp: Date.now() })
          setSearchCache(newCache)
          try {
            localStorage.setItem('shipping_test_search_cache', JSON.stringify(Object.fromEntries(newCache)))
          } catch (e) {}
          return
        }
      }
    }

    // Hit API
    try {
      const res = await fetch(`/api/rajaongkir/search?q=${encodeURIComponent(normalizedQuery)}&limit=15`)
      if (res.ok) {
        const data = await res.json()
        if (type === "origin") {
          setOriginResults(data)
          setShowOriginResults(true)
        } else {
          setDestResults(data)
          setShowDestResults(true)
        }
        
        // Cache
        const newCache = new Map(searchCache)
        newCache.set(normalizedQuery, { data, timestamp: Date.now() })
        if (newCache.size > 50) {
          const sorted = Array.from(newCache.entries()).sort((a, b) => b[1].timestamp - a[1].timestamp)
          const trimmed = new Map(sorted.slice(0, 50))
          setSearchCache(trimmed)
          try {
            localStorage.setItem('shipping_test_search_cache', JSON.stringify(Object.fromEntries(trimmed)))
          } catch (e) {}
        } else {
          setSearchCache(newCache)
          try {
            localStorage.setItem('shipping_test_search_cache', JSON.stringify(Object.fromEntries(newCache)))
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error("Error searching:", error)
    }
  }

  useEffect(() => {
    if (originSearch.length >= 3) {
      const timer = setTimeout(() => searchLocation(originSearch, "origin"), 800)
      return () => clearTimeout(timer)
    } else {
      setOriginResults([])
      setShowOriginResults(false)
    }
  }, [originSearch])

  useEffect(() => {
    if (destSearch.length >= 3) {
      const timer = setTimeout(() => searchLocation(destSearch, "dest"), 800)
      return () => clearTimeout(timer)
    } else {
      setDestResults([])
      setShowDestResults(false)
    }
  }, [destSearch])

  const handleSelectLocation = (location: any, type: "origin" | "dest") => {
    const loc: Location = {
      id: location.city_id || location.id,
      name: location.name || location.label,
      city: location.city || location.city_name || "",
      province: location.province || location.province_name || "",
      district: location.district || location.district_name,
      subdistrict: location.subdistrict || location.subdistrict_name,
    }

    if (type === "origin") {
      setSelectedOrigin(loc)
      setOriginSearch("")
      setShowOriginResults(false)
    } else {
      setSelectedDest(loc)
      setDestSearch("")
      setShowDestResults(false)
    }
  }

  const toggleCourier = (code: string) => {
    setSelectedCouriers(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const handleCalculate = async () => {
    if (!selectedOrigin || !selectedDest) {
      setError("Pilih origin dan destination terlebih dahulu")
      return
    }

    if (selectedCouriers.length === 0) {
      setError("Pilih minimal 1 ekspedisi")
      return
    }

    setLoading(true)
    setError("")
    setResults([])

    try {
      const res = await fetch("/api/rajaongkir/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: selectedOrigin.id,
          destination: selectedDest.id,
          weight: parseInt(weight),
          courier: selectedCouriers.join(":"),
          price: "lowest",
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to calculate shipping")
      }

      const data = await res.json()
      
      // Flatten results
      const allResults: ShippingResult[] = []
      data.forEach((courier: any) => {
        courier.costs.forEach((service: any) => {
          allResults.push({
            courier: courier.code,
            courierName: courier.name,
            service: service.service,
            description: service.description,
            cost: service.cost[0].value,
            etd: service.cost[0].etd,
          })
        })
      })

      setResults(allResults.sort((a, b) => a.cost - b.cost))
    } catch (err: any) {
      setError(err.message || "Gagal menghitung ongkir")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulasi Cek Ongkir</h1>
              <p className="text-gray-600 mt-1">Testing RajaOngkir API Integration</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Origin */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Origin (Dari)</h2>
            </div>

            {selectedOrigin ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-green-900">{selectedOrigin.city}</p>
                    <p className="text-sm text-green-700">{selectedOrigin.province}</p>
                    <p className="text-xs text-green-600 mt-1">ID: {selectedOrigin.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrigin(null)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  placeholder="Cari kota origin... (min 3 karakter)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                />
                {showOriginResults && originResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {originResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectLocation(result, "origin")}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{result.name}</div>
                        <div className="text-sm text-gray-600">
                          {result.city_name && `${result.city_name}, `}
                          {result.province_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Destination (Ke)</h2>
            </div>

            {selectedDest ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">{selectedDest.city}</p>
                    <p className="text-sm text-blue-700">{selectedDest.province}</p>
                    <p className="text-xs text-blue-600 mt-1">ID: {selectedDest.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDest(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder="Cari kota tujuan... (min 3 karakter)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {showDestResults && destResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {destResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectLocation(result, "dest")}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{result.name}</div>
                        <div className="text-sm text-gray-600">
                          {result.city_name && `${result.city_name}, `}
                          {result.province_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Weight & Couriers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weight */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Weight className="w-5 h-5 text-purple-600" />
                <label className="font-semibold text-gray-900">Berat (gram)</label>
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="1000"
              />
            </div>

            {/* Couriers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-orange-600" />
                <label className="font-semibold text-gray-900">Pilih Ekspedisi</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COURIERS.map((courier) => (
                  <button
                    key={courier.code}
                    onClick={() => toggleCourier(courier.code)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCouriers.includes(courier.code)
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {courier.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={loading || !selectedOrigin || !selectedDest}
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menghitung...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Hitung Ongkir
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6 text-blue-600" />
              Hasil ({results.length} layanan)
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{result.courierName}</p>
                      <p className="text-sm text-gray-600">{result.service}</p>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                      #{idx + 1}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{result.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      {result.etd} hari
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        Rp {result.cost.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
