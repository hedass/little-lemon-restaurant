import React from 'react';

const props = [
  { id: 1, title: 'Fresh Ingredients', text: 'Locally sourced produce and proteins, prepared daily.', icon: '/assets/restaurant chef B.jpg' },
  { id: 2, title: 'Simple Menu', text: 'A concise menu of seasonal favorites made with care.', icon: '/assets/restauranfood.jpg' },
  { id: 3, title: 'Neighborhood Charm', text: 'A warm atmosphere where neighbors become regulars.', icon: '/assets/Mario and Adrian b.jpg' },
  { id: 4, title: 'Thoughtful Cocktails', text: 'Classic cocktails and modern twists using fresh ingredients.', icon: '/assets/greek salad.jpg' },
];

export default function ValueProps() {
  return (
    <section className="ll-section ll-valueprops" aria-labelledby="valueprops-heading">
      <div className="container">
        <h2 id="valueprops-heading">Why Little Lemon</h2>
        <p className="ll-sub">Simple values that shape every plate and pour.</p>
        <div className="ll-prop-grid">
          {props.map(p => (
            <article key={p.id} className="ll-prop" aria-labelledby={`prop-${p.id}`}>
              <div className="ll-prop-media">
                {/* Provide meaningful alt text so images are announced instead of treated as purely decorative */}
                <img
                  src={p.icon}
                  alt={`${p.title} icon`}
                  className="ll-prop-icon"
                  loading="lazy"
                />
              </div>
              <div className="ll-prop-body">
                <h3 id={`prop-${p.id}`}>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
