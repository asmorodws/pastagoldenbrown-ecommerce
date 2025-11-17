/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import AddressSelector from '@/components/AddressSelector'

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('AddressSelector - Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: {
        user: { 
          id: 'user-1', 
          email: 'test@example.com', 
          name: 'Test User',
          role: 'USER',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render without crashing', async () => {
    render(
      <AddressSelector
        selectedAddressId="addr-1"
        onSelectAddress={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Pilih Alamat Pengiriman')).toBeInTheDocument()
    })
  })

  it('should show add address button', async () => {
    render(
      <AddressSelector
        selectedAddressId="addr-1"
        onSelectAddress={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Tambah Alamat')).toBeInTheDocument()
    })
  })

  it('should fetch addresses on mount', async () => {
    render(
      <AddressSelector
        selectedAddressId="addr-1"
        onSelectAddress={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/addresses')
    })
  })
})
