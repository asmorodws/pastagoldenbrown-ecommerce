# RajaOngkir API Testing Suite

Comprehensive testing suite untuk RajaOngkir V2 API integration. Test suite ini memastikan request dan response sesuai dengan dokumentasi API RajaOngkir.

## 📁 File Structure

```
__tests__/
├── api/
│   ├── rajaongkir.test.ts          # Unit tests untuk lib/rajaongkir.ts functions
│   └── rajaongkir-routes.test.ts   # Integration tests untuk API routes
└── fixtures/
    └── rajaongkir-fixtures.ts      # Mock data dan test helpers
```

## 🧪 Test Coverage

### 1. **rajaongkir.test.ts** - Library Function Tests

Tests untuk fungsi-fungsi di `lib/rajaongkir.ts`:

#### GET /destination/province
- ✅ Fetch provinces successfully
- ✅ Handle API errors (500)
- ✅ Validate response meta structure
- ✅ Validate data structure (id, name)

#### GET /destination/city/{province_id}
- ✅ Fetch cities by province ID
- ✅ Handle missing province ID
- ✅ Support string and number province ID
- ✅ Validate response structure

#### GET /destination/district/{city_id}
- ✅ Fetch districts by city ID
- ✅ Handle missing city ID
- ✅ Validate response structure

#### GET /destination/sub-district/{district_id}
- ✅ Fetch subdistricts by district ID
- ✅ Handle missing district ID
- ✅ Validate response structure

#### GET /destination/domestic-destination (Search)
- ✅ Search domestic destinations
- ✅ Include limit and offset parameters
- ✅ Handle empty search query
- ✅ Handle 404 not found response
- ✅ Normalize search query (lowercase, trim)
- ✅ Validate hierarchical ID structure (province_id, city_id, district_id)

#### POST /calculate/domestic-cost
- ✅ Calculate shipping cost successfully
- ✅ Include all required parameters
- ✅ Support optional price parameter (lowest/highest)
- ✅ Use district endpoint when useDistrict=true
- ✅ Handle API errors (400, 422, 500)
- ✅ Validate courier and cost structure

#### Error Handling
- ✅ Handle network errors gracefully
- ✅ Handle invalid JSON response
- ✅ Handle missing API key

#### Response Validation
- ✅ Validate meta structure for all endpoints
- ✅ Validate error response structure
- ✅ Validate hierarchical fields in search results

### 2. **rajaongkir-routes.test.ts** - API Routes Tests

Tests untuk Next.js API routes di `app/api/rajaongkir/*`:

#### GET /api/rajaongkir/provinces
- ✅ Return provinces successfully
- ✅ Handle errors and return 500

#### GET /api/rajaongkir/cities
- ✅ Return cities for given province
- ✅ Return empty array when no province ID
- ✅ Handle errors and return 500

#### GET /api/rajaongkir/districts
- ✅ Return districts for given city
- ✅ Return empty array when no city ID
- ✅ Handle errors and return 500

#### GET /api/rajaongkir/subdistricts
- ✅ Return subdistricts for given district
- ✅ Return empty array when no district ID
- ✅ Handle errors and return 500

#### GET /api/rajaongkir/search
- ✅ Return search results successfully
- ✅ Handle custom limit and offset
- ✅ Return 400 when query too short (< 2 chars)
- ✅ Return 400 when query missing
- ✅ Handle errors and return 500

#### POST /api/rajaongkir/cost
- ✅ Calculate shipping cost successfully
- ✅ Handle optional parameters (price, useDistrict)
- ✅ Return 400 when origin missing
- ✅ Return 400 when destination missing
- ✅ Return 400 when weight missing
- ✅ Return 400 when courier missing
- ✅ Handle errors and return 500

#### Integration Tests
- ✅ Complete cascade flow: provinces → cities → districts → subdistricts
- ✅ Search location then calculate shipping cost

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run RajaOngkir Tests Only
```bash
npm test rajaongkir
```

### Run Specific Test File
```bash
npm test __tests__/api/rajaongkir.test.ts
npm test __tests__/api/rajaongkir-routes.test.ts
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## 📝 Test Data Fixtures

File `__tests__/fixtures/rajaongkir-fixtures.ts` berisi:

### Mock API Responses
- `mockApiResponses.provinces` - Response dari endpoint provinces
- `mockApiResponses.cities` - Response dari endpoint cities
- `mockApiResponses.districts` - Response dari endpoint districts
- `mockApiResponses.subdistricts` - Response dari endpoint subdistricts
- `mockApiResponses.search` - Response dari endpoint search
- `mockApiResponses.cost` - Response dari endpoint calculate cost

### Test Scenarios
- `testScenarios.validRequests` - Valid request examples
- `testScenarios.invalidRequests` - Invalid request examples dengan expected errors

### Available Couriers
```typescript
[
  { code: 'lion', name: 'Lion Parcel' },
  { code: 'jne', name: 'JNE' },
  { code: 'sicepat', name: 'SiCepat' },
  { code: 'anteraja', name: 'AnterAja' },
]
```

### Real World Data
- `realWorldData.origin` - Origin location (Kuta, Bali)
- `realWorldData.destinations` - Sample destinations
- `realWorldData.products` - Sample products dengan weights

### Test Helpers
- `testHelpers.buildUrl()` - Build URL dengan query parameters
- `testHelpers.buildFormData()` - Build form data untuk POST requests
- `testHelpers.validateMetaStructure()` - Validate response meta
- `testHelpers.validateSuccessResponse()` - Validate success response
- `testHelpers.validateErrorResponse()` - Validate error response

## 🔑 API Documentation Reference

### Base URL
```
https://rajaongkir.komerce.id/api/v1
```

### Authentication
Header yang diperlukan:
```
key: your_api_key_here
```

### Endpoints Tested

1. **GET /destination/province**
   - Retrieves all provinces
   - Response: Array of provinces with id and name

2. **GET /destination/city/{province_id}**
   - Retrieves cities in a province
   - Response: Array of cities with id, name, zip_code

3. **GET /destination/district/{city_id}**
   - Retrieves districts in a city
   - Response: Array of districts with id, name, zip_code

4. **GET /destination/sub-district/{district_id}**
   - Retrieves subdistricts in a district
   - Response: Array of subdistricts with id, name, zip_code

5. **GET /destination/domestic-destination?search={query}&limit={limit}&offset={offset}**
   - Search for locations
   - Response: Array of locations with hierarchical data (province, city, district, subdistrict)

6. **POST /calculate/domestic-cost**
   - Calculate shipping cost
   - Body: origin, destination, weight, courier
   - Response: Array of courier services with costs

### Response Structure

#### Success Response
```json
{
  "meta": {
    "message": "Success message",
    "code": 200,
    "status": "success"
  },
  "data": [...]
}
```

#### Error Response
```json
{
  "meta": {
    "message": "Error message",
    "code": 400|404|422|500,
    "status": "error"
  },
  "data": null
}
```

### Error Codes
- `200` - Success
- `400` - Bad Request / Calculate not found
- `404` - Data not found
- `422` - Parameter Missing / Invalid Courier
- `500` - Server Error

## 🐛 Critical Bug Fixes Covered

### Hierarchical ID Mapping Bug
Test memastikan bahwa search API mengembalikan ID yang benar:
- `id` - Subdistrict level ID (untuk calculate cost)
- `province_id` - Province level ID (untuk cascade dropdown)
- `city_id` - City level ID (untuk cascade dropdown)
- `district_id` - District level ID (untuk cascade dropdown)

**Important**: Jangan gunakan `destination.id` untuk query cities/districts, gunakan `city_id`/`province_id` yang sesuai.

## ✅ Test Requirements

### Required Environment Variables
```env
RAJAONGKIR_API_KEY=your_api_key_here
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
```

### Dependencies
- Jest
- @testing-library/jest-dom
- node-fetch (untuk mocking)

## 📊 Expected Test Results

All tests should pass:
```
 PASS  __tests__/api/rajaongkir.test.ts
 PASS  __tests__/api/rajaongkir-routes.test.ts

Test Suites: 2 passed, 2 total
Tests:       50+ passed, 50+ total
Snapshots:   0 total
Time:        2.5s
```

## 🔍 Test Implementation Details

### Mocking Strategy
1. **Library tests** (`rajaongkir.test.ts`):
   - Mock `fetch` global function
   - Return mock responses dari fixtures
   - Test actual library function logic

2. **Route tests** (`rajaongkir-routes.test.ts`):
   - Mock `@/lib/rajaongkir` module
   - Test Next.js route handler logic
   - Verify request/response handling

### Test Isolation
- `beforeEach()` clears all mocks
- Each test is independent
- No shared state between tests

### Coverage Goals
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 🚨 Common Issues & Solutions

### Issue: API Key Not Found
```
Solution: Set RAJAONGKIR_API_KEY in .env.local or .env.test
```

### Issue: Tests Timeout
```
Solution: Increase Jest timeout in jest.config.ts
```

### Issue: Mock Not Working
```
Solution: Clear mocks in beforeEach() dan verify mock implementation
```

## 📚 Related Documentation

- [RajaOngkir V2 API Documentation](https://rajaongkir.komerce.id/documentation)
- [RAJAONGKIR_V2_MIGRATION.md](../RAJAONGKIR_V2_MIGRATION.md)
- [RAJAONGKIR_INTEGRATION.md](../RAJAONGKIR_INTEGRATION.md)
- [TESTING_GUIDE.md](../TESTING_GUIDE.md)

## 🤝 Contributing

Saat menambahkan fitur baru yang menggunakan RajaOngkir API:

1. Tambahkan mock response di `rajaongkir-fixtures.ts`
2. Tambahkan unit test di `rajaongkir.test.ts`
3. Tambahkan route test di `rajaongkir-routes.test.ts`
4. Update dokumentasi ini

## ✨ Best Practices

1. **Always validate response structure** - Jangan assume response format
2. **Test error cases** - Network errors, API errors, invalid data
3. **Use fixtures** - Centralize mock data untuk consistency
4. **Test hierarchical data** - Verify ID mappings untuk cascade dropdowns
5. **Test edge cases** - Empty strings, null values, missing parameters
