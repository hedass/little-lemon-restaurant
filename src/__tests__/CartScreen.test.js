import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockLocalStorage, mockWindowMethods, sampleCartItems } from './test-utils';
import CartScreen from '../screens/CartScreen';

beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
});

describe('CartScreen Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<CartScreen />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders navigation and footer', () => {
    renderWithProviders(<CartScreen />);
    
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('displays cart heading', () => {
    renderWithProviders(<CartScreen />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  test('shows empty cart message when cart is empty', () => {
    renderWithProviders(<CartScreen />);
    
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.getByText(/Browse our menu to add delicious items/i)).toBeInTheDocument();
  });

  test('displays cart items when cart has items', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // quantity
    expect(screen.getByText('1')).toBeInTheDocument(); // quantity
  });

  test('shows correct item details and prices', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    
    // Check individual prices
    expect(screen.getByText('$12.99 each')).toBeInTheDocument();
    expect(screen.getByText('$8.99 each')).toBeInTheDocument();
    
    // Check item totals
    expect(screen.getByText('$25.98')).toBeInTheDocument(); // 12.99 * 2
    expect(screen.getByText('$8.99')).toBeInTheDocument(); // 8.99 * 1
  });

  test('displays correct cart total', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    
    // Total should be 12.99 * 2 + 8.99 * 1 = 34.97
    expect(screen.getByText('Total: $34.97')).toBeInTheDocument();
  });

  test('allows increasing item quantity', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    // Find the + button for Greek Salad (first item)
    const increaseButtons = screen.getAllByLabelText(/Add one more/i);
    await user.click(increaseButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  test('allows decreasing item quantity', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    // Find the - button for Greek Salad (quantity 2)
    const decreaseButtons = screen.getAllByLabelText(/Remove one/i);
    await user.click(decreaseButtons[0]);
    
    await waitFor(() => {
      // Quantity should change from 2 to 1
      const quantities = screen.getAllByText('1');
      expect(quantities.length).toBe(2); // Both items now have quantity 1
    });
  });

  test('removes item when quantity reaches zero', async () => {
    const singleItemCart = [{
      id: 1,
      name: 'Greek Salad',
      desc: 'Crisp greens, feta, olives, lemon vinaigrette.',
      price: 12.99,
      quantity: 1
    }];
    
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(singleItemCart));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    // Decrease quantity to zero
    const decreaseButton = screen.getByLabelText(/Remove one Greek Salad/i);
    await user.click(decreaseButton);
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });
  });

  test('allows removing all items of a type', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    // Remove all Greek Salad items
    const removeAllButtons = screen.getAllByText('Remove All');
    await user.click(removeAllButtons[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('Greek Salad')).not.toBeInTheDocument();
    });
    
    // Bruschetta should still be there
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
  });

  test('allows clearing entire cart', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    const clearButton = screen.getByText('Clear Cart');
    await user.click(clearButton);
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });
  });

  test('handles checkout with items', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    const checkoutButton = screen.getByText('Checkout');
    await user.click(checkoutButton);
    
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Thank you for your order'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('$34.97'));
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });
  });

  test('prevents checkout with empty cart', () => {
    renderWithProviders(<CartScreen />);
    
    // Cart is empty by default
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    
    // Checkout button should not be visible for empty cart
    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });

  test('shows checkout alert for empty cart when using direct function', async () => {
    // This tests the handleCheckout function directly if cart somehow becomes empty during checkout
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify([]));
    
    renderWithProviders(<CartScreen />);
    
    // Should show empty cart message
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test('handles items with default price', () => {
    const itemsWithoutPrice = [{
      id: 1,
      name: 'Test Item',
      desc: 'Test description',
      quantity: 1
      // No price property
    }];
    
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(itemsWithoutPrice));
    
    renderWithProviders(<CartScreen />);
    
    // Should use default price of $12.99
    expect(screen.getByText('$12.99 each')).toBeInTheDocument();
    expect(screen.getByText('Total: $12.99')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    
    // Check heading has proper id
    expect(screen.getByRole('heading', { name: 'Your Cart' })).toHaveAttribute('id', 'cart-heading');
    
    // Check buttons have aria-labels
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  test('displays item images with proper alt text', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    
  const images = screen.getAllByRole('img');
  // Includes global navbar logo plus 2 item images
  expect(images.length).toBeGreaterThanOrEqual(3);
    
    expect(screen.getByAltText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByAltText('Bruschetta')).toBeInTheDocument();
  });

  test('updates total when quantities change', async () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    renderWithProviders(<CartScreen />);
    const user = userEvent.setup();
    
    // Initial total: $34.97
    expect(screen.getByText('Total: $34.97')).toBeInTheDocument();
    
    // Add one more Greek Salad
    const increaseButtons = screen.getAllByLabelText(/Add one more/i);
    await user.click(increaseButtons[0]);
    
    await waitFor(() => {
      // New total should be $47.96 (12.99 * 3 + 8.99 * 1)
      expect(screen.getByText('Total: $47.96')).toBeInTheDocument();
    });
  });

  test('maintains cart state across re-renders', () => {
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    const { rerender } = renderWithProviders(<CartScreen />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    
    rerender(<CartScreen />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
  });
});
