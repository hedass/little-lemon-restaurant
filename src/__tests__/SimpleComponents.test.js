import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import About from '../components/About';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Specials from '../components/Specials';

// Simple render helper for components that don't need routing
const renderWithCartProvider = (ui) => {
  const Wrapper = ({ children }) => (
    <CartProvider>
      {children}
    </CartProvider>
  );
  
  return render(ui, { wrapper: Wrapper });
};

describe('Simple Components', () => {
  test('About component renders', () => {
    renderWithCartProvider(<About />);
    expect(screen.getByText('About Little Lemon')).toBeInTheDocument();
    expect(screen.getByText(/charming neighborhood bistro/i)).toBeInTheDocument();
  });

  test('CTA component renders', () => {
    renderWithCartProvider(<CTA />);
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    expect(screen.getByText(/We look forward to hosting you/i)).toBeInTheDocument();
  });

  test('Footer component renders', () => {
    renderWithCartProvider(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('ValueProps component displays all props', () => {
    renderWithCartProvider(<ValueProps />);
    
    expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Simple Menu')).toBeInTheDocument();
    expect(screen.getByText('Neighborhood Charm')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful Cocktails')).toBeInTheDocument();
  });

  test('HowItWorks component displays steps', () => {
    renderWithCartProvider(<HowItWorks />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Reserve a Table')).toBeInTheDocument();
    expect(screen.getByText('Enjoy Your Meal')).toBeInTheDocument();
    expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
  });

  test('Testimonials component displays reviews', () => {
    renderWithCartProvider(<Testimonials />);
    
    expect(screen.getByText('What People Say')).toBeInTheDocument();
    expect(screen.getByText(/Wonderful food and the staff made our night special/i)).toBeInTheDocument();
    expect(screen.getByText(/Cozy spot with reliably delicious dishes/i)).toBeInTheDocument();
  });

  test('Specials component displays dishes', () => {
    renderWithCartProvider(<Specials />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Lemon Dessert')).toBeInTheDocument();
  });
});
