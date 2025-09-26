import React from 'react';
import { useCartContext } from '../context/CartContext';

const featured = [
  { id: 1, name: 'Greek Salad', desc: 'Crisp greens, feta, olives, lemon vinaigrette.', img: '/assets/greek salad.jpg', price: 12.99 },
  { id: 2, name: 'Bruschetta', desc: 'Heirloom tomato, basil, olive oil on toasted bread.', img: '/assets/bruchetta.svg', price: 8.99 },
  { id: 3, name: 'Lemon Mousse', desc: 'Light mousse with shortbread and candied lemon.', img: '/assets/lemon dessert.jpg', price: 6.99 },
];

export default function MenuHighlights() {
  const { addToCart } = useCartContext();

  const handleAddToCart = (item) => {
    addToCart(item);
    // Show confirmation
    alert(`${item.name} added to cart!`);
  };

  return (
    <section id="menu" className="ll-section ll-menu-highlights" aria-labelledby="menu-highlights-heading">
      <div className="container">
        <h2 id="menu-highlights-heading">Menu Highlights</h2>
        <div className="ll-cards ll-highlight-cards">
          {featured.map(f => (
            <article key={f.id} className="ll-card" aria-labelledby={`feat-${f.id}`}>
              <img src={f.img} alt={f.name} loading="lazy" />
              <div className="ll-card-body">
                <h3 id={`feat-${f.id}`}>{f.name}</h3>
                <p>{f.desc}</p>
                <div className="ll-card-price">${f.price}</div>
                <button 
                  onClick={() => handleAddToCart(f)}
                  className="ll-btn ll-btn-primary ll-order-btn"
                  aria-label={`Add ${f.name} to cart`}
                >
                  Order Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
