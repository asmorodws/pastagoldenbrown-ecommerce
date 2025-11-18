/**
 * RajaOngkir API Test Fixtures
 * 
 * Mock data untuk testing RajaOngkir API integration
 * Sesuai dengan dokumentasi API RajaOngkir V2
 */

export const mockApiResponses = {
  // GET /destination/province - Success Response
  provinces: {
    success: {
      meta: {
        message: 'Success Get Provinces',
        code: 200,
        status: 'success',
      },
      data: [
        { id: 1, name: 'Bali' },
        { id: 2, name: 'Bangka Belitung' },
        { id: 3, name: 'Banten' },
        { id: 4, name: 'Bengkulu' },
        { id: 5, name: 'DI Yogyakarta' },
        { id: 6, name: 'DKI Jakarta' },
        { id: 7, name: 'Gorontalo' },
        { id: 8, name: 'Jambi' },
        { id: 9, name: 'Jawa Barat' },
        { id: 10, name: 'Jawa Tengah' },
      ],
    },
    error404: {
      meta: {
        message: 'Provinces Data not found',
        code: 404,
        status: 'error',
      },
      data: null,
    },
  },

  // GET /destination/city/{province_id} - Success Response
  cities: {
    success: {
      meta: {
        message: 'Success Get Cities',
        code: 200,
        status: 'success',
      },
      data: [
        { id: 1, name: 'Badung', zip_code: '80351' },
        { id: 2, name: 'Bangli', zip_code: '80619' },
        { id: 3, name: 'Buleleng', zip_code: '81111' },
        { id: 4, name: 'Denpasar', zip_code: '80111' },
        { id: 5, name: 'Gianyar', zip_code: '80511' },
      ],
    },
    jakarta: {
      meta: {
        message: 'Success Get Cities',
        code: 200,
        status: 'success',
      },
      data: [
        { id: 151, name: 'Jakarta Barat', zip_code: '11220' },
        { id: 152, name: 'Jakarta Pusat', zip_code: '10110' },
        { id: 153, name: 'Jakarta Selatan', zip_code: '12110' },
        { id: 154, name: 'Jakarta Timur', zip_code: '13110' },
        { id: 155, name: 'Jakarta Utara', zip_code: '14410' },
      ],
    },
    error404: {
      meta: {
        message: 'Cities Data not found',
        code: 404,
        status: 'error',
      },
      data: null,
    },
  },

  // GET /destination/district/{city_id} - Success Response
  districts: {
    success: {
      meta: {
        message: 'Success Get Districts',
        code: 200,
        status: 'success',
      },
      data: [
        { id: 1, name: 'Abiansemal', zip_code: '80352' },
        { id: 2, name: 'Kuta', zip_code: '80361' },
        { id: 3, name: 'Kuta Selatan', zip_code: '80364' },
        { id: 4, name: 'Kuta Utara', zip_code: '80361' },
        { id: 5, name: 'Mengwi', zip_code: '80351' },
        { id: 6, name: 'Petang', zip_code: '80353' },
      ],
    },
    error404: {
      meta: {
        message: 'Districts Data not found',
        code: 404,
        status: 'error',
      },
      data: null,
    },
  },

  // GET /destination/sub-district/{district_id} - Success Response
  subdistricts: {
    success: {
      meta: {
        message: 'Success Get Subdistricts',
        code: 200,
        status: 'success',
      },
      data: [
        { id: 17674, name: 'Kuta', zip_code: '80361' },
        { id: 17675, name: 'Legian', zip_code: '80361' },
        { id: 17676, name: 'Seminyak', zip_code: '80361' },
        { id: 17677, name: 'Tuban', zip_code: '80361' },
      ],
    },
    error404: {
      meta: {
        message: 'Subdistricts Data not found',
        code: 404,
        status: 'error',
      },
      data: null,
    },
  },

  // GET /destination/domestic-destination?search={query} - Success Response
  search: {
    kuta: {
      meta: {
        message: 'Success Get Domestic Destinations',
        code: 200,
        status: 'success',
      },
      data: [
        {
          id: 17674,
          label: 'Kuta, Kuta, Badung, Bali, 80361',
          province_name: 'Bali',
          province_id: 1,
          city_name: 'Badung',
          city_id: 1,
          district_name: 'Kuta',
          district_id: 2,
          subdistrict_name: 'Kuta',
          zip_code: '80361',
        },
        {
          id: 17675,
          label: 'Legian, Kuta, Badung, Bali, 80361',
          province_name: 'Bali',
          province_id: 1,
          city_name: 'Badung',
          city_id: 1,
          district_name: 'Kuta',
          district_id: 2,
          subdistrict_name: 'Legian',
          zip_code: '80361',
        },
        {
          id: 17676,
          label: 'Seminyak, Kuta, Badung, Bali, 80361',
          province_name: 'Bali',
          province_id: 1,
          city_name: 'Badung',
          city_id: 1,
          district_name: 'Kuta',
          district_id: 2,
          subdistrict_name: 'Seminyak',
          zip_code: '80361',
        },
      ],
    },
    jakarta: {
      meta: {
        message: 'Success Get Domestic Destinations',
        code: 200,
        status: 'success',
      },
      data: [
        {
          id: 45123,
          label: 'Menteng, Menteng, Jakarta Pusat, DKI Jakarta, 10310',
          province_name: 'DKI Jakarta',
          province_id: 6,
          city_name: 'Jakarta Pusat',
          city_id: 152,
          district_name: 'Menteng',
          district_id: 1023,
          subdistrict_name: 'Menteng',
          zip_code: '10310',
        },
        {
          id: 45124,
          label: 'Gondangdia, Menteng, Jakarta Pusat, DKI Jakarta, 10350',
          province_name: 'DKI Jakarta',
          province_id: 6,
          city_name: 'Jakarta Pusat',
          city_id: 152,
          district_name: 'Menteng',
          district_id: 1023,
          subdistrict_name: 'Gondangdia',
          zip_code: '10350',
        },
      ],
    },
    error404: {
      meta: {
        message: 'Domestic Destinations Data not found',
        code: 404,
        status: 'error',
      },
      data: null,
    },
    error422: {
      meta: {
        message: 'Parameter Missing',
        code: 422,
        status: 'error',
      },
      data: null,
    },
  },

  // POST /calculate/domestic-cost - Success Response
  cost: {
    success: {
      meta: {
        message: 'Success Calculate Domestic Shipping cost',
        code: 200,
        status: 'success',
      },
      data: [
        {
          name: 'JNE',
          code: 'jne',
          service: 'REG',
          description: 'Layanan Reguler',
          cost: 15000,
          etd: '2-3 hari',
        },
        {
          name: 'JNE',
          code: 'jne',
          service: 'YES',
          description: 'Yakin Esok Sampai',
          cost: 25000,
          etd: '1-1 hari',
        },
        {
          name: 'JNE',
          code: 'jne',
          service: 'OKE',
          description: 'Ongkos Kirim Ekonomis',
          cost: 12000,
          etd: '3-4 hari',
        },
        {
          name: 'SiCepat',
          code: 'sicepat',
          service: 'REG',
          description: 'Regular Service',
          cost: 14000,
          etd: '2-3 hari',
        },
        {
          name: 'SiCepat',
          code: 'sicepat',
          service: 'BEST',
          description: 'Best Service',
          cost: 20000,
          etd: '1-2 hari',
        },
        {
          name: 'Lion Parcel',
          code: 'lion',
          service: 'REG',
          description: 'Reguler',
          cost: 13000,
          etd: '2-4 hari',
        },
        {
          name: 'AnterAja',
          code: 'anteraja',
          service: 'REG',
          description: 'Regular',
          cost: 14500,
          etd: '2-3 hari',
        },
      ],
    },
    multiCourier: {
      meta: {
        message: 'Success Calculate Domestic Shipping cost',
        code: 200,
        status: 'success',
      },
      data: [
        {
          name: 'JNE',
          code: 'jne',
          service: 'REG',
          description: 'Layanan Reguler',
          cost: 15000,
          etd: '2-3 hari',
        },
        {
          name: 'SiCepat',
          code: 'sicepat',
          service: 'REG',
          description: 'Regular Service',
          cost: 14000,
          etd: '2-3 hari',
        },
      ],
    },
    error400: {
      meta: {
        message: 'Calculate Domestic Shipping Cost not found',
        code: 400,
        status: 'error',
      },
      data: null,
    },
    error422Invalid: {
      meta: {
        message: 'Invalid Courier',
        code: 422,
        status: 'error',
      },
      data: null,
    },
    error422Missing: {
      meta: {
        message: 'Missing Params',
        code: 422,
        status: 'error',
      },
      data: null,
    },
    error500: {
      meta: {
        message: 'Server Error',
        code: 500,
        status: 'error',
      },
      data: null,
    },
  },
}

// Test scenarios
export const testScenarios = {
  // Valid request parameters
  validRequests: {
    provinces: {
      description: 'Get all provinces',
      endpoint: '/destination/province',
      method: 'GET',
      headers: {
        key: 'test_api_key',
      },
    },
    cities: {
      description: 'Get cities in Bali province',
      endpoint: '/destination/city/1',
      method: 'GET',
      headers: {
        key: 'test_api_key',
      },
      params: {
        province_id: 1,
      },
    },
    districts: {
      description: 'Get districts in Badung city',
      endpoint: '/destination/district/1',
      method: 'GET',
      headers: {
        key: 'test_api_key',
      },
      params: {
        city_id: 1,
      },
    },
    subdistricts: {
      description: 'Get subdistricts in Kuta district',
      endpoint: '/destination/sub-district/2',
      method: 'GET',
      headers: {
        key: 'test_api_key',
      },
      params: {
        district_id: 2,
      },
    },
    search: {
      description: 'Search for Kuta location',
      endpoint: '/destination/domestic-destination',
      method: 'GET',
      headers: {
        key: 'test_api_key',
      },
      params: {
        search: 'kuta',
        limit: 10,
        offset: 0,
      },
    },
    cost: {
      description: 'Calculate shipping cost JNE from Kuta to Legian',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      headers: {
        key: 'test_api_key',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        origin: '17674',
        destination: '17675',
        weight: 1000,
        courier: 'jne',
      },
    },
    costMultiCourier: {
      description: 'Calculate shipping cost multiple couriers',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      headers: {
        key: 'test_api_key',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        origin: '17674',
        destination: '45123',
        weight: 2000,
        courier: 'jne:sicepat:lion:anteraja',
      },
    },
    costWithPrice: {
      description: 'Calculate lowest shipping cost',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      headers: {
        key: 'test_api_key',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        origin: '17674',
        destination: '17675',
        weight: 1000,
        courier: 'jne',
        price: 'lowest',
      },
    },
  },

  // Invalid request parameters
  invalidRequests: {
    searchTooShort: {
      description: 'Search query too short (less than 2 characters)',
      endpoint: '/destination/domestic-destination',
      method: 'GET',
      params: {
        search: 'k',
        limit: 10,
        offset: 0,
      },
      expectedError: {
        code: 422,
        message: 'Parameter Missing',
      },
    },
    costMissingOrigin: {
      description: 'Calculate cost without origin',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      body: {
        destination: '17675',
        weight: 1000,
        courier: 'jne',
      },
      expectedError: {
        code: 422,
        message: 'Missing Params',
      },
    },
    costMissingDestination: {
      description: 'Calculate cost without destination',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      body: {
        origin: '17674',
        weight: 1000,
        courier: 'jne',
      },
      expectedError: {
        code: 422,
        message: 'Missing Params',
      },
    },
    costInvalidCourier: {
      description: 'Calculate cost with invalid courier code',
      endpoint: '/calculate/domestic-cost',
      method: 'POST',
      body: {
        origin: '17674',
        destination: '17675',
        weight: 1000,
        courier: 'invalid_courier',
      },
      expectedError: {
        code: 422,
        message: 'Invalid Courier',
      },
    },
  },
}

// Available couriers according to your package
export const availableCouriers = [
  { code: 'lion', name: 'Lion Parcel' },
  { code: 'jne', name: 'JNE' },
  { code: 'sicepat', name: 'SiCepat' },
  { code: 'anteraja', name: 'AnterAja' },
]

// Real-world test data for integration testing
export const realWorldData = {
  // Origin: Your warehouse/store location
  origin: {
    id: '17674', // Kuta, Badung, Bali
    province_id: 1,
    province_name: 'Bali',
    city_id: 1,
    city_name: 'Badung',
    district_id: 2,
    district_name: 'Kuta',
    subdistrict_name: 'Kuta',
    zip_code: '80361',
  },

  // Sample destinations for testing
  destinations: [
    {
      id: '17675', // Legian, Badung, Bali (same city)
      province_id: 1,
      city_id: 1,
      district_id: 2,
      label: 'Legian, Kuta, Badung, Bali, 80361',
    },
    {
      id: '45123', // Menteng, Jakarta (different island)
      province_id: 6,
      city_id: 152,
      district_id: 1023,
      label: 'Menteng, Menteng, Jakarta Pusat, DKI Jakarta, 10310',
    },
  ],

  // Sample products with weights
  products: [
    { name: 'Pasta Golden Brown', weight: 500 }, // 500 grams
    { name: 'Pasta Blueberi', weight: 750 }, // 750 grams
    { name: 'Pasta Rum', weight: 1000 }, // 1 kg
  ],
}

// Helper functions for tests
export const testHelpers = {
  // Create URL with query parameters
  buildUrl: (base: string, params: Record<string, any>) => {
    const url = new URL(base, 'https://rajaongkir.komerce.id/api/v1')
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
    return url.toString()
  },

  // Create form data for POST requests
  buildFormData: (data: Record<string, any>) => {
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })
    return formData
  },

  // Validate response structure
  validateMetaStructure: (meta: any) => {
    return (
      meta &&
      typeof meta.message === 'string' &&
      typeof meta.code === 'number' &&
      typeof meta.status === 'string'
    )
  },

  // Validate success response
  validateSuccessResponse: (response: any) => {
    return (
      testHelpers.validateMetaStructure(response.meta) &&
      response.meta.status === 'success' &&
      response.meta.code === 200 &&
      Array.isArray(response.data)
    )
  },

  // Validate error response
  validateErrorResponse: (response: any) => {
    return (
      testHelpers.validateMetaStructure(response.meta) &&
      response.meta.status === 'error' &&
      response.data === null
    )
  },
}
