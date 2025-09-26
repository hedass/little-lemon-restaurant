import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockLocalStorage, mockWindowMethods } from './test-utils';
import Navbar from '../components/Navbar';

// Mock minimal react-router-dom (ESM actual not required for this test)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, onClick, ...rest }) => (
      <a href={typeof to === 'string' ? to : '#'} onClick={onClick} {...rest}>
        {children}
      </a>
    ),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  };
});

beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
  mockNavigate.mockClear();
});

describe('Navbar Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('displays logo and brand name', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Little Lemon')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /little lemon logo/i })).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Reservations')).toBeInTheDocument();
  });

  test('shows cart icon with item count', () => {
    renderWithProviders(<Navbar />);
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
  });

  test('updates cart count when items are added', async () => {
    const cartItems = [
      { id: 1, name: 'Test Item', quantity: 2 },
      { id: 2, name: 'Test Item 2', quantity: 1 }
    ];
    
    mockLocalStorage.setItem('littleLemonCart', JSON.stringify(cartItems));
    
    renderWithProviders(<Navbar />);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total quantity
    });
  });

  test('opens mobile menu when hamburger button is clicked', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    await user.click(hamburgerButton);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('closes mobile menu when clicking outside', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    await user.click(hamburgerButton);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Click outside (on document body)
    await user.click(document.body);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('closes mobile menu when pressing Escape key', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    await user.click(hamburgerButton);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('handles home navigation with scroll to top', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
    const homeLink = screen.getByText('Home');
    await user.click(homeLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('closes mobile menu when navigation link is clicked', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    await user.click(hamburgerButton);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    const aboutLink = screen.getByText('About');
    await user.click(aboutLink);
    
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('has proper accessibility attributes', () => {
    renderWithProviders(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    expect(hamburgerButton).toHaveAttribute('aria-expanded');
    expect(hamburgerButton).toHaveAttribute('aria-controls');
  });

  test('navigation links have proper roles and attributes', () => {
    renderWithProviders(<Navbar />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  test('handles keyboard navigation', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    hamburgerButton.focus();
    expect(hamburgerButton).toHaveFocus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('cart link navigates to cart page', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Should navigate to cart page (implementation specific)
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  test('handles window resize events gracefully', () => {
    renderWithProviders(<Navbar />);
    
    // Component should render without issues
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Simulate window resize
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderWithProviders(<Navbar />);
    
    expect(addEventListenerSpy).toHaveBeenCalled();
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalled();
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test('handles multiple rapid clicks gracefully', async () => {
    renderWithProviders(<Navbar />);
    const user = userEvent.setup();
    
  const hamburgerButton = screen.getByRole('button', { name: /(open|close) menu/i });
    
    // Rapid clicks should not break the component
    await user.click(hamburgerButton);
    await user.click(hamburgerButton);
    await user.click(hamburgerButton);
    
    // Menu state should still work
    expect(hamburgerButton).toHaveAttribute('aria-expanded');
  });
});
