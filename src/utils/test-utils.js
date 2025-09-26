/**
 * Test utilities and shared setup for Little Lemon Restaurant tests
 * This file contains helper functions and mocks used across test files
 */

import React from 'react';
import { render } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';

// Mock localStorage
export const mockLocalStorage = (() => {
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

// Custom render with providers
export const renderWithProviders = (ui, options = {}) => {
  // Mock localStorage before each test
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  const Wrapper = ({ children }) => {
    return (
      <CartProvider>
        <div>
          {children}
        </div>
      </CartProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Utility to setup localStorage with test data
export const setupLocalStorageWithData = (reservations = [], cartItems = []) => {
  mockLocalStorage.setItem('littleLemonReservations', JSON.stringify(reservations));
  mockLocalStorage.setItem('littleLemonCart', JSON.stringify(cartItems));
};

// Mock window.alert and window.confirm for testing
export const mockWindowMethods = () => {
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true);
};

// Sample test data
export const sampleReservations = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    date: '2025-09-28',
    time: '19:00',
    guests: '2',
    occasion: 'Birthday',
    timestamp: '2025-09-27T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    date: '2025-09-29',
    time: '20:00',
    guests: '4',
    occasion: 'Anniversary',
    timestamp: '2025-09-27T11:00:00.000Z'
  }
];

export const sampleCartItems = [
  {
    id: 1,
    name: 'Greek Salad',
    desc: 'Crisp greens, feta, olives, lemon vinaigrette.',
    price: 12.99,
    quantity: 2
  },
  {
    id: 2,
    name: 'Bruschetta',
    desc: 'Heirloom tomato, basil, olive oil on toasted bread.',
    price: 8.99,
    quantity: 1
  }
];

export const sampleMenuItems = [
  { id: 1, name: 'Greek Salad', desc: 'Crisp greens, feta, olives, lemon vinaigrette.', img: '/assets/greek salad.jpg', price: 12.99 },
  { id: 2, name: 'Bruschetta', desc: 'Heirloom tomato, basil, olive oil on toasted bread.', img: '/assets/bruchetta.svg', price: 8.99 },
  { id: 3, name: 'Lemon Mousse', desc: 'Light mousse with shortbread and candied lemon.', img: '/assets/lemon dessert.jpg', price: 6.99 }
];

// Helper to create form data for testing
export const createFormData = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  date: '2025-09-30',
  time: '19:00',
  guests: '2',
  occasion: 'Birthday',
  ...overrides
});

// Export everything from testing-library for convenience
export * from '@testing-library/react';
// Note: userEvent v13 doesn't have setup() method
export { default as userEvent } from '@testing-library/user-event';
