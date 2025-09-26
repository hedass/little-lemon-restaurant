import React from 'react';
import { renderHook, act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockLocalStorage, sampleCartItems } from './test-utils';
import { useCart } from '../hooks/useCart';
import { useCartContext } from '../context/CartContext';

// Test component for context testing
const TestCartComponent = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    removeAllFromCart, 
    clearCart, 
    calculateTotal, 
    getTotalItemCount 
  } = useCartContext();

  return (
    <div>
      <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
      <div data-testid="total-count">{getTotalItemCount()}</div>
      <div data-testid="total-price">{calculateTotal().toFixed(2)}</div>
      <button onClick={() => addToCart({ id: 1, name: 'Test Item', price: 10 })}>
        Add Item
      </button>
      <button onClick={() => removeFromCart(1)}>Remove Item</button>
      <button onClick={() => removeAllFromCart(1)}>Remove All</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('useCart Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    // Mock localStorage for each test
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  test('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItemCount()).toBe(0);
    expect(result.current.calculateTotal()).toBe(0);
  });

  test('loads cart from localStorage on mount', async () => {
    mockLocalStorage.clear();
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(sampleCartItems));
    
    const { result } = renderHook(() => useCart());
    
    // Wait for the async effect to load data
    await waitFor(() => {
      expect(result.current.cartItems).toEqual(sampleCartItems);
    });
  });

  test('handles corrupted localStorage data gracefully', () => {
    mockLocalStorage.setItem('littleLemonCart', 'invalid json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cartItems).toEqual([]);
    
    consoleSpy.mockRestore();
  });

  test('adds new item to cart', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 1 }]);
  });

  test('increases quantity when adding existing item', async () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    // Wait for initial load to complete
    await waitFor(() => {
      expect(result.current.cartItems).toEqual([]);
    });
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 2 }]);
  });

  test('removes single item from cart', async () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.cartItems).toEqual([]);
    });
    
    act(() => {
      result.current.addToCart(testItem);
      result.current.addToCart(testItem);
    });
    
    act(() => {
      result.current.removeFromCart(1);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 1 }]);
  });

  test('removes item completely when quantity is 1', async () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.cartItems).toEqual([]);
    });
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    act(() => {
      result.current.removeFromCart(1);
    });
    
    expect(result.current.cartItems).toEqual([]);
  });

  test('removes all items of specific type', () => {
    const { result } = renderHook(() => useCart());
    const testItem1 = { id: 1, name: 'Test Item 1', price: 10 };
    const testItem2 = { id: 2, name: 'Test Item 2', price: 15 };
    
    act(() => {
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem2);
      result.current.removeAllFromCart(1);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem2, quantity: 1 }]);
  });

  test('clears entire cart', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
      result.current.clearCart();
    });
    
    expect(result.current.cartItems).toEqual([]);
  });

  test('calculates total price correctly', () => {
    const { result } = renderHook(() => useCart());
    const testItem1 = { id: 1, name: 'Test Item 1', price: 10 };
    const testItem2 = { id: 2, name: 'Test Item 2', price: 15 };
    
    act(() => {
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem2);
    });
    
    expect(result.current.calculateTotal()).toBe(35); // 10*2 + 15*1
  });

  test('handles items without price (uses default)', () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item' }; // No price
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    expect(result.current.calculateTotal()).toBe(12.99); // Default price
  });

  test('calculates total item count correctly', () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem1 = { id: 1, name: 'Test Item 1', price: 10 };
    const testItem2 = { id: 2, name: 'Test Item 2', price: 15 };
    
    act(() => {
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem1);
      result.current.addToCart(testItem2);
    });
    
    expect(result.current.getTotalItemCount()).toBe(3);
  });

  test('saves to localStorage when cart changes', async () => {
    mockLocalStorage.clear();
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    // Wait for the save effect
    await waitFor(() => {
      const savedCart = JSON.parse(mockLocalStorage.getItem('littleLemonCart') || '[]');
      expect(savedCart).toEqual([{ ...testItem, quantity: 1 }]);
    });
  });
});

describe('CartContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('provides cart functionality to children', async () => {
    renderWithProviders(<TestCartComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    });
    
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
  });

  test('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponent = () => {
      useCartContext();
      return <div>Test</div>;
    };
    
    expect(() => renderWithProviders(<TestComponent />, { wrapper: React.Fragment }))
      .toThrow('useCartContext must be used within a CartProvider');
    
    consoleError.mockRestore();
  });

  test('allows adding items through context', async () => {
    renderWithProviders(<TestCartComponent />);
    
    const addButton = screen.getByText('Add Item');
    
    act(() => {
      addButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
    });
    
    expect(screen.getByTestId('total-price')).toHaveTextContent('10.00');
  });

  test('allows removing items through context', async () => {
    renderWithProviders(<TestCartComponent />);
    
    const addButton = screen.getByText('Add Item');
    const removeButton = screen.getByText('Remove Item');
    
    act(() => {
      addButton.click();
      addButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    });
    
    act(() => {
      removeButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
    });
  });

  test('allows clearing cart through context', async () => {
    renderWithProviders(<TestCartComponent />);
    
    const addButton = screen.getByText('Add Item');
    const clearButton = screen.getByText('Clear Cart');
    
    act(() => {
      addButton.click();
      addButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    });
    
    act(() => {
      clearButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    });
  });

  test('persists cart state across re-renders', async () => {
    const { rerender } = renderWithProviders(<TestCartComponent />);
    
    const addButton = screen.getByText('Add Item');
    
    act(() => {
      addButton.click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
    });
    
    rerender(<TestCartComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-count')).toHaveTextContent('1');
    });
  });
});
