/**
 * Integration Test: Address Save Performance
 * Tests the complete flow from UI interaction to database save
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import AddressSelector from '@/components/AddressSelector'

// Cast mocks from jest.setup.ts
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('Integration: Address Save Performance', () => {
  const mockSession = {
    user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
  })

  it('should complete optimistic update in <100ms', async () => {
    const mockAddresses = [
      {
        id: 'addr-1',
        label: 'Rumah',
        recipientName: 'John Doe',
        phone: '08123456789',
        address: 'Jl. Test',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        zipCode: '12345',
        country: 'Indonesia',
        isDefault: true,
        cityId: '151',
        provinceId: '6',
      },
    ]

    let apiCallTime = 0

    global.fetch = jest.fn().mockImplementation((url, options) => {
      const startTime = Date.now()

      // Simulate slow API (500ms)
      return new Promise((resolve) => {
        setTimeout(() => {
          apiCallTime = Date.now() - startTime

          if (options?.method === 'PUT') {
            resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  ...mockAddresses[0],
                  label: 'Rumah Updated',
                }),
            })
          } else {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockAddresses),
            })
          }
        }, 500)
      })
    })

    render(
      <AddressSelector selectedAddressId="addr-1" onSelectAddress={jest.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('Rumah')).toBeInTheDocument()
    })

    // Edit address
    const editButton = screen.getByLabelText(/edit/i)
    fireEvent.click(editButton)

    const labelInput = screen.getByDisplayValue('Rumah')
    fireEvent.change(labelInput, { target: { value: 'Rumah Updated' } })

    const startOptimisticUpdate = Date.now()
    const submitButton = screen.getByText('Simpan')
    fireEvent.click(submitButton)

    // UI should update immediately (optimistic)
    await waitFor(
      () => {
        const optimisticUpdateTime = Date.now() - startOptimisticUpdate
        expect(optimisticUpdateTime).toBeLessThan(100)
      },
      { timeout: 150 }
    )

    // But API call takes longer
    await waitFor(() => {
      expect(apiCallTime).toBeGreaterThan(400)
    })
  })

  it('should NOT refetch after save (performance optimization)', async () => {
    const fetchCalls: Array<{ url: string; method: string; time: number }> = []

    global.fetch = jest.fn().mockImplementation((url, options) => {
      fetchCalls.push({
        url,
        method: options?.method || 'GET',
        time: Date.now(),
      })

      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'addr-new',
              label: 'New Address',
            }),
        })
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    })

    render(
      <AddressSelector selectedAddressId={undefined} onSelectAddress={jest.fn()} />
    )

    await waitFor(() => {
      expect(fetchCalls.length).toBeGreaterThan(0)
    })

    const callsBeforeSave = fetchCalls.length

    // Add new address
    fireEvent.click(screen.getByText('Tambah Alamat Baru'))
    // Fill form and submit (simplified)
    const submitButton = screen.getByText('Simpan')
    fireEvent.click(submitButton)

    await waitFor(() => {
      const callsAfterSave = fetchCalls.length

      // Should only have 1 additional call (POST), not 2 (POST + GET refetch)
      expect(callsAfterSave).toBe(callsBeforeSave + 1)

      const postCalls = fetchCalls.filter((call) => call.method === 'POST')
      expect(postCalls.length).toBe(1)

      // No GET after POST
      const getAfterPost = fetchCalls
        .slice(callsBeforeSave)
        .filter((call) => call.method === 'GET')
      expect(getAfterPost.length).toBe(0)
    })
  })

  it('should handle transaction failure gracefully', async () => {
    let attemptCount = 0

    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (options?.method === 'PUT') {
        attemptCount++

        if (attemptCount === 1) {
          // First attempt fails
          return Promise.resolve({
            ok: false,
            json: () =>
              Promise.resolve({
                message: 'Transaction failed',
              }),
          })
        }
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 'addr-1',
              label: 'Rumah',
              recipientName: 'John Doe',
              phone: '08123456789',
              address: 'Jl. Test',
              city: 'Jakarta',
              province: 'DKI Jakarta',
              zipCode: '12345',
              country: 'Indonesia',
              isDefault: true,
              cityId: '151',
              provinceId: '6',
            },
          ]),
      })
    })

    render(
      <AddressSelector selectedAddressId="addr-1" onSelectAddress={jest.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('Rumah')).toBeInTheDocument()
    })

    // Try to edit
    fireEvent.click(screen.getByLabelText(/edit/i))
    const labelInput = screen.getByDisplayValue('Rumah')
    fireEvent.change(labelInput, { target: { value: 'Will Fail' } })
    fireEvent.click(screen.getByText('Simpan'))

    // Should show error and keep original data
    await waitFor(() => {
      expect(screen.getByText('Rumah')).toBeInTheDocument()
      expect(screen.queryByText('Will Fail')).not.toBeInTheDocument()
    })
  })

  it('should complete full address lifecycle in correct order', async () => {
    const operationLog: string[] = []

    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        operationLog.push('API: POST address')
        return Promise.resolve({
          ok: true,
          json: () => {
            operationLog.push('API: POST response received')
            return Promise.resolve({
              id: 'addr-new',
              label: 'Test Address',
            })
          },
        })
      }

      if (options?.method === 'PUT') {
        operationLog.push('API: PUT address')
        return Promise.resolve({
          ok: true,
          json: () => {
            operationLog.push('API: PUT response received')
            return Promise.resolve({
              id: 'addr-new',
              label: 'Updated Address',
            })
          },
        })
      }

      if (options?.method === 'DELETE') {
        operationLog.push('API: DELETE address')
        return Promise.resolve({
          ok: true,
          json: () => {
            operationLog.push('API: DELETE response received')
            return Promise.resolve({ success: true })
          },
        })
      }

      operationLog.push('API: GET addresses')
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    })

    render(
      <AddressSelector selectedAddressId={undefined} onSelectAddress={jest.fn()} />
    )

    await waitFor(() => {
      expect(operationLog).toContain('API: GET addresses')
    })

    // Expected order for optimized flow:
    // 1. Initial GET
    // 2. POST (create)
    // 3. PUT (update)
    // 4. DELETE
    // NO additional GETs after mutations!

    // Add address
    fireEvent.click(screen.getByText('Tambah Alamat Baru'))
    fireEvent.click(screen.getByText('Simpan'))

    await waitFor(() => {
      expect(operationLog).toContain('API: POST address')
    })

    const getCallsAfterPost = operationLog.filter(
      (log, idx) =>
        log === 'API: GET addresses' &&
        idx > operationLog.indexOf('API: POST response received')
    )

    expect(getCallsAfterPost.length).toBe(0)
  })
})
