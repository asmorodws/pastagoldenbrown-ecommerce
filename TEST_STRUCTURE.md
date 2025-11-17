# Test Structure Visualization

```
ecommerce/
│
├── __tests__/
│   ├── components/
│   │   └── AddressSelector.test.tsx          [250+ lines]
│   │       ├── ✅ Optimistic Add (create)
│   │       ├── ✅ Optimistic Update (edit)
│   │       ├── ✅ Optimistic Delete (remove)
│   │       ├── ✅ Rollback on Error
│   │       ├── ✅ Prevent Double Submit
│   │       └── ✅ No Refetch After Save
│   │
│   ├── api/
│   │   └── addresses.test.ts                  [280+ lines]
│   │       ├── POST /api/addresses
│   │       │   ├── ✅ Create with Transaction
│   │       │   ├── ✅ Unset Other Defaults
│   │       │   └── ✅ 401 if Unauthorized
│   │       │
│   │       ├── PUT /api/addresses/[id]
│   │       │   ├── ✅ Update with Transaction
│   │       │   ├── ✅ Exclude Current Address
│   │       │   ├── ✅ 404 if Not Found
│   │       │   └── ✅ Rollback on Error
│   │       │
│   │       └── DELETE /api/addresses/[id]
│   │           ├── ✅ Delete Successfully
│   │           └── ✅ 404 if Not Found
│   │
│   └── integration/
│       └── address-performance.test.tsx       [220+ lines]
│           ├── ✅ <100ms Optimistic Update
│           ├── ✅ No Refetch (1 call only)
│           ├── ✅ Transaction Failure
│           └── ✅ Full Lifecycle Order
│
├── jest.config.ts                             [32 lines]
│   ├── Next.js integration
│   ├── Module mapper (@/...)
│   ├── Coverage thresholds
│   └── Test environment: jsdom
│
├── jest.setup.ts                              [65 lines]
│   ├── Mock next/navigation
│   ├── Mock window.matchMedia
│   ├── Mock IntersectionObserver
│   └── Suppress console warnings
│
├── install-test-deps.sh                       [18 lines]
│   └── Install jest, @testing-library, @types/jest
│
├── TESTING_GUIDE.md                           [300+ lines]
│   ├── Test suite overview
│   ├── Setup instructions
│   ├── Test scenarios
│   └── Common issues
│
└── TEST_SUITE_README.md                       [200+ lines]
    ├── Quick summary
    ├── Coverage matrix
    ├── Performance benchmarks
    └── Success criteria
```

## Test Dependency Tree

```
jest (core)
  ├── jest-environment-jsdom
  ├── @types/jest
  └── next/jest (Next.js integration)

@testing-library/react
  ├── @testing-library/jest-dom
  └── @testing-library/user-event

Mocks:
  ├── next-auth/react (useSession)
  ├── next/navigation (useRouter)
  ├── react-hot-toast (toast)
  ├── @/lib/prisma (database)
  └── @/auth (authentication)
```

## Coverage Map

```
components/AddressSelector.tsx
  └── __tests__/components/AddressSelector.test.tsx
      ├── handleSubmit()        ✅ Tested
      ├── handleDelete()        ✅ Tested
      ├── optimistic updates    ✅ Tested
      ├── error handling        ✅ Tested
      └── double submit         ✅ Tested

app/api/addresses/route.ts
  └── __tests__/api/addresses.test.ts
      ├── POST handler          ✅ Tested
      ├── transaction logic     ✅ Tested
      └── auth check            ✅ Tested

app/api/addresses/[id]/route.ts
  └── __tests__/api/addresses.test.ts
      ├── PUT handler           ✅ Tested
      ├── DELETE handler        ✅ Tested
      ├── ownership check       ✅ Tested
      └── transaction logic     ✅ Tested

Full Flow
  └── __tests__/integration/address-performance.test.tsx
      ├── E2E performance       ✅ Tested
      ├── No refetch            ✅ Tested
      ├── Error scenarios       ✅ Tested
      └── Operation order       ✅ Tested
```

## Test Execution Flow

```
npm test
  │
  ├─> jest.config.ts loads
  │     └─> setupFilesAfterEnv: jest.setup.ts
  │           ├─> Mock next/navigation
  │           ├─> Mock window.matchMedia
  │           └─> Mock IntersectionObserver
  │
  ├─> Component Tests
  │     ├─> Render AddressSelector
  │     ├─> Simulate user actions
  │     ├─> Assert UI updates
  │     └─> Verify optimistic behavior
  │
  ├─> API Tests
  │     ├─> Mock auth() & prisma
  │     ├─> Call route handlers
  │     ├─> Assert transactions
  │     └─> Verify responses
  │
  └─> Integration Tests
        ├─> Full component render
        ├─> Measure performance
        ├─> Track API calls
        └─> Verify no refetch
```

## Performance Test Flow

```
User Action: Click "Simpan"
  │
  ├─> [T=0ms] handleSubmit called
  │     ├─> Check isSaving (prevent double)
  │     └─> Set isSaving = true
  │
  ├─> [T=5ms] Fetch API (async)
  │     └─> Transaction starts server-side
  │
  ├─> [T=10ms] Optimistic Update ✅
  │     ├─> setAddresses(updated)
  │     ├─> setShowForm(false)
  │     └─> UI reflects changes
  │
  ├─> [T=200ms] API responds
  │     ├─> Response contains saved data
  │     └─> No refetch needed
  │
  ├─> [T=205ms] Toast notification
  │     └─> "Alamat berhasil diperbarui"
  │
  └─> [T=210ms] setIsSaving = false

Expected Total: <100ms perceived, ~200ms actual
Test Verifies: UI update at <100ms ✅
```

## Mock Strategy

```
Component Layer (AddressSelector.test.tsx)
  Mock: fetch, useSession, toast
  Real: React state, UI rendering, event handling

API Layer (addresses.test.ts)
  Mock: prisma, auth
  Real: Route handlers, transaction logic, error handling

Integration Layer (address-performance.test.tsx)
  Mock: fetch (with timing)
  Real: Full component, state management, side effects
```

## Test Data Flow

```
Initial State
  └─> fetchAddresses()
      └─> GET /api/addresses
          └─> addresses = [addr1, addr2]

User Edits
  └─> handleSubmit()
      ├─> PUT /api/addresses/addr1
      │     └─> Transaction:
      │         ├─> updateMany (unset defaults)
      │         └─> update (save changes)
      │
      └─> Optimistic Update (NO REFETCH)
          ├─> setAddresses(map(addr => addr.id === id ? saved : addr))
          └─> UI updates immediately

Test Assertion
  ├─> fetchCallCount === initialCount + 1 ✅
  ├─> No GET after PUT ✅
  └─> UI shows updated data ✅
```

---

**Total Test Files**: 3  
**Total Test Cases**: ~15  
**Total Lines of Test Code**: ~750  
**Coverage Target**: 50%+  
**Expected Runtime**: 10-15 seconds
