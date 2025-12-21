import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItemSelector } from '../MenuItemSelector'

// Mock fetch
global.fetch = jest.fn()

const mockDishes = [
  {
    id: '1',
    name: 'חומוס',
    unit_type: 'unit' as const,
    price_per_unit: 25,
    is_active: true,
  },
  {
    id: '2',
    name: 'פלאפל',
    unit_type: 'unit' as const,
    price_per_unit: 20,
    is_active: true,
  },
  {
    id: '3',
    name: 'סלט ירקות',
    unit_type: 'weight' as const,
    price_per_unit: 15,
    is_active: true,
  },
  {
    id: '4',
    name: 'לא פעיל',
    unit_type: 'unit' as const,
    price_per_unit: 10,
    is_active: false,
  },
]

describe('MenuItemSelector', () => {
  const mockOnSelectItem = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDishes,
    })
  })

  it('shows loading state initially', () => {
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)
    expect(screen.getByText(/טוען תפריט.../i)).toBeInTheDocument()
  })

  it('fetches and displays active dishes only', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText(/בחר פריט מהתפריט/i)).toBeInTheDocument()
    })

    // Open dropdown
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    // Should show active dishes
    expect(screen.getByText('חומוס')).toBeInTheDocument()
    expect(screen.getByText('פלאפל')).toBeInTheDocument()
    expect(screen.getByText('סלט ירקות')).toBeInTheDocument()

    // Should not show inactive dish
    expect(screen.queryByText('לא פעיל')).not.toBeInTheDocument()
  })

  it('displays dish details correctly', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('combobox'))

    // Check unit type and price display
    expect(screen.getByText(/יחידה \| ₪25\.00/)).toBeInTheDocument()
    expect(screen.getByText(/משקל \| ₪15\.00/)).toBeInTheDocument()
  })

  it('calls onSelectItem when dish is selected', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('חומוס'))

    expect(mockOnSelectItem).toHaveBeenCalledWith({
      id: '1',
      name: 'חומוס',
      unit_type: 'unit',
      price_per_unit: 25,
      is_active: true,
    })
  })

  it('closes dropdown after selecting dish', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('combobox'))

    // Dropdown should be open
    expect(screen.getByText('חומוס')).toBeInTheDocument()

    await user.click(screen.getByText('חומוס'))

    // Dropdown should close after selection
    await waitFor(() => {
      expect(screen.queryByText('פלאפל')).not.toBeInTheDocument()
    })
  })

  it('allows searching dishes by name', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('combobox'))

    const searchInput = screen.getByPlaceholderText(/חפש פריט.../i)
    await user.type(searchInput, 'חומוס')

    // Should show matching dish
    expect(screen.getByText('חומוס')).toBeInTheDocument()

    // Should filter out non-matching dishes
    await waitFor(() => {
      expect(screen.queryByText('פלאפל')).not.toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch')
    )

    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(
        screen.getByText(/שגיאה בטעינת התפריט. אנא נסה שוב./i)
      ).toBeInTheDocument()
    })
  })

  it('shows error message when API returns error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    })

    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(
        screen.getByText(/שגיאה בטעינת התפריט. אנא נסה שוב./i)
      ).toBeInTheDocument()
    })
  })

  it('shows empty state when no dishes match search', async () => {
    const user = userEvent.setup()
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('combobox'))

    const searchInput = screen.getByPlaceholderText(/חפש פריט.../i)
    await user.type(searchInput, 'לא קיים')

    expect(screen.getByText(/לא נמצאו פריטים/i)).toBeInTheDocument()
  })

  it('has correct RTL direction', () => {
    render(<MenuItemSelector onSelectItem={mockOnSelectItem} />)

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('dir', 'rtl')
  })
})
