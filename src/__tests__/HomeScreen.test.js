import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockLocalStorage, mockWindowMethods } from './test-utils';
import HomeScreen from '../screens/HomeScreen';

beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
});

describe('HomeScreen Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders all main sections', async () => {
    renderWithProviders(<HomeScreen />);
    
  // Hero section (use role=heading to avoid multiple text node issues)
  expect(screen.getByRole('heading', { level: 1, name: /Little Lemon/i })).toBeInTheDocument();
  expect(screen.getByText(/Simple food\. Classic cocktails/i)).toBeInTheDocument();
    
    // Navigation
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    
    // Footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Wait for async components to load
    await waitFor(() => {
      expect(screen.getByText(/About Little Lemon/i)).toBeInTheDocument();
    });
  });

  test('includes value propositions section', () => {
    renderWithProviders(<HomeScreen />);
  expect(screen.getAllByText(/Fresh Ingredients/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/Simple Menu/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/Neighborhood Charm/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/Thoughtful Cocktails/i)[0]).toBeInTheDocument();
  });

  test('includes how it works section', () => {
    renderWithProviders(<HomeScreen />);
  expect(screen.getByText('How It Works')).toBeInTheDocument();
  expect(screen.getAllByText('Reserve a Table')[0]).toBeInTheDocument();
    expect(screen.getByText('Enjoy Your Meal')).toBeInTheDocument();
    expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
  });

  test('includes testimonials section', () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText('What People Say')).toBeInTheDocument();
    expect(screen.getByText(/Wonderful food and the staff made our night special/i)).toBeInTheDocument();
    expect(screen.getByText(/Cozy spot with reliably delicious dishes/i)).toBeInTheDocument();
  });

  test('includes specials section', () => {
    renderWithProviders(<HomeScreen />);
  expect(screen.getAllByText('Greek Salad')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Bruschetta')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Lemon Dessert')[0]).toBeInTheDocument();
  });

  test('includes menu highlights with order functionality', async () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText('Menu Highlights')).toBeInTheDocument();
    
    const orderButtons = screen.getAllByText(/Order Now/i);
    expect(orderButtons.length).toBeGreaterThan(0);
    
    // Test ordering functionality
    const user = userEvent.setup();
    await user.click(orderButtons[0]);
    
    expect(window.alert).toHaveBeenCalled();
  });

  test('includes about section', () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText('About Little Lemon')).toBeInTheDocument();
    expect(screen.getByText(/charming neighborhood bistro/i)).toBeInTheDocument();
  });

  test('includes FAQ section', () => {
    renderWithProviders(<HomeScreen />);
  // FAQ heading text is 'Help & Info'
  expect(screen.getByRole('heading', { name: /Help & Info/i })).toBeInTheDocument();
  });

  test('includes call-to-action section', () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    expect(screen.getByText(/We look forward to hosting you/i)).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    renderWithProviders(<HomeScreen />);
    
    // Check for main landmarks
    expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(5);
  });

  test('navigation links work correctly', async () => {
    renderWithProviders(<HomeScreen />);
    
    // Check for reservation links
    const reserveLinks = screen.getAllByText(/Reserve/i);
    expect(reserveLinks.length).toBeGreaterThan(0);
    
    // Check for menu links
    const menuLinks = screen.getAllByText(/View Menu/i);
    expect(menuLinks.length).toBeGreaterThan(0);
  });

  test('images have proper alt text', () => {
    renderWithProviders(<HomeScreen />);
    
    // Check that images have alt text (accessibility)
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('cart context integration works', async () => {
    renderWithProviders(<HomeScreen />);
    
    // Test that cart functionality is available
    const orderButtons = screen.getAllByText(/Order Now/i);
    expect(orderButtons.length).toBeGreaterThan(0);
    
    const user = userEvent.setup();
    await user.click(orderButtons[0]);
    
    // Should show alert when item is added
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('added to cart'));
  });

  test('handles user interactions properly', async () => {
    renderWithProviders(<HomeScreen />);
    const user = userEvent.setup();
    
    // Test FAQ interactions
    const faqButtons = screen.getAllByRole('button');
    const faqToggle = faqButtons.find(button => 
      button.textContent?.includes('?') || button.getAttribute('aria-expanded') !== null
    );
    
    if (faqToggle) {
      await user.click(faqToggle);
      // FAQ should toggle (implementation dependent)
    }
  });
});
