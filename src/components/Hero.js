import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="ll-hero ll-hero-hero" aria-labelledby="hero-heading">
      <div className="ll-hero-overlay" />
      <div className="container ll-hero-inner">
        <div className="ll-hero-text">
          <h1 id="hero-heading" className="ll-title">Little Lemon</h1>
          <p className="ll-tagline">Simple food. Classic cocktails. Neighborhood charm — locally sourced, thoughtfully prepared.</p>
          <div className="ll-hero-actions" role="group" aria-label="Primary actions">
            <Link to="/reservation" className="ll-cta" role="button" aria-label="Reserve a table at Little Lemon">Reserve a Table</Link>
            <a href="#menu" className="ll-cta ll-cta-outline" aria-label="View menu">View Menu</a>
          </div>
        </div>
      </div>
      <img className="ll-hero-bg" src="/assets/restauranfood.jpg" alt="Restaurant table with dishes and warm lighting" aria-hidden="true" />
    </section>
  );
}
