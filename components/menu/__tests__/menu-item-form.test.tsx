import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MenuItemForm } from '../menu-item-form'
import type { Dish } from '@/lib/types/supabase'

// Mock the API hooks
jest.mock('@/hooks/use-menu-items', () => ({
  useCreateMenuItem: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useUpdateMenuItem: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('MenuItemForm', () => {
  it('renders all form fields', () => {
    render(<MenuItemForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/שם הפריט/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/סוג יחידה/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/מחיר ליחידה/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /שמור/i })).toBeInTheDocument()
  })

  it('shows Hebrew validation errors for empty name', async () => {
    const user = userEvent.setup()
    render(<MenuItemForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: /שמור/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/שם הפריט הוא שדה חובה/i)).toBeInTheDocument()
    })
  })

  it('shows Hebrew validation error for invalid price', async () => {
    const user = userEvent.setup()
    render(<MenuItemForm />, { wrapper: createWrapper() })

    const priceInput = screen.getByLabelText(/מחיר ליחידה/i)
    await user.clear(priceInput)
    await user.type(priceInput, '-5')

    const submitButton = screen.getByRole('button', { name: /שמור/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/המחיר חייב להיות מספר חיובי/i)).toBeInTheDocument()
    })
  })

  it('pre-fills form with default values in edit mode', () => {
    const defaultValues: Dish = {
      id: '123',
      name: 'קובנה',
      unit_type: 'weight',
      price_per_unit: 15.5,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    render(<MenuItemForm defaultValues={defaultValues} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByDisplayValue('קובנה')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15.5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /עדכן/i })).toBeInTheDocument()
  })

  it('handles empty price input correctly', async () => {
    const user = userEvent.setup()
    render(<MenuItemForm />, { wrapper: createWrapper() })

    const priceInput = screen.getByLabelText(/מחיר ליחידה/i)
    await user.clear(priceInput)

    const submitButton = screen.getByRole('button', { name: /שמור/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/מחיר הוא שדה חובה/i)).toBeInTheDocument()
    })
  })
})
