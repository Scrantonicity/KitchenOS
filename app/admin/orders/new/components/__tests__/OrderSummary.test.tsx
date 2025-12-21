import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderSummary } from '../OrderSummary'

const mockItems = [
  {
    dish_id: '1',
    dish_name: 'חומוס',
    unit_type: 'unit' as const,
    price_per_unit: 25,
    quantity: 2,
  },
  {
    dish_id: '2',
    dish_name: 'פלאפל',
    unit_type: 'unit' as const,
    price_per_unit: 20,
    quantity: 1,
  },
  {
    dish_id: '3',
    dish_name: 'סלט ירקות',
    unit_type: 'weight' as const,
    price_per_unit: 15,
    quantity: 3,
  },
]

describe('OrderSummary', () => {
  const mockOnUpdateQuantity = jest.fn()
  const mockOnRemoveItem = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows empty state when no items', () => {
    render(
      <OrderSummary
        items={[]}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    expect(screen.getByText(/טרם נוספו פריטים/i)).toBeInTheDocument()
  })

  it('displays all order items', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    expect(screen.getByText('חומוס')).toBeInTheDocument()
    expect(screen.getByText('פלאפל')).toBeInTheDocument()
    expect(screen.getByText('סלט ירקות')).toBeInTheDocument()
  })

  it('displays unit types correctly in Hebrew', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Find all unit type labels
    const unitLabels = screen.getAllByText('יחידה')
    const weightLabels = screen.getAllByText('משקל')

    expect(unitLabels).toHaveLength(2) // חומוס and פלאפל
    expect(weightLabels).toHaveLength(1) // סלט ירקות
  })

  it('calculates and displays item prices correctly', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // חומוס: 2 × 25 = 50
    expect(screen.getByText('₪50.00')).toBeInTheDocument()
    // פלאפל: 1 × 20 = 20
    expect(screen.getByText('₪20.00')).toBeInTheDocument()
    // סלט: 3 × 15 = 45
    expect(screen.getByText('₪45.00')).toBeInTheDocument()
  })

  it('calculates total items count correctly', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Total: 2 + 1 + 3 = 6
    expect(screen.getByText(/סה"כ פריטים: 6/i)).toBeInTheDocument()
  })

  it('calculates total price correctly', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Total: (2×25) + (1×20) + (3×15) = 50 + 20 + 45 = 115
    expect(screen.getByText(/סה"כ: ₪115\.00/i)).toBeInTheDocument()
  })

  it('increments quantity when plus button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Find plus button for first item (חומוס)
    const plusButtons = screen.getAllByLabelText(/הגדל כמות/i)
    await user.click(plusButtons[0])

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3)
  })

  it('decrements quantity when minus button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Find minus button for first item (חומוס)
    const minusButtons = screen.getAllByLabelText(/הקטן כמות/i)
    await user.click(minusButtons[0])

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1)
  })

  it('disables minus button when quantity is 1', () => {
    const itemsWithMinQuantity = [
      {
        dish_id: '1',
        dish_name: 'חומוס',
        unit_type: 'unit' as const,
        price_per_unit: 25,
        quantity: 1,
      },
    ]

    render(
      <OrderSummary
        items={itemsWithMinQuantity}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const minusButton = screen.getByLabelText(/הקטן כמות/i)
    expect(minusButton).toBeDisabled()
  })

  it('disables plus button when quantity is 999', () => {
    const itemsWithMaxQuantity = [
      {
        dish_id: '1',
        dish_name: 'חומוס',
        unit_type: 'unit' as const,
        price_per_unit: 25,
        quantity: 999,
      },
    ]

    render(
      <OrderSummary
        items={itemsWithMaxQuantity}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const plusButton = screen.getByLabelText(/הגדל כמות/i)
    expect(plusButton).toBeDisabled()
  })

  it('caps quantity at 999 when incrementing', async () => {
    const user = userEvent.setup()
    const itemsNearMax = [
      {
        dish_id: '1',
        dish_name: 'חומוס',
        unit_type: 'unit' as const,
        price_per_unit: 25,
        quantity: 998,
      },
    ]

    render(
      <OrderSummary
        items={itemsNearMax}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const plusButton = screen.getByLabelText(/הגדל כמות/i)
    await user.click(plusButton)

    // Should cap at 999
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 999)
  })

  it('does not allow quantity below 1 when decrementing', async () => {
    const user = userEvent.setup()
    const itemsAtMin = [
      {
        dish_id: '1',
        dish_name: 'חומוס',
        unit_type: 'unit' as const,
        price_per_unit: 25,
        quantity: 2,
      },
    ]

    render(
      <OrderSummary
        items={itemsAtMin}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const minusButton = screen.getByLabelText(/הקטן כמות/i)
    await user.click(minusButton)

    // Should call with 1 (Math.max(1, 2-1))
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1)
  })

  it('updates quantity through direct input', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const quantityInputs = screen.getAllByLabelText(/כמות/i)
    await user.clear(quantityInputs[0])
    await user.type(quantityInputs[0], '5')

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 5)
  })

  it('ignores invalid direct input (non-numbers)', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const quantityInputs = screen.getAllByLabelText(/כמות/i)
    await user.clear(quantityInputs[0])
    await user.type(quantityInputs[0], 'abc')

    // Should not call onUpdateQuantity with invalid value
    expect(mockOnUpdateQuantity).not.toHaveBeenCalledWith('1', NaN)
  })

  it('ignores direct input outside valid range', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const quantityInputs = screen.getAllByLabelText(/כמות/i)

    // Try 0
    await user.clear(quantityInputs[0])
    await user.type(quantityInputs[0], '0')
    expect(mockOnUpdateQuantity).not.toHaveBeenCalledWith('1', 0)

    // Try 1000
    await user.clear(quantityInputs[0])
    await user.type(quantityInputs[0], '1000')
    expect(mockOnUpdateQuantity).not.toHaveBeenCalledWith('1', 1000)
  })

  it('calls onRemoveItem when X button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Find remove button for first item
    const removeButtons = screen.getAllByLabelText(/הסר חומוס/i)
    await user.click(removeButtons[0])

    expect(mockOnRemoveItem).toHaveBeenCalledWith('1')
  })

  it('has correct RTL direction', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    const container = screen.getByText(/סיכום הזמנה/i).parentElement
    expect(container).toHaveAttribute('dir', 'rtl')
  })

  it('has minimum touch target size for buttons', () => {
    render(
      <OrderSummary
        items={mockItems}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemoveItem={mockOnRemoveItem}
      />
    )

    // Plus and minus buttons should be 44px (h-11)
    const plusButtons = screen.getAllByLabelText(/הגדל כמות/i)
    expect(plusButtons[0]).toHaveClass('h-11', 'w-11')
  })
})
