"use client"

import { useState, useEffect } from "react"
import { Truck, Package, Clock, AlertCircle, MessageCircle, Bike, Car } from "lucide-react"

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

// Available couriers - Ekspedisi yang digunakan Golden Brown Pasta
// Urutan sesuai prioritas: JNE, SiCepat, AnterAja, Lion Parcel
const AVAILABLE_COURIERS = [
  { code: "jne", name: "JNE", color: "bg-red-50 border-red-200" },
  { code: "sicepat", name: "SiCepat", color: "bg-blue-50 border-blue-200" },
  { code: "anteraja", name: "AnterAja", color: "bg-green-50 border-green-200" },
  { code: "lion", name: "Lion Parcel", color: "bg-amber-50 border-amber-200" },
]

// Regular service codes - Hanya tampilkan layanan regular, bukan premium/trucking
const REGULAR_SERVICES: Record<string, string[]> = {
  lion: ['REGPACK', 'ONEPACK', 'REG'], // Exclude: JAGOPACK, BIGPACKFAST, dll
  jne: ['REG', 'YES', 'OKE'], // Exclude: JTR (trucking), CTCYES, dll
  sicepat: ['REG', 'BEST', 'SIUNT', 'GOKIL'], 
  anteraja: ['REG', 'NEXT', 'SAMEDAY', 'REGULER'],
}

// Filter function untuk hanya menampilkan layanan regular
const isRegularService = (courierCode: string, serviceCode: string): boolean => {
  const allowedServices = REGULAR_SERVICES[courierCode.toLowerCase()]
  if (!allowedServices) {
    // Jika courier tidak terdaftar, cek apakah service mengandung kata kunci premium/trucking
    const premiumKeywords = ['TRUCK', 'CARGO', 'JUMBO', 'BIGPACK', 'JAGO']
    const isPremium = premiumKeywords.some(keyword => 
      serviceCode.toUpperCase().includes(keyword)
    )
    return !isPremium // Tampilkan jika bukan premium
  }
  return allowedServices.includes(serviceCode.toUpperCase())
}

// Instant/Sameday services - manual checkout via WhatsApp
const INSTANT_SERVICES = [
  { 
    name: "Gojek Instant / Sameday",
    description: "Pengiriman cepat dalam hari yang sama area tertentu",
    icon: "bike",
  },
  { 
    name: "Grab Instant / Sameday",
    description: "Pengiriman kilat hari ini area tertentu",
    icon: "car",
  },
  { 
    name: "AnterAja Sameday",
    description: "Pengiriman di hari yang sama untuk area terjangkau",
    icon: "truck",
  },
]

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
    "jne", "sicepat", "anteraja", "lion"
  ])
  const [showCourierSelector, setShowCourierSelector] = useState(false)
  const [originCityId, setOriginCityId] = useState<string>("")
  const [originSubdistrictId, setOriginSubdistrictId] = useState<string>("")

  // Fetch origin dari database
  useEffect(() => {
    fetchOrigin()
  }, [])

  const fetchOrigin = async () => {
    try {
      const res = await fetch("/api/settings/shipping-origin")
      if (res.ok) {
        const data = await res.json()
        console.log('=== Origin Settings from Database ===')
        console.log('City ID:', data.cityId)
        console.log('Subdistrict ID:', data.subdistrictId)
        console.log('City Name:', data.cityName)
        setOriginCityId(data.cityId)
        setOriginSubdistrictId(data.subdistrictId || "")
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
      
      // IMPORTANT: RajaOngkir District Endpoint provides more accurate pricing
      // Prioritize district-level IDs (subdistrict/kelurahan) when available
      // Fallback to city-level IDs if district IDs are not available
      
      // Determine which IDs to use based on availability
      const originId = originSubdistrictId || originCityId
      const destinationId = destinationDistrictId || destinationCityId
      
      // Use district endpoint if BOTH origin and destination have district-level IDs
      // This gives most accurate pricing and ETD
      const useDistrictEndpoint = !!(originSubdistrictId && destinationDistrictId)
      
      console.log('=== Shipping Cost Request ===')
      console.log('Origin City ID:', originCityId)
      console.log('Origin District/Subdistrict ID:', originSubdistrictId || '(not available)')
      console.log('Origin ID used:', originId)
      console.log('Destination City ID:', destinationCityId)
      console.log('Destination District/Subdistrict ID:', destinationDistrictId || '(not available)')
      console.log('Destination ID used:', destinationId)
      console.log('Endpoint:', useDistrictEndpoint ? 'District (more accurate)' : 'City (fallback)')
      console.log('Weight:', totalWeight, 'grams')
      console.log('Couriers:', courierList)
      
      const response = await fetch("/api/rajaongkir/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: originId,
          destination: destinationId,
          weight: totalWeight,
          courier: courierList, // Format: jne:sicepat:anteraja:lion
          price: 'lowest', // Get lowest price for each service
          useDistrict: useDistrictEndpoint,
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
        // Debug logging
        console.log('=== RajaOngkir API Response ===')
        console.log('Requested couriers:', courierList)
        console.log('Raw results count:', results.length)
        results.forEach((courier: any) => {
          console.log(`${courier.name} (${courier.code}):`, 
            courier.costs.map((s: any) => `${s.service} (${s.description})`))
        })
        
        // Filter untuk hanya menampilkan layanan regular
        const filteredResults = results.map((courier: ShippingCourier) => {
          const regularCosts = courier.costs.filter(service => {
            const isRegular = isRegularService(courier.code, service.service)
            if (!isRegular) {
              console.log(`Filtered out: ${courier.name} - ${service.service} (${service.description})`)
            }
            return isRegular
          })
          return {
            ...courier,
            costs: regularCosts
          }
        }).filter((courier: ShippingCourier) => courier.costs.length > 0)
        
        console.log('=== After Filtering ===')
        console.log('Filtered results count:', filteredResults.length)
        filteredResults.forEach((courier: any) => {
          console.log(`${courier.name}:`, 
            courier.costs.map((s: any) => `${s.service} - Rp ${s.cost[0].value.toLocaleString()}`))
        })
        
        setShippingOptions(filteredResults)
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
    setSelectedCouriers(["lion", "jne", "sicepat", "anteraja"])
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
      {/* Instant/Sameday Services - WhatsApp Only */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-1">Pengiriman Instant/Sameday</h3>
            <p className="text-sm text-slate-600">
              Untuk layanan pengiriman kilat, silakan hubungi Customer Service kami via WhatsApp
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {INSTANT_SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-lg p-3 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
                  {service.icon === 'bike' && <Bike className="w-4 h-4 text-slate-600" />}
                  {service.icon === 'car' && <Car className="w-4 h-4 text-slate-600" />}
                  {service.icon === 'truck' && <Truck className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm">{service.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/6285778239144?text=Halo%20Golden%20Brown%20Pasta%2C%20saya%20ingin%20pesan%20dengan%20pengiriman%20instant%2Fsameday"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fb855] text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Hubungi via WhatsApp</span>
        </a>
      </div>

      {/* Regular Shipping */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-900" />
          <h3 className="font-bold text-blue-900">Pengiriman Regular</h3>
        </div>
        <div className="flex items-center gap-2">
          {originSubdistrictId && destinationDistrictId ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1" title="Menggunakan District Endpoint untuk perhitungan paling akurat">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Perhitungan Akurat (District)
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1" title="Menggunakan City Endpoint - harga perkiraan">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Estimasi (City)
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AVAILABLE_COURIERS.map((courier) => (
              <button
                key={courier.code}
                type="button"
                onClick={() => toggleCourier(courier.code)}
                className={`p-4 border-2 rounded-lg transition-all text-center ${
                  selectedCouriers.includes(courier.code)
                    ? `${courier.color} border-current font-semibold`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-sm font-medium">{courier.name}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pilih ekspedisi yang ingin ditampilkan. Minimal 1 ekspedisi harus dipilih.
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
          <p className="text-xs text-slate-500 mt-2">
            Coba pilih ekspedisi lain atau hubungi Customer Service
          </p>
        </div>
      ) : (
        <>
          {/* Warning jika ada courier yang dipilih tapi tidak tersedia */}
          {selectedCouriers.length > shippingOptions.length && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Informasi Ketersediaan</p>
                  <p>
                    Beberapa ekspedisi yang dipilih tidak tersedia untuk rute ini. 
                    Menampilkan {shippingOptions.length} dari {selectedCouriers.length} ekspedisi yang dipilih.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
          {shippingOptions.map((courier) => (
            <div key={courier.code} className="bg-white border-2 border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
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
        </>
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
