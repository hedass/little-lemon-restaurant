import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import MenuHighlights from '../components/MenuHighlights';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Specials from '../components/Specials';
import About from '../components/About';
import Footer from '../components/Footer';

export default function HomeScreen() {
  return (
    <div className="home-screen">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <Testimonials />
        <Specials />
        <MenuHighlights />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
