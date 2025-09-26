import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import Hero from '../components/Hero';
import About from '../components/About';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Specials from '../components/Specials';

describe('Hero Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText('Little Lemon')).toBeInTheDocument();
  });

  test('displays main heading and tagline', () => {
    renderWithProviders(<Hero />);
    
    expect(screen.getByRole('heading', { name: 'Little Lemon' })).toBeInTheDocument();
    expect(screen.getByText(/Simple food. Classic cocktails/i)).toBeInTheDocument();
  });

  test('contains reserve table link', () => {
    renderWithProviders(<Hero />);
    
    const reserveLink = screen.getByRole('button', { name: /Reserve a table/i });
    expect(reserveLink).toHaveAttribute('href', '/reservation');
  });

  test('contains view menu link', () => {
    renderWithProviders(<Hero />);
    
    const menuLink = screen.getByRole('link', { name: /View menu/i });
    expect(menuLink).toHaveAttribute('href', '#menu');
  });

  test('has proper accessibility structure', () => {
    renderWithProviders(<Hero />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    
    const heading = screen.getByRole('heading', { name: 'Little Lemon' });
    expect(heading).toHaveAttribute('id', 'hero-heading');
  });

  test('includes background image with proper alt text', () => {
    renderWithProviders(<Hero />);
    
    const bgImage = screen.getByAltText(/Restaurant table with dishes and warm lighting/i);
    expect(bgImage).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('About Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('About Little Lemon')).toBeInTheDocument();
  });

  test('displays about content', () => {
    renderWithProviders(<About />);
    
    expect(screen.getByText(/charming neighborhood bistro/i)).toBeInTheDocument();
    expect(screen.getByText(/source local ingredients/i)).toBeInTheDocument();
  });

  test('includes about image', () => {
    renderWithProviders(<About />);
    
    const image = screen.getByAltText(/Cozy restaurant interior/i);
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  test('has proper semantic structure', () => {
    renderWithProviders(<About />);
    
    const section = screen.getByRole('region', { name: /about little lemon/i });
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');
  });
});

describe('CTA Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<CTA />);
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
  });

  test('displays call-to-action content', () => {
    renderWithProviders(<CTA />);
    
    expect(screen.getByText(/We look forward to hosting you/i)).toBeInTheDocument();
  });

  test('contains reservation and menu links', () => {
    renderWithProviders(<CTA />);
    
    expect(screen.getByText('Reserve a Table')).toBeInTheDocument();
    expect(screen.getByText('View Menu')).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    renderWithProviders(<CTA />);
    
    const heading = screen.getByRole('heading', { name: 'Make a Reservation' });
    expect(heading).toHaveAttribute('id', 'final-cta');
  });
});

describe('Footer Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('displays footer content', () => {
    renderWithProviders(<Footer />);
    
    // Footer typically contains copyright or contact info
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});

describe('ValueProps Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<ValueProps />);
    expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
  });

  test('displays all value propositions', () => {
    renderWithProviders(<ValueProps />);
    
    expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Simple Menu')).toBeInTheDocument();
    expect(screen.getByText('Neighborhood Charm')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful Cocktails')).toBeInTheDocument();
  });

  test('displays value proposition descriptions', () => {
    renderWithProviders(<ValueProps />);
    
    expect(screen.getByText(/Locally sourced produce/i)).toBeInTheDocument();
    expect(screen.getByText(/concise menu of seasonal favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/warm atmosphere/i)).toBeInTheDocument();
    expect(screen.getByText(/Classic cocktails and modern twists/i)).toBeInTheDocument();
  });

  test('includes images for each value prop', () => {
    renderWithProviders(<ValueProps />);
    // Images have empty alt and aria-hidden, so include hidden elements in query
    const images = screen.getAllByRole('img', { hidden: true });
    expect(images).toHaveLength(4);
  });
});

describe('HowItWorks Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  test('displays all steps', () => {
    renderWithProviders(<HowItWorks />);
    
    expect(screen.getByText('Reserve a Table')).toBeInTheDocument();
    expect(screen.getByText('Enjoy Your Meal')).toBeInTheDocument();
    expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
  });

  test('shows step numbers', () => {
    renderWithProviders(<HowItWorks />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    renderWithProviders(<HowItWorks />);
    
    const section = screen.getByRole('region', { name: /how it works/i });
    expect(section).toHaveAttribute('aria-labelledby', 'how-heading');
    
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });
});

describe('Testimonials Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Testimonials />);
    expect(screen.getByText('What People Say')).toBeInTheDocument();
  });

  test('displays all testimonials', () => {
    renderWithProviders(<Testimonials />);
    
    expect(screen.getByText(/Wonderful food and the staff made our night special/i)).toBeInTheDocument();
    expect(screen.getByText(/Cozy spot with reliably delicious dishes/i)).toBeInTheDocument();
    expect(screen.getByText(/The lemon dessert is not to be missed/i)).toBeInTheDocument();
  });

  test('shows customer names', () => {
    renderWithProviders(<Testimonials />);
    
    expect(screen.getByText(/- Ava M./)).toBeInTheDocument();
    expect(screen.getByText(/- Liam K./)).toBeInTheDocument();
    expect(screen.getByText(/- Sofia R./)).toBeInTheDocument();
  });

  test('includes customer images', () => {
    renderWithProviders(<Testimonials />);
    
    expect(screen.getByAltText('Ava M.')).toBeInTheDocument();
    expect(screen.getByAltText('Liam K.')).toBeInTheDocument();
    expect(screen.getByAltText('Sofia R.')).toBeInTheDocument();
  });

  test('has proper semantic structure with figures', () => {
    renderWithProviders(<Testimonials />);
    
    const figures = screen.getAllByRole('figure');
    expect(figures).toHaveLength(3);
  });
});

describe('Specials Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<Specials />);
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
  });

  test('displays all special items', () => {
    renderWithProviders(<Specials />);
    
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Lemon Dessert')).toBeInTheDocument();
  });

  test('shows item descriptions', () => {
    renderWithProviders(<Specials />);
    
    expect(screen.getByText(/Crisp greens, feta, olives/i)).toBeInTheDocument();
    expect(screen.getByText(/Toasted bread, tomatoes, basil/i)).toBeInTheDocument();
    expect(screen.getByText(/Light lemon mousse with shortbread/i)).toBeInTheDocument();
  });

  test('displays prices', () => {
    renderWithProviders(<Specials />);
    
    expect(screen.getByText('$12')).toBeInTheDocument();
    expect(screen.getByText('$9')).toBeInTheDocument();
    expect(screen.getByText('$8')).toBeInTheDocument();
  });

  test('includes dish images', () => {
    renderWithProviders(<Specials />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });
});
