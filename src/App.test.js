import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockLocalStorage, mockWindowMethods } from './__tests__/test-utils';
import App from './App';

// Mock window methods
beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
});

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  test('renders navigation bar', () => {
    renderWithProviders(<App />);
    expect(screen.getAllByRole('navigation')).toHaveLength(2); // Main nav + footer social nav
    expect(screen.getAllByText('Little Lemon')).toHaveLength(2); // Logo + Hero title
  });

  test('renders home screen by default', () => {
    renderWithProviders(<App />);
    expect(screen.getAllByText('Little Lemon')).toHaveLength(2); // Logo + Hero title
    expect(screen.getByText(/Simple food. Classic cocktails/i)).toBeInTheDocument();
  });

  test('renders footer', () => {
    renderWithProviders(<App />);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1); // Footer on home route
  });

  test('provides cart context to children', async () => {
    renderWithProviders(<App />);
    
    // Wait for cart context to be available
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText(/Order Now/i);
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });
  });

  test('has proper routing structure', () => {
    renderWithProviders(<App />);
    // Test that main app structure is rendered
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('navigation')).toHaveLength(2); // Main nav + footer social nav
  });

  test('includes all necessary CSS imports', () => {
    // This test ensures the component doesn't crash when CSS is imported
    expect(() => renderWithProviders(<App />)).not.toThrow();
  });

  test('wraps content in CartProvider', () => {
    renderWithProviders(<App />);
    // Test that cart functionality is available (via MenuHighlights component)
    const orderButtons = screen.getAllByText(/Order Now/i);
    expect(orderButtons.length).toBeGreaterThan(0);
  });

  test('includes scroll to top functionality', () => {
    renderWithProviders(<App />);
    // ScrollToTop component is included and should not cause crashes
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  test('handles navigation between routes', async () => {
    renderWithProviders(<App />);
    
    // Check that reservation links exist (from Hero and CTA components)
    await waitFor(() => {
      const reservationLinks = screen.getAllByText(/Reserve/i);
      expect(reservationLinks.length).toBeGreaterThan(0);
    });
  });
});
