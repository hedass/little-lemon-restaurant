import React from 'react';

const steps = [
  { id: 1, title: 'Reserve a Table', text: 'Choose a time and let us know how many are joining you.' },
  { id: 2, title: 'Enjoy Your Meal', text: 'Relax and enjoy seasonal plates and attentive service.' },
  { id: 3, title: 'Share Your Experience', text: 'Tell friends, leave a review, and come back soon.' },
];

export default function HowItWorks() {
  return (
    <section className="ll-section ll-how" aria-labelledby="how-heading">
      <div className="container">
        <h2 id="how-heading">How It Works</h2>
        <p className="ll-sub">A simple three step experience.</p>
        <div className="ll-steps">
          {steps.map(s => (
            <div key={s.id} className="ll-step" role="article" aria-labelledby={`step-${s.id}`}>
              <div className="ll-step-number">{s.id}</div>
              <div>
                <h3 id={`step-${s.id}`}>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
