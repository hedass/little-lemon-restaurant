import React, { useState } from 'react';

const faqs = [
  { id: 1, q: 'Do you accept reservations?', a: 'Yes — reserve a table online or call us during opening hours.' },
  { id: 2, q: 'Do you offer vegetarian options?', a: 'We have vegetarian and gluten-friendly choices that change seasonally.' },
  { id: 3, q: 'Is parking available?', a: 'Limited street parking is available; public transit and rideshare are nearby.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="ll-section ll-faq" aria-labelledby="faq-heading">
      <div className="container">
        <h2 id="faq-heading">Help & Info</h2>
        <div className="ll-faq-list">
          {faqs.map(item => (
            <div key={item.id} className="ll-faq-item">
              <button
                aria-expanded={open === item.id}
                aria-controls={`faq-${item.id}`}
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="ll-faq-toggle"
              >
                {item.q}
                <span className="ll-faq-chev" aria-hidden>{open === item.id ? '−' : '+'}</span>
              </button>
              <div id={`faq-${item.id}`} role="region" className={`ll-faq-body ${open === item.id ? 'is-open' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
