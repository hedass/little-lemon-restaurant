import React from 'react';

export default function CTA() {
  return (
    <section className="ll-section ll-cta-section" aria-labelledby="final-cta">
      <div className="container ll-cta-wrap">
        <h2 id="final-cta">Make a Reservation</h2>
        <p className="ll-sub">We look forward to hosting you. Reserve a table or browse our menu.</p>
        <div className="ll-cta-actions">
          <a href="#reservations" className="ll-cta ll-cta-hero">Reserve a Table</a>
          <a href="#menu" className="ll-cta ll-cta-outline">View Menu</a>
        </div>
      </div>
    </section>
  );
}
