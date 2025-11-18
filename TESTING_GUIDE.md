# Test Manual: Address Save Optimization

##  Test Suite Overview

Test suite untuk memverifikasi optimasi penyimpanan alamat berfungsi dengan baik.

### Test Files Created:

1. **`__tests__/components/AddressSelector.test.tsx`**
   - Component-level tests untuk optimistic updates
   - Coverage: Create, Update, Delete, Double submit prevention

2. **`__tests__/api/addresses.test.ts`**
   - API endpoint tests untuk transaction logic
   - Coverage: POST, PUT, DELETE dengan transaction

3. **`__tests__/integration/address-performance.test.tsx`**
   - End-to-end performance tests
   - Coverage: Latency, No refetch, Error handling

##  Setup (Manual - karena disk penuh)

Karena disk penuh, install testing dependencies secara manual nanti:

```bash
# Install Jest dan React Testing Library
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install Next.js Jest config
npm install -D @types/jest

# Update package.json scripts
```

##  Test Coverage

### 1. Optimistic Updates Tests

**File**: `__tests__/components/AddressSelector.test.tsx`

#### Test Cases:

 **Create Address - Optimistic Add**
- Verifies new address appears in UI immediately
- Checks toast notification shown
- Ensures NO refetch after save

 **Update Address - Optimistic Update**
- Verifies UI updates before API response
- Checks correct toast message
- Ensures state updated correctly

 **Delete Address - Optimistic Removal**
- Verifies address removed from UI immediately
- Checks rollback on failure
- Ensures next address selected if default deleted

 **Prevent Double Submit**
- Verifies only one API call made on double click
- Checks `isSaving` state prevents race conditions

### 2. API Transaction Tests

**File**: `__tests__/api/addresses.test.ts`

#### Test Cases:

 **POST - Create with Transaction**
- Verifies transaction used for atomic operations
- Checks updateMany called when isDefault=true
- Ensures proper error handling

 **PUT - Update with Transaction**
- Verifies transaction includes both updateMany and update
- Checks `NOT: { id }` filter excludes current address
- Ensures ownership verification

 **DELETE - Remove Address**
- Verifies ownership check
- Checks proper 404 on not found
- Ensures successful deletion

 **Transaction Rollback**
- Verifies rollback on error
- Checks 500 status returned
- Ensures data integrity maintained

### 3. Performance Integration Tests

**File**: `__tests__/integration/address-performance.test.tsx`

#### Test Cases:

 **Optimistic Update Speed (<100ms)**
- Measures UI update latency
- Verifies perceived performance
- Ensures user sees immediate feedback

 **NO Refetch After Save**
- Tracks all fetch calls
- Verifies only 1 POST/PUT, no GET refetch
- Ensures network optimization

 **Transaction Failure Handling**
- Simulates API error
- Verifies UI rollback
- Checks error toast shown

 **Full Lifecycle Order**
- Logs all operations
- Verifies correct sequence: GET → POST → PUT → DELETE
- Ensures no unexpected GETs

##  Running Tests

### Individual Test Files:

```bash
# Component tests
npm test -- AddressSelector.test.tsx

# API tests
npm test -- addresses.test.ts

# Integration tests
npm test -- address-performance.test.tsx
```

### Run All Tests:

```bash
npm test
```

### Watch Mode:

```bash
npm test -- --watch
```

### Coverage Report:

```bash
npm test -- --coverage
```

##  Expected Results

### Performance Benchmarks:

| Metric | Expected | Test Verification |
|--------|----------|-------------------|
| Optimistic Update | <100ms |  address-performance.test.tsx |
| API Calls per Save | 1 (no refetch) |  address-performance.test.tsx |
| Transaction Atomicity | Pass |  addresses.test.ts |
| Double Submit Prevention | Blocked |  AddressSelector.test.tsx |
| Error Rollback | Restored |  AddressSelector.test.tsx |

### Coverage Targets:

```
Statements   : 70% minimum
Branches     : 60% minimum
Functions    : 70% minimum
Lines        : 70% minimum
```

## 🐛 Common Issues & Solutions

### Issue 1: Disk Space Full
**Symptom**: Cannot install test dependencies
**Solution**: Clear npm cache or free disk space
```bash
npm cache clean --force
# Or clear some files
```

### Issue 2: TypeScript Errors
**Symptom**: Type errors in test files
**Solution**: Ensure `@types/jest` installed and jest.config.ts configured

### Issue 3: Mock Not Working
**Symptom**: Tests fail with "Cannot find module"
**Solution**: Check moduleNameMapper in jest.config.ts matches your aliases

##  Test Scenarios

### Scenario 1: Normal Flow
1. User loads checkout page
2. User clicks "Edit" on address
3. User changes label to "Rumah Baru"
4. User clicks "Simpan"
5. **Expected**: UI updates immediately, toast shows success

### Scenario 2: Network Error
1. User tries to save address
2. Network fails (500 error)
3. **Expected**: Original data restored, error toast shown

### Scenario 3: Double Click
1. User clicks "Simpan" twice quickly
2. **Expected**: Only one API call made, button disabled during save

### Scenario 4: Set as Default
1. User creates new address with isDefault=true
2. **Expected**: Transaction unsets other defaults first, then creates new

##  Key Testing Principles

1. **Test User Experience**: Focus on what user sees/experiences
2. **Test Performance**: Measure actual latency
3. **Test Edge Cases**: Errors, race conditions, network issues
4. **Test Atomicity**: Ensure transactions work correctly
5. **Test Optimization**: Verify NO redundant fetches

##  Reference

- Jest Docs: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- Next.js Testing: https://nextjs.org/docs/testing

---

**Status**:  Test Suite Created  
**Ready to Run**: After installing dependencies  
**Expected Pass Rate**: 100%
