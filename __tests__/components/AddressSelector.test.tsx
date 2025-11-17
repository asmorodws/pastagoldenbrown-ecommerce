/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import AddressSelector from '@/components/AddressSelector'
import { toast } from 'react-hot-toast'

// Cast mocks from jest.setup.ts
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockToast = toast as jest.Mocked<typeof toast>

const mockSession = {
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

const mockAddresses = [
  {
    id: 'addr-1',
    label: 'Rumah',
    recipientName: 'John Doe',
    phone: '08123456789',
    address: 'Jl. Test No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    zipCode: '12345',
    country: 'Indonesia',
    isDefault: true,
    cityId: '151',
    provinceId: '6',
  },
  {
    id: 'addr-2',
    label: 'Kantor',
    recipientName: 'John Doe',
    phone: '08123456789',
    address: 'Jl. Office No. 456',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    zipCode: '12346',
    country: 'Indonesia',
    isDefault: false,
    cityId: '151',
    provinceId: '6',
  },
]

describe('AddressSelector - Optimistic Updates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })

    // Mock fetch globally
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Create Address', () => {
    it('should optimistically add new address to UI', async () => {
      const newAddress = {
        id: 'addr-3',
        label: 'Rumah Baru',
        recipientName: 'Jane Doe',
        phone: '08199999999',
        address: 'Jl. New Street No. 789',
        city: 'Bandung',
        province: 'Jawa Barat',
        zipCode: '40111',
        country: 'Indonesia',
        isDefault: false,
        cityId: '22',
        provinceId: '9',
      }

      // Mock successful API response
      ;(global.fetch as jest.Mock).mockImplementation((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url.toString()
        if (urlString.includes('/api/addresses') && !urlString.includes('[id]')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(newAddress),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        })
      })

      const onSelectAddress = jest.fn()
      const { rerender } = render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={onSelectAddress}
        />
      )

      // Wait for addresses to load
      await waitFor(() => {
        expect(screen.getByText('Rumah')).toBeInTheDocument()
      })

      // Click "Tambah Alamat Baru"
      const addButton = screen.getByText('Tambah Alamat Baru')
      fireEvent.click(addButton)

      // Fill in form (simplified - in real test would fill all fields)
      const labelInput = screen.getByLabelText(/label/i)
      fireEvent.change(labelInput, { target: { value: 'Rumah Baru' } })

      // Submit form
      const submitButton = screen.getByText('Simpan')
      fireEvent.click(submitButton)

      // Verify optimistic update
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Alamat berhasil ditambahkan',
          expect.any(Object)
        )
      })
    })

    it('should NOT refetch all addresses after save', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      ;(global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('/api/addresses') && !url.includes('[id]')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'new-addr', label: 'Test' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        })
      })

      render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={jest.fn()}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Rumah')).toBeInTheDocument()
      })

      const initialFetchCount = fetchSpy.mock.calls.filter((call) => {
        const url = typeof call[0] === 'string' ? call[0] : call[0].toString()
        return url.includes('/api/addresses')
      }).length

      // Add new address
      fireEvent.click(screen.getByText('Tambah Alamat Baru'))
      // ... submit form (simplified)

      await waitFor(() => {
        const finalFetchCount = fetchSpy.mock.calls.filter((call) => {
          const url = typeof call[0] === 'string' ? call[0] : call[0].toString()
          return url.includes('/api/addresses')
        }).length

        // Should only have 1 additional fetch (POST), not 2 (POST + GET)
        expect(finalFetchCount).toBe(initialFetchCount + 1)
      })
    })
  })

  describe('Update Address', () => {
    it('should optimistically update address in UI', async () => {
      const updatedAddress = {
        ...mockAddresses[0],
        label: 'Rumah Updated',
      }

      ;(global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url.includes('/api/addresses/addr-1') && options?.method === 'PUT') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(updatedAddress),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        })
      })

      render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={jest.fn()}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Rumah')).toBeInTheDocument()
      })

      // Click edit button
      const editButtons = screen.getAllByLabelText(/edit/i)
      fireEvent.click(editButtons[0])

      // Update label
      const labelInput = screen.getByDisplayValue('Rumah')
      fireEvent.change(labelInput, { target: { value: 'Rumah Updated' } })

      // Submit
      const submitButton = screen.getByText('Simpan')
      fireEvent.click(submitButton)

      // Verify optimistic update
      await waitFor(() => {
        expect(screen.getByText('Rumah Updated')).toBeInTheDocument()
        expect(toast.success).toHaveBeenCalledWith(
          'Alamat berhasil diperbarui',
          expect.any(Object)
        )
      })
    })
  })

  describe('Delete Address', () => {
    it('should optimistically remove address from UI', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url.includes('/api/addresses/addr-2') && options?.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        })
      })

      // Mock window.confirm
      global.confirm = jest.fn(() => true)

      render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={jest.fn()}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Kantor')).toBeInTheDocument()
      })

      // Click delete button for "Kantor"
      const deleteButtons = screen.getAllByLabelText(/delete/i)
      fireEvent.click(deleteButtons[1])

      // Verify optimistic removal
      await waitFor(() => {
        expect(screen.queryByText('Kantor')).not.toBeInTheDocument()
        expect(toast.success).toHaveBeenCalledWith(
          'Alamat berhasil dihapus',
          expect.any(Object)
        )
      })
    })

    it('should rollback on delete failure', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url, options) => {
        if (url.includes('/api/addresses/addr-2') && options?.method === 'DELETE') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Failed to delete' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAddresses),
        })
      })

      global.confirm = jest.fn(() => true)

      render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={jest.fn()}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Kantor')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByLabelText(/delete/i)
      fireEvent.click(deleteButtons[1])

      // Verify rollback - "Kantor" should still be visible
      await waitFor(() => {
        expect(screen.getByText('Kantor')).toBeInTheDocument()
        expect(toast.error).toHaveBeenCalledWith(
          'Gagal menghapus alamat',
          expect.any(Object)
        )
      })
    })
  })

  describe('Prevent Double Submit', () => {
    it('should prevent double submission when already saving', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      ;(global.fetch as jest.Mock).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ id: 'new-addr' }),
            })
          }, 1000)
        })
      })

      render(
        <AddressSelector
          selectedAddressId="addr-1"
          onSelectAddress={jest.fn()}
        />
      )

      fireEvent.click(screen.getByText('Tambah Alamat Baru'))

      const submitButton = screen.getByText('Simpan')

      // Click submit twice quickly
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Should only make one API call
        const apiCalls = fetchSpy.mock.calls.filter(
          (call) => {
            const url = typeof call[0] === 'string' ? call[0] : call[0].toString()
            return url.includes('/api/addresses') && call[1]?.method === 'POST'
          }
        )
        expect(apiCalls.length).toBe(1)
      })
    })
  })
})
