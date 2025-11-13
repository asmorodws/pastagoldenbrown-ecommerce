"use client"

import { useState, useEffect } from "react"
import { Truck, Package, Clock, AlertCircle } from "lucide-react"

interface ShippingService {
  service: string
  description: string
  cost: Array<{
    value: number
    etd: string
    note: string
  }>
}

interface ShippingCourier {
  code: string
  name: string
  costs: ShippingService[]
}

interface ShippingOption {
  courier: string
  courierName: string
  service: string
  serviceName: string
  cost: number
  etd: string
}

interface ShippingSelectorProps {
  destinationCityId: string
  destinationDistrictId?: string
  totalWeight: number // in grams
  onSelectShipping: (shipping: ShippingOption) => void
  selectedShipping?: ShippingOption
}

// Default origin city ID - replace with your store location
// For example: "501" is Jakarta Timur
const ORIGIN_CITY_ID = process.env.NEXT_PUBLIC_ORIGIN_CITY_ID || "501"

// Available couriers with display info
const AVAILABLE_COURIERS = [
  { code: "jne", name: "JNE", logo: "🚛", color: "bg-red-50 border-red-200" },
  { code: "sicepat", name: "SiCepat", logo: "⚡", color: "bg-yellow-50 border-yellow-200" },
  { code: "ide", name: "ID Express", logo: "📮", color: "bg-green-50 border-green-200" },
  { code: "sap", name: "SAP Express", logo: "📦", color: "bg-purple-50 border-purple-200" },
  { code: "jnt", name: "J&T Express", logo: "�", color: "bg-red-50 border-red-200" },
  { code: "ninja", name: "Ninja Xpress", logo: "🥷", color: "bg-blue-50 border-blue-200" },
  { code: "tiki", name: "TIKI", logo: "📦", color: "bg-orange-50 border-orange-200" },
  { code: "lion", name: "Lion Parcel", logo: "🦁", color: "bg-yellow-50 border-yellow-200" },
  { code: "anteraja", name: "AnterAja", logo: "🚚", color: "bg-green-50 border-green-200" },
  { code: "pos", name: "POS Indonesia", logo: "📮", color: "bg-blue-50 border-blue-200" },
  { code: "ncs", name: "NCS", logo: "📦", color: "bg-slate-50 border-slate-200" },
  { code: "rex", name: "REX", logo: "📦", color: "bg-indigo-50 border-indigo-200" },
  { code: "rpx", name: "RPX", logo: "📦", color: "bg-pink-50 border-pink-200" },
  { code: "sentral", name: "Sentral Cargo", logo: "🚚", color: "bg-cyan-50 border-cyan-200" },
  { code: "star", name: "Star Cargo", logo: "⭐", color: "bg-amber-50 border-amber-200" },
  { code: "wahana", name: "Wahana", logo: "📦", color: "bg-teal-50 border-teal-200" },
  { code: "dse", name: "DSE", logo: "📦", color: "bg-violet-50 border-violet-200" },
]

const COURIER_LOGOS: Record<string, string> = Object.fromEntries(
  AVAILABLE_COURIERS.map(c => [c.code, c.logo])
)

export default function ShippingSelector({
  destinationCityId,
  destinationDistrictId,
  totalWeight,
  onSelectShipping,
  selectedShipping,
}: ShippingSelectorProps) {
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingCourier[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>([
    "jne", "sicepat", "jnt", "ninja", "tiki", "anteraja", "pos"
  ])
  const [showCourierSelector, setShowCourierSelector] = useState(false)
  const [originCityId, setOriginCityId] = useState<string>("")

  // Fetch origin dari database
  useEffect(() => {
    fetchOrigin()
  }, [])

  const fetchOrigin = async () => {
    try {
      const res = await fetch("/api/settings/shipping-origin")
      if (res.ok) {
        const data = await res.json()
        setOriginCityId(data.cityId)
      }
    } catch (error) {
      console.error("Error fetching origin:", error)
      // Use fallback
      setOriginCityId(process.env.NEXT_PUBLIC_ORIGIN_CITY_ID || "152")
    }
  }

  useEffect(() => {
    if (destinationCityId && totalWeight > 0 && selectedCouriers.length > 0 && originCityId) {
      fetchShippingCosts()
    }
  }, [destinationCityId, destinationDistrictId, totalWeight, selectedCouriers, originCityId])

  const fetchShippingCosts = async () => {
    setLoading(true)
    setError(null)

    try {
      // V2 API: Use colon-separated courier list from selected couriers
      const courierList = selectedCouriers.join(":")
      
      // Determine if we should use district-level calculation
      // Use district endpoint if either origin or destination has district ID
      const useDistrict = !!destinationDistrictId
      
      const response = await fetch("/api/rajaongkir/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: originCityId, // From database
          destination: destinationCityId,
          weight: totalWeight,
          courier: courierList,
          price: 'lowest',
          useDistrict: useDistrict,
          ...(destinationDistrictId && { subdistrict_id: destinationDistrictId }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Shipping cost API error:', errorData)
        throw new Error(errorData.error || "Failed to fetch shipping costs")
      }

      const results = await response.json()

      if (!results || results.length === 0) {
        setError("Tidak ada layanan pengiriman tersedia untuk tujuan ini")
      } else {
        setShippingOptions(results)
      }
    } catch (err: any) {
      console.error("Error fetching shipping costs:", err)
      setError(err.message || "Gagal memuat biaya pengiriman. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCourier = (courierCode: string) => {
    setSelectedCouriers(prev => {
      if (prev.includes(courierCode)) {
        // Don't allow removing all couriers
        if (prev.length === 1) return prev
        return prev.filter(c => c !== courierCode)
      } else {
        return [...prev, courierCode]
      }
    })
  }

  const selectAllCouriers = () => {
    setSelectedCouriers(AVAILABLE_COURIERS.map(c => c.code))
  }

  const selectPopularCouriers = () => {
    setSelectedCouriers(["jne", "sicepat", "jnt", "ninja", "tiki", "anteraja", "pos"])
  }

  const handleSelectShipping = (courier: ShippingCourier, service: ShippingService) => {
    const cost = service.cost[0]
    const shippingOption: ShippingOption = {
      courier: courier.code,
      courierName: courier.name,
      service: service.service,
      serviceName: service.description,
      cost: cost.value,
      etd: cost.etd,
    }
    onSelectShipping(shippingOption)
  }

  const isSelected = (courier: string, service: string): boolean => {
    return (
      selectedShipping?.courier === courier &&
      selectedShipping?.service === service
    )
  }

  if (!destinationCityId) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <p className="text-amber-800 font-medium">
          Silakan pilih alamat pengiriman terlebih dahulu
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white border-2 border-blue-200 rounded-xl p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Memuat opsi pengiriman...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchShippingCosts}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-900" />
          <h3 className="font-bold text-blue-900">Pilih Metode Pengiriman</h3>
        </div>
        <div className="flex items-center gap-2">
          {destinationDistrictId && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✓ Perhitungan Akurat (Kecamatan)
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowCourierSelector(!showCourierSelector)}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
          >
            {showCourierSelector ? "Sembunyikan" : "Pilih Ekspedisi"} ({selectedCouriers.length})
          </button>
        </div>
      </div>

      {/* Courier Selector */}
      {showCourierSelector && (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900">Pilih Ekspedisi</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectPopularCouriers}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                Populer
              </button>
              <button
                type="button"
                onClick={selectAllCouriers}
                className="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg hover:bg-slate-700 transition-colors"
              >
                Semua
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {AVAILABLE_COURIERS.map((courier) => (
              <button
                key={courier.code}
                type="button"
                onClick={() => toggleCourier(courier.code)}
                className={`p-3 border-2 rounded-lg transition-all text-center ${
                  selectedCouriers.includes(courier.code)
                    ? `${courier.color} border-current font-semibold`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-1">{courier.logo}</div>
                <div className="text-xs font-medium">{courier.name}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            💡 Pilih ekspedisi yang ingin ditampilkan. Minimal 1 ekspedisi harus dipilih.
          </p>
        </div>
      )}

      {selectedCouriers.length === 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <p className="text-amber-800 font-medium">
            Silakan pilih minimal 1 ekspedisi
          </p>
        </div>
      )}

      {shippingOptions.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">Tidak ada layanan pengiriman tersedia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shippingOptions.map((courier) => (
            <div key={courier.code} className="bg-white border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{COURIER_LOGOS[courier.code.toLowerCase()] || "📦"}</span>
                <div>
                  <h4 className="font-bold text-slate-900">{courier.name}</h4>
                  <p className="text-xs text-slate-500">
                    Berat: {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(1)} kg` : `${totalWeight} gram`}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {courier.costs.map((service) => {
                  const cost = service.cost[0]
                  const selected = isSelected(courier.code, service.service)

                  return (
                    <button
                      key={service.service}
                      onClick={() => handleSelectShipping(courier, service)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{service.service}</span>
                            <span className="text-xs text-slate-600">({service.description})</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>{cost.etd} hari</span>
                            </div>
                            <span className="font-bold text-blue-900 text-lg">
                              Rp {cost.value.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!selectedShipping && shippingOptions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Silakan pilih metode pengiriman untuk melanjutkan
        </div>
      )}
    </div>
  )
}
