import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import NewOrderPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

const mockDishes = [
  {
    id: '1',
    name: 'חומוס',
    unit_type: 'unit',
    price_per_unit: 25,
    is_active: true,
  },
  {
    id: '2',
    name: 'פלאפל',
    unit_type: 'unit',
    price_per_unit: 20,
    is_active: true,
  },
]

describe('NewOrderPage Integration', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/menu') {
        return Promise.resolve({
          ok: true,
          json: async () => mockDishes,
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ order_number: 'ORD-001' }),
      })
    })
  })

  it('renders order form with all sections', async () => {
    render(<NewOrderPage />)

    // Breadcrumbs
    expect(screen.getByText('ניהול')).toBeInTheDocument()
    expect(screen.getByText('הזמנות')).toBeInTheDocument()
    expect(screen.getByText('הזמנה חדשה')).toBeInTheDocument()

    // Page title
    expect(screen.getByRole('heading', { name: /הזמנה חדשה/i })).toBeInTheDocument()

    // Customer details section
    expect(screen.getByLabelText(/שם הלקוח/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/טלפון/i)).toBeInTheDocument()

    // Menu items section
    await waitFor(() => {
      expect(screen.getByText(/בחר פריט מהתפריט/i)).toBeInTheDocument()
    })

    // Submit button
    expect(screen.getByRole('button', { name: /שמור הזמנה/i })).toBeInTheDocument()
  })

  it('submit button is disabled when no items are added', async () => {
    render(<NewOrderPage />)

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
      expect(submitButton).toBeDisabled()
    })
  })

  it('enables submit button when items are added', async () => {
    const user = userEvent.setup()
    render(<NewOrderPage />)

    // Wait for menu to load
    await waitFor(() => {
      expect(screen.getByText(/בחר פריט מהתפריט/i)).toBeInTheDocument()
    })

    // Open menu selector and select item
    const menuTrigger = screen.getByRole('combobox')
    await user.click(menuTrigger)

    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })

    await user.click(screen.getByText('חומוס'))

    // Submit button should now be enabled
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('shows selected item in order summary', async () => {
    const user = userEvent.setup()
    render(<NewOrderPage />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    // Select an item
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Check order summary
    await waitFor(() => {
      expect(screen.getByText(/סיכום הזמנה/i)).toBeInTheDocument()
      expect(screen.getAllByText('חומוס')[0]).toBeInTheDocument() // In summary
      expect(screen.getByText(/סה"כ פריטים: 1/i)).toBeInTheDocument()
      expect(screen.getByText(/סה"כ: ₪25\.00/i)).toBeInTheDocument()
    })
  })

  it('increments quantity when same item is selected twice', async () => {
    const user = userEvent.setup()
    render(<NewOrderPage />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    // Select חומוס first time
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Select חומוס second time
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Should show quantity 2
    await waitFor(() => {
      const quantityInput = screen.getByLabelText(/כמות/i) as HTMLInputElement
      expect(quantityInput.value).toBe('2')
      expect(screen.getByText(/סה"כ פריטים: 2/i)).toBeInTheDocument()
      expect(screen.getByText(/סה"כ: ₪50\.00/i)).toBeInTheDocument()
    })
  })

  it('allows adding multiple different items', async () => {
    const user = userEvent.setup()
    render(<NewOrderPage />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    // Add חומוס
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Add פלאפל
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('פלאפל')).toBeInTheDocument()
    })
    await user.click(screen.getByText('פלאפל'))

    // Check both items in summary
    await waitFor(() => {
      expect(screen.getAllByText('חומוס')[0]).toBeInTheDocument()
      expect(screen.getAllByText('פלאפל')[0]).toBeInTheDocument()
      expect(screen.getByText(/סה"כ פריטים: 2/i)).toBeInTheDocument()
      expect(screen.getByText(/סה"כ: ₪45\.00/i)).toBeInTheDocument() // 25 + 20
    })
  })

  it('removes item when X button is clicked', async () => {
    const user = userEvent.setup()
    render(<NewOrderPage />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    // Add item
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Remove item
    await waitFor(() => {
      const removeButton = screen.getByLabelText(/הסר חומוס/i)
      expect(removeButton).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText(/הסר חומוס/i))

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText(/טרם נוספו פריטים/i)).toBeInTheDocument()
    })
  })

  it('validates at least one item before submission', async () => {
    const { toast } = require('sonner')
    const user = userEvent.setup()
    render(<NewOrderPage />)

    // Fill customer details
    await user.type(screen.getByLabelText(/שם הלקוח/i), 'ישראל ישראלי')
    await user.type(screen.getByLabelText(/טלפון/i), '0501234567')

    // Try to submit without items - button should be disabled
    const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
    expect(submitButton).toBeDisabled()
  })

  it('submits order successfully with valid data', async () => {
    const { toast } = require('sonner')
    const user = userEvent.setup()

    // Mock successful API response
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/menu') {
        return Promise.resolve({
          ok: true,
          json: async () => mockDishes,
        })
      }
      if (url === '/api/orders') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ order_number: 'ORD-123' }),
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })

    render(<NewOrderPage />)

    // Fill form
    await user.type(screen.getByLabelText(/שם הלקוח/i), 'ישראל ישראלי')
    await user.type(screen.getByLabelText(/טלפון/i), '0501234567')

    // Add item
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Submit
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
      expect(submitButton).not.toBeDisabled()
    })
    await user.click(screen.getByRole('button', { name: /שמור הזמנה/i }))

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    // Verify success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'ההזמנה נוצרה בהצלחה',
        expect.objectContaining({
          description: 'מספר הזמנה: ORD-123',
        })
      )
    })

    // Verify navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/orders')
    })
  })

  it('shows error toast when API call fails', async () => {
    const { toast } = require('sonner')
    const user = userEvent.setup()

    // Mock failed API response
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/menu') {
        return Promise.resolve({
          ok: true,
          json: async () => mockDishes,
        })
      }
      if (url === '/api/orders') {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Database error' }),
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })

    render(<NewOrderPage />)

    // Fill form and add item
    await user.type(screen.getByLabelText(/שם הלקוח/i), 'ישראל ישראלי')
    await user.type(screen.getByLabelText(/טלפון/i), '0501234567')

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Submit
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
      expect(submitButton).not.toBeDisabled()
    })
    await user.click(screen.getByRole('button', { name: /שמור הזמנה/i }))

    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'שגיאה ביצירת הזמנה',
        expect.objectContaining({
          description: 'Database error',
        })
      )
    })

    // Should NOT navigate
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()

    // Mock slow API response
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/menu') {
        return Promise.resolve({
          ok: true,
          json: async () => mockDishes,
        })
      }
      if (url === '/api/orders') {
        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ order_number: 'ORD-123' }),
              }),
            100
          )
        )
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })

    render(<NewOrderPage />)

    // Fill form and add item
    await user.type(screen.getByLabelText(/שם הלקוח/i), 'ישראל ישראלי')
    await user.type(screen.getByLabelText(/טלפון/i), '0501234567')

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Submit
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /שמור הזמנה/i })
      expect(submitButton).not.toBeDisabled()
    })
    await user.click(screen.getByRole('button', { name: /שמור הזמנה/i }))

    // Should show loading text
    expect(screen.getByText(/שומר.../i)).toBeInTheDocument()

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/שומר.../i)).not.toBeInTheDocument()
    })
  })

  it('cancel button resets form and navigates to orders', async () => {
    const user = userEvent.setup()

    // Mock window.confirm
    global.confirm = jest.fn(() => true)

    render(<NewOrderPage />)

    // Fill form
    await user.type(screen.getByLabelText(/שם הלקוח/i), 'ישראל ישראלי')

    // Add item
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByText('חומוס')).toBeInTheDocument()
    })
    await user.click(screen.getByText('חומוס'))

    // Click cancel
    await user.click(screen.getByRole('button', { name: /ביטול/i }))

    // Should ask for confirmation
    expect(global.confirm).toHaveBeenCalled()

    // Should navigate to orders
    expect(mockPush).toHaveBeenCalledWith('/admin/orders')
  })
})
