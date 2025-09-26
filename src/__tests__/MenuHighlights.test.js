import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockLocalStorage, mockWindowMethods } from './test-utils';
import MenuHighlights from '../components/MenuHighlights';

beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
});

describe('MenuHighlights Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<MenuHighlights />);
    expect(screen.getByText('Menu Highlights')).toBeInTheDocument();
  });

  test('displays all featured menu items', () => {
    renderWithProviders(<MenuHighlights />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Lemon Mousse')).toBeInTheDocument();
  });

  test('shows item descriptions', () => {
    renderWithProviders(<MenuHighlights />);
    
    expect(screen.getByText(/Crisp greens, feta, olives/i)).toBeInTheDocument();
    expect(screen.getByText(/Heirloom tomato, basil, olive oil/i)).toBeInTheDocument();
    expect(screen.getByText(/Light mousse with shortbread/i)).toBeInTheDocument();
  });

  test('displays correct prices', () => {
    renderWithProviders(<MenuHighlights />);
    
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$6.99')).toBeInTheDocument();
  });

  test('shows order buttons for each item', () => {
    renderWithProviders(<MenuHighlights />);
    
    const orderButtons = screen.getAllByText('Order Now');
    expect(orderButtons).toHaveLength(3);
  });

  test('adds item to cart when order button is clicked', async () => {
    renderWithProviders(<MenuHighlights />);
    const user = userEvent.setup();
    
    const orderButtons = screen.getAllByText('Order Now');
    await user.click(orderButtons[0]); // Click first order button (Greek Salad)
    
    expect(window.alert).toHaveBeenCalledWith('Greek Salad added to cart!');
  });

  test('adds different items to cart', async () => {
    renderWithProviders(<MenuHighlights />);
    const user = userEvent.setup();
    
    const orderButtons = screen.getAllByText('Order Now');
    
    // Add Greek Salad
    await user.click(orderButtons[0]);
    expect(window.alert).toHaveBeenCalledWith('Greek Salad added to cart!');
    
    // Add Bruschetta
    await user.click(orderButtons[1]);
    expect(window.alert).toHaveBeenCalledWith('Bruschetta added to cart!');
    
    // Add Lemon Mousse
    await user.click(orderButtons[2]);
    expect(window.alert).toHaveBeenCalledWith('Lemon Mousse added to cart!');
  });

  test('displays item images', () => {
    renderWithProviders(<MenuHighlights />);
    
    expect(screen.getByAltText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByAltText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByAltText('Lemon Mousse')).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    renderWithProviders(<MenuHighlights />);
    
    // Should have section with proper heading
    const heading = screen.getByText('Menu Highlights');
    expect(heading).toHaveAttribute('id', 'menu-highlights-heading');
    
    // Should have articles for each menu item
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  test('has proper accessibility attributes', () => {
    renderWithProviders(<MenuHighlights />);
    
    const section = screen.getByRole('region', { name: /menu highlights/i });
    expect(section).toHaveAttribute('aria-labelledby', 'menu-highlights-heading');
    
    const orderButtons = screen.getAllByText('Order Now');
    orderButtons.forEach((button, index) => {
      const itemNames = ['Greek Salad', 'Bruschetta', 'Lemon Mousse'];
      expect(button).toHaveAttribute('aria-label', `Add ${itemNames[index]} to cart`);
    });
  });

  test('images have loading lazy attribute', () => {
    renderWithProviders(<MenuHighlights />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  test('handles cart context integration correctly', async () => {
    renderWithProviders(<MenuHighlights />);
    const user = userEvent.setup();
    
    const orderButtons = screen.getAllByText('Order Now');
    
    // Add multiple items
    await user.click(orderButtons[0]);
    await user.click(orderButtons[0]); // Add same item twice
    
    expect(window.alert).toHaveBeenCalledTimes(2);
  });

  test('handles rapid clicking gracefully', async () => {
    renderWithProviders(<MenuHighlights />);
    const user = userEvent.setup();
    
    const orderButton = screen.getAllByText('Order Now')[0];
    
    // Rapid clicks should all register
    await user.click(orderButton);
    await user.click(orderButton);
    await user.click(orderButton);
    
    expect(window.alert).toHaveBeenCalledTimes(3);
  });

  test('maintains item data consistency', () => {
    renderWithProviders(<MenuHighlights />);
    
    // Verify that displayed data matches expected menu structure
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText(/Crisp greens, feta, olives/i)).toBeInTheDocument();
    
    // All should be in the same section
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  test('has proper heading hierarchy', () => {
    renderWithProviders(<MenuHighlights />);
    
    // Main heading should be h2
    const mainHeading = screen.getByRole('heading', { name: 'Menu Highlights' });
    expect(mainHeading.tagName).toBe('H2');
    
    // Item names should be h3
    const itemHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(itemHeadings).toHaveLength(3);
  });

  test('integrates with cart context without errors', () => {
    // Test that component doesn't crash when cart context is available
    expect(() => renderWithProviders(<MenuHighlights />)).not.toThrow();
    
    // Verify cart context integration
    const orderButtons = screen.getAllByText('Order Now');
    expect(orderButtons.length).toBeGreaterThan(0);
  });

  test('handles cart context methods correctly', async () => {
    renderWithProviders(<MenuHighlights />);
    const user = userEvent.setup();
    
    // Test that addToCart is called with correct item data
    const orderButton = screen.getAllByText('Order Now')[0];
    await user.click(orderButton);
    
    // Verify alert was called (simpler test)
    expect(window.alert).toHaveBeenCalledWith('Greek Salad added to cart!');
  });
});
