import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { CartProvider, useCartContext } from '../context/CartContext';
import { useCart } from '../hooks/useCart';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Test component for context testing
const TestCartComponent = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
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
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('Cart System', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('useCart hook initializes with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItemCount()).toBe(0);
    expect(result.current.calculateTotal()).toBe(0);
  });

  test('useCart hook adds items correctly', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 1 }]);
    expect(result.current.getTotalItemCount()).toBe(1);
    expect(result.current.calculateTotal()).toBe(10);
  });

  test('useCart hook increases quantity for existing items', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
      result.current.addToCart(testItem);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 2 }]);
    expect(result.current.getTotalItemCount()).toBe(2);
    expect(result.current.calculateTotal()).toBe(20);
  });

  test('useCart hook removes items correctly', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
      result.current.addToCart(testItem);
      result.current.removeFromCart(1);
    });
    
    expect(result.current.cartItems).toEqual([{ ...testItem, quantity: 1 }]);
    expect(result.current.getTotalItemCount()).toBe(1);
  });

  test('useCart hook clears cart correctly', () => {
    const { result } = renderHook(() => useCart());
    const testItem = { id: 1, name: 'Test Item', price: 10 };
    
    act(() => {
      result.current.addToCart(testItem);
      result.current.clearCart();
    });
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotalItemCount()).toBe(0);
  });

  test('CartContext provides functionality to components', () => {
    const renderWithProvider = (ui) => {
      return render(<CartProvider>{ui}</CartProvider>);
    };

    renderWithProvider(<TestCartComponent />);
    
    expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  test('Cart handles items with default prices', () => {
    const { result } = renderHook(() => useCart());
    const itemWithoutPrice = { id: 1, name: 'Test Item' }; // No price
    
    act(() => {
      result.current.addToCart(itemWithoutPrice);
    });
    
    // Should use default price of 12.99
    expect(result.current.calculateTotal()).toBe(12.99);
  });

  test('Cart handles localStorage errors gracefully', () => {
    mockLocalStorage.setItem('littleLemonCart', 'invalid json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useCart());
    
    expect(result.current.cartItems).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('Cart loads from localStorage on mount', () => {
    const existingCart = [{ id: 1, name: 'Saved Item', price: 5, quantity: 2 }];
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(existingCart));
    
    const { result } = renderHook(() => useCart());
    
    act(() => {
      expect(result.current.cartItems).toEqual(existingCart);
    });
  });

  test('Cart calculates complex totals correctly', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addToCart({ id: 1, name: 'Item 1', price: 10.50 });
      result.current.addToCart({ id: 1, name: 'Item 1', price: 10.50 }); // Same item
      result.current.addToCart({ id: 2, name: 'Item 2', price: 15.25 });
    });
    
    // 10.50 * 2 + 15.25 = 36.25
    expect(result.current.calculateTotal()).toBe(36.25);
    expect(result.current.getTotalItemCount()).toBe(3);
  });
});
