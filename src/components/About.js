import React from 'react';

export default function About() {
  return (
    <section id="about" className="ll-about" aria-labelledby="about-heading">
      <div className="container ll-about-inner">
        <h2 id="about-heading">About Little Lemon</h2>
        <div className="ll-about-grid">
          <div className="ll-about-text">
            <p>
              A charming neighborhood bistro serving simple food and classic cocktails in a lively but casual environment.
            </p>
            <p>
              We source local ingredients where possible and serve thoughtfully prepared dishes meant to be shared.
            </p>
          </div>
          <div className="ll-about-image">
            <img src="/assets/Mario and Adrian A.jpg" alt="Cozy restaurant interior with people dining" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
