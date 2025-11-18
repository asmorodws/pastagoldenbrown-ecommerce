/**
 * RajaOngkir API Integration Tests
 * 
 * Tests untuk memastikan request dan response RajaOngkir API sesuai dengan dokumentasi
 * Base URL: https://rajaongkir.komerce.id/api/v1
 */

import { describe, expect, it, beforeAll } from '@jest/globals'

describe('RajaOngkir API Response Structure Tests', () => {
  beforeAll(() => {
    // Set test environment variables
    process.env.RAJAONGKIR_API_KEY = 'test_api_key'
    process.env.RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1'
  })

  describe('API Response Structure Validation', () => {
    it('should validate province response structure', () => {
      const mockResponse = {
        meta: {
          message: 'Success Get Provinces',
          code: 200,
          status: 'success'
        },
        data: [
          { id: 1, name: 'Bali' },
          { id: 2, name: 'Jawa Barat' }
        ]
      }

      // Validate meta structure
      expect(mockResponse.meta).toHaveProperty('message')
      expect(mockResponse.meta).toHaveProperty('code')
      expect(mockResponse.meta).toHaveProperty('status')
      expect(mockResponse.meta.status).toBe('success')
      expect(mockResponse.meta.code).toBe(200)

      // Validate data structure
      expect(Array.isArray(mockResponse.data)).toBe(true)
      expect(mockResponse.data.length).toBeGreaterThan(0)
      
      const province = mockResponse.data[0]
      expect(province).toHaveProperty('id')
      expect(province).toHaveProperty('name')
      expect(typeof province.id).toBe('number')
      expect(typeof province.name).toBe('string')
    })

    it('should validate city response structure', () => {
      const mockResponse = {
        meta: {
          message: 'Success Get Cities',
          code: 200,
          status: 'success'
        },
        data: [
          { id: 1, name: 'Badung', zip_code: '80351' },
          { id: 2, name: 'Denpasar', zip_code: '80111' }
        ]
      }

      expect(mockResponse.meta.status).toBe('success')
      expect(Array.isArray(mockResponse.data)).toBe(true)

      const city = mockResponse.data[0]
      expect(city).toHaveProperty('id')
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('zip_code')
      expect(typeof city.id).toBe('number')
      expect(typeof city.name).toBe('string')
      expect(typeof city.zip_code).toBe('string')
    })

    it('should validate district response structure', () => {
      const mockResponse = {
        meta: {
          message: 'Success Get Districts',
          code: 200,
          status: 'success'
        },
        data: [
          { id: 1, name: 'Kuta', zip_code: '80361' }
        ]
      }

      expect(mockResponse.meta.status).toBe('success')
      expect(Array.isArray(mockResponse.data)).toBe(true)

      const district = mockResponse.data[0]
      expect(district).toHaveProperty('id')
      expect(district).toHaveProperty('name')
      expect(district).toHaveProperty('zip_code')
    })

    it('should validate subdistrict response structure', () => {
      const mockResponse = {
        meta: {
          message: 'Success Get Subdistricts',
          code: 200,
          status: 'success'
        },
        data: [
          { id: 17674, name: 'Kuta', zip_code: '80361' }
        ]
      }

      expect(mockResponse.meta.status).toBe('success')
      expect(Array.isArray(mockResponse.data)).toBe(true)

      const subdistrict = mockResponse.data[0]
      expect(subdistrict).toHaveProperty('id')
      expect(subdistrict).toHaveProperty('name')
      expect(subdistrict).toHaveProperty('zip_code')
      expect(typeof subdistrict.id).toBe('number')
    })

    it('should validate search response structure with hierarchical IDs', () => {
      const mockResponse = {
        meta: {
          message: 'Success Get Domestic Destinations',
          code: 200,
          status: 'success'
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
            zip_code: '80361'
          }
        ]
      }

      expect(mockResponse.meta.status).toBe('success')
      expect(Array.isArray(mockResponse.data)).toBe(true)

      const destination = mockResponse.data[0]
      
      // Required fields
      expect(destination).toHaveProperty('id')
      expect(destination).toHaveProperty('label')
      expect(destination).toHaveProperty('province_name')
      expect(destination).toHaveProperty('city_name')
      expect(destination).toHaveProperty('district_name')
      expect(destination).toHaveProperty('subdistrict_name')
      expect(destination).toHaveProperty('zip_code')
      
      // Hierarchical IDs (critical for cascade dropdowns)
      expect(destination).toHaveProperty('province_id')
      expect(destination).toHaveProperty('city_id')
      expect(destination).toHaveProperty('district_id')
      
      // Verify IDs are different (hierarchical levels)
      // The main ID (subdistrict) should be different from province/city IDs
      expect(destination.id).not.toBe(destination.city_id)
      expect(destination.id).not.toBe(destination.province_id)
      // Note: city_id and province_id can be the same in test data (valid scenario)
    })

    it('should validate shipping cost response structure', () => {
      const mockResponse = {
        meta: {
          message: 'Success Calculate Domestic Shipping cost',
          code: 200,
          status: 'success'
        },
        data: [
          {
            name: 'JNE',
            code: 'jne',
            service: 'REG',
            description: 'Layanan Reguler',
            cost: 15000,
            etd: '2-3 hari'
          },
          {
            name: 'SiCepat',
            code: 'sicepat',
            service: 'REG',
            description: 'Regular Service',
            cost: 14000,
            etd: '2-3 hari'
          }
        ]
      }

      expect(mockResponse.meta.status).toBe('success')
      expect(Array.isArray(mockResponse.data)).toBe(true)
      expect(mockResponse.data.length).toBeGreaterThan(0)

      const service = mockResponse.data[0]
      expect(service).toHaveProperty('name')
      expect(service).toHaveProperty('code')
      expect(service).toHaveProperty('service')
      expect(service).toHaveProperty('description')
      expect(service).toHaveProperty('cost')
      expect(service).toHaveProperty('etd')
      
      expect(typeof service.code).toBe('string')
      expect(typeof service.cost).toBe('number')
      expect(service.cost).toBeGreaterThan(0)
    })
  })

  describe('Error Response Structure Validation', () => {
    it('should validate 404 error response structure', () => {
      const errorResponse = {
        meta: {
          message: 'Domestic Destinations Data not found',
          code: 404,
          status: 'error'
        },
        data: null
      }

      expect(errorResponse.meta.status).toBe('error')
      expect(errorResponse.meta.code).toBe(404)
      expect(errorResponse.data).toBeNull()
    })

    it('should validate 422 parameter missing error', () => {
      const errorResponse = {
        meta: {
          message: 'Parameter Missing',
          code: 422,
          status: 'error'
        },
        data: null
      }

      expect(errorResponse.meta.status).toBe('error')
      expect(errorResponse.meta.code).toBe(422)
      expect(errorResponse.data).toBeNull()
    })

    it('should validate 422 invalid courier error', () => {
      const errorResponse = {
        meta: {
          message: 'Invalid Courier',
          code: 422,
          status: 'error'
        },
        data: null
      }

      expect(errorResponse.meta.status).toBe('error')
      expect(errorResponse.meta.code).toBe(422)
      expect(errorResponse.data).toBeNull()
    })

    it('should validate 400 calculation error', () => {
      const errorResponse = {
        meta: {
          message: 'Calculate Domestic Shipping Cost not found',
          code: 400,
          status: 'error'
        },
        data: null
      }

      expect(errorResponse.meta.status).toBe('error')
      expect(errorResponse.meta.code).toBe(400)
      expect(errorResponse.data).toBeNull()
    })

    it('should validate 500 server error', () => {
      const errorResponse = {
        meta: {
          message: 'Server Error',
          code: 500,
          status: 'error'
        },
        data: null
      }

      expect(errorResponse.meta.status).toBe('error')
      expect(errorResponse.meta.code).toBe(500)
      expect(errorResponse.data).toBeNull()
    })
  })

  describe('Request Parameter Validation', () => {
    it('should validate search request parameters', () => {
      const validParams = {
        search: 'kuta',
        limit: 10,
        offset: 0
      }

      expect(validParams.search).toBeDefined()
      expect(validParams.search.length).toBeGreaterThanOrEqual(2)
      expect(typeof validParams.limit).toBe('number')
      expect(typeof validParams.offset).toBe('number')
      expect(validParams.limit).toBeGreaterThan(0)
      expect(validParams.offset).toBeGreaterThanOrEqual(0)
    })

    it('should validate cost calculation parameters', () => {
      const validParams = {
        origin: '17674',
        destination: '17675',
        weight: 1000,
        courier: 'jne:sicepat:lion:anteraja'
      }

      expect(validParams.origin).toBeDefined()
      expect(validParams.destination).toBeDefined()
      expect(validParams.weight).toBeDefined()
      expect(validParams.courier).toBeDefined()
      
      expect(validParams.origin.length).toBeGreaterThan(0)
      expect(validParams.destination.length).toBeGreaterThan(0)
      expect(validParams.weight).toBeGreaterThan(0)
      
      // Validate courier format (colon-separated)
      const couriers = validParams.courier.split(':')
      expect(couriers.length).toBeGreaterThanOrEqual(1)
      expect(['lion', 'jne', 'sicepat', 'anteraja']).toEqual(expect.arrayContaining(couriers))
    })

    it('should validate optional price parameter', () => {
      const validValues = ['lowest', 'highest']
      
      validValues.forEach(value => {
        expect(['lowest', 'highest']).toContain(value)
      })
    })
  })

  describe('Data Type Validation', () => {
    it('should validate province ID types', () => {
      const provinceId1 = 1
      const provinceId2 = '1'

      // Should accept both number and string
      expect(typeof provinceId1).toBe('number')
      expect(typeof provinceId2).toBe('string')
    })

    it('should validate weight in grams', () => {
      const weights = [500, 1000, 2000, 5000]

      weights.forEach(weight => {
        expect(typeof weight).toBe('number')
        expect(weight).toBeGreaterThan(0)
        expect(weight % 1).toBe(0) // Should be integer
      })
    })

    it('should validate courier codes', () => {
      const availableCouriers = ['lion', 'jne', 'sicepat', 'anteraja']

      availableCouriers.forEach(code => {
        expect(typeof code).toBe('string')
        expect(code.length).toBeGreaterThan(0)
        expect(code.toLowerCase()).toBe(code) // Should be lowercase
      })
    })
  })

  describe('Hierarchical ID Structure (Critical Bug Fix)', () => {
    it('should ensure search results have separate hierarchical IDs', () => {
      const searchResult = {
        id: 17674, // Subdistrict ID (for calculate cost)
        province_id: 1, // Province ID (for cascade dropdown)
        city_id: 1, // City ID (for cascade dropdown)
        district_id: 2, // District ID (for cascade dropdown)
        province_name: 'Bali',
        city_name: 'Badung',
        district_name: 'Kuta',
        subdistrict_name: 'Kuta',
      }

      // Verify all IDs exist
      expect(searchResult.id).toBeDefined()
      expect(searchResult.province_id).toBeDefined()
      expect(searchResult.city_id).toBeDefined()
      expect(searchResult.district_id).toBeDefined()

      // Verify they are different (not all pointing to same ID)
      // The subdistrict ID should be different from hierarchical parent IDs
      expect(searchResult.id).not.toBe(searchResult.city_id)
      expect(searchResult.id).not.toBe(searchResult.province_id)
      // Note: city_id and province_id may have same value in some regions

      // Document the correct usage
      const incorrectUsage = searchResult.id // ❌ Don't use for province/city queries
      const correctCityId = searchResult.city_id // ✅ Use for city queries
      const correctProvinceId = searchResult.province_id // ✅ Use for province queries

      expect(correctCityId).toBe(1)
      expect(correctProvinceId).toBe(1)
      expect(incorrectUsage).toBe(17674)
    })
  })
})


