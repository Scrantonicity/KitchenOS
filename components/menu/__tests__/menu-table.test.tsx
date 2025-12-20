import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MenuTable } from '../menu-table'
import type { Dish } from '@/lib/types/supabase'

// Mock the API hooks
jest.mock('@/hooks/use-menu-items', () => ({
  useMenuItems: () => ({
    data: undefined,
    isLoading: false,
  }),
  useDeactivateMenuItem: () => ({
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

const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'קובנה',
    unit_type: 'weight',
    price_per_unit: 15.5,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'חלה',
    unit_type: 'unit',
    price_per_unit: 8.0,
    is_active: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

describe('MenuTable', () => {
  it('renders table headers in Hebrew', () => {
    render(<MenuTable initialData={[]} />, { wrapper: createWrapper() })

    expect(screen.getByText(/שם הפריט/i)).toBeInTheDocument()
    expect(screen.getByText(/סוג יחידה/i)).toBeInTheDocument()
    expect(screen.getByText(/מחיר/i)).toBeInTheDocument()
    expect(screen.getByText(/סטטוס/i)).toBeInTheDocument()
    expect(screen.getByText(/פעולות/i)).toBeInTheDocument()
  })

  it('displays menu items from initial data', () => {
    render(<MenuTable initialData={mockDishes} />, { wrapper: createWrapper() })

    expect(screen.getByText('קובנה')).toBeInTheDocument()
    expect(screen.getByText('חלה')).toBeInTheDocument()
    expect(screen.getByText('₪15.50')).toBeInTheDocument()
    expect(screen.getByText('₪8.00')).toBeInTheDocument()
  })

  it('shows unit type in Hebrew', () => {
    render(<MenuTable initialData={mockDishes} />, { wrapper: createWrapper() })

    const unitCells = screen.getAllByText(/יחידה|משקל/i)
    expect(unitCells.length).toBeGreaterThan(0)
  })

  it('shows status in Hebrew', () => {
    render(<MenuTable initialData={mockDishes} />, { wrapper: createWrapper() })

    expect(screen.getByText(/פעיל/i)).toBeInTheDocument()
    expect(screen.getByText(/לא פעיל/i)).toBeInTheDocument()
  })

  it('renders add button', () => {
    render(<MenuTable initialData={[]} />, { wrapper: createWrapper() })

    expect(
      screen.getByRole('button', { name: /הוסף פריט חדש/i })
    ).toBeInTheDocument()
  })

  it('shows empty state message when no items', () => {
    render(<MenuTable initialData={[]} />, { wrapper: createWrapper() })

    expect(
      screen.getByText(/אין פריטים בתפריט/i)
    ).toBeInTheDocument()
  })

  it('opens dialog when add button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuTable initialData={[]} />, { wrapper: createWrapper() })

    const addButton = screen.getByRole('button', { name: /הוסף פריט חדש/i })
    await user.click(addButton)

    expect(screen.getByText(/שם הפריט/i)).toBeInTheDocument()
  })

  it('applies opacity to inactive items', () => {
    const { container } = render(<MenuTable initialData={mockDishes} />, {
      wrapper: createWrapper(),
    })

    const inactiveRow = container.querySelector('.opacity-50')
    expect(inactiveRow).toBeInTheDocument()
  })
})
