import React from 'react';

const dishes = [
  { id: 1, name: 'Greek Salad', desc: 'Crisp greens, feta, olives, and lemon vinaigrette.', img: '/assets/greek salad.jpg', price: '$12' },
  { id: 2, name: 'Bruschetta', desc: 'Toasted bread, tomatoes, basil, and olive oil.', img: '/assets/bruchetta.svg', price: '$9' },
  { id: 3, name: 'Lemon Dessert', desc: 'Light lemon mousse with shortbread.', img: '/assets/lemon dessert.jpg', price: '$8' },
];

export default function Specials() {
  return (
    <section className="ll-specials" aria-labelledby="specials-heading">
      <div className="container">
        <h2 id="specials-heading">Chef's Specials</h2>
        <div className="ll-cards">
          {dishes.map(d => (
            <article key={d.id} className="ll-card" aria-labelledby={`dish-${d.id}`}>
              <img src={d.img} alt={`${d.name}`} loading="lazy" />
              <div className="ll-card-body">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px'}}>
                  <h3 id={`dish-${d.id}`}>{d.name}</h3>
                  <div className="price">{d.price}</div>
                </div>
                <p>{d.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
