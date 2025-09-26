import React from 'react';

const reviews = [
  { id: 1, name: 'Ava M.', quote: 'Wonderful food and the staff made our night special.', img: '/assets/Mario and Adrian b.jpg' },
  { id: 2, name: 'Liam K.', quote: 'Cozy spot with reliably delicious dishes.', img: '/assets/restaurant chef B.jpg' },
  { id: 3, name: 'Sofia R.', quote: 'The lemon dessert is not to be missed!', img: '/assets/lemon dessert.jpg' },
];

export default function Testimonials() {
  return (
    <section className="ll-section ll-testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading">What People Say</h2>
        <div className="ll-test-grid">
          {reviews.map(r => (
            <figure key={r.id} className="ll-testimonial">
              <img src={r.img} alt={r.name} className="ll-test-img" loading="lazy" />
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>- {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
