import React from 'react';
import { useCartContext } from '../context/CartContext';

export default function Cart() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    removeAllFromCart, 
    clearCart, 
    calculateTotal 
  } = useCartContext();

  // Checkout function
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    console.log('Checkout initiated with items:', cartItems);
    console.log('Total amount: $', calculateTotal().toFixed(2));
    
    alert(`Thank you for your order! Total: $${calculateTotal().toFixed(2)}\nYour order has been placed successfully.`);
    
    // Clear cart after checkout
    clearCart();
  };

  return (
    <section className="ll-section ll-cart" aria-labelledby="cart-heading">
      <div className="container">
        <h1 id="cart-heading">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="ll-cart-empty">
            <p>Your cart is empty.</p>
            <p>Browse our menu to add delicious items!</p>
          </div>
        ) : (
          <>
            <div className="ll-cart-items">
              {cartItems.map(item => (
                <article key={item.id} className="ll-cart-item">
                  <div className="ll-cart-item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="ll-cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="ll-cart-item-desc">{item.desc}</p>
                    <div className="ll-cart-item-price">
                      ${(item.price || 12.99).toFixed(2)} each
                    </div>
                  </div>
                  <div className="ll-cart-item-controls">
                    <div className="ll-quantity-controls">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ll-btn ll-btn-secondary ll-btn-sm"
                        aria-label={`Remove one ${item.name} from cart`}
                      >
                        -
                      </button>
                      <span className="ll-quantity">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="ll-btn ll-btn-secondary ll-btn-sm"
                        aria-label={`Add one more ${item.name} to cart`}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeAllFromCart(item.id)}
                      className="ll-btn ll-btn-outline ll-btn-sm"
                      aria-label={`Remove all ${item.name} from cart`}
                    >
                      Remove All
                    </button>
                  </div>
                  <div className="ll-cart-item-total">
                    ${((item.price || 12.99) * item.quantity).toFixed(2)}
                  </div>
                </article>
              ))}
            </div>

            <div className="ll-cart-summary">
              <div className="ll-cart-total">
                <h3>Total: ${calculateTotal().toFixed(2)}</h3>
              </div>
              <div className="ll-cart-actions">
                <button 
                  onClick={clearCart}
                  className="ll-btn ll-btn-outline"
                  aria-label="Clear entire cart"
                >
                  Clear Cart
                </button>
                <button 
                  onClick={handleCheckout}
                  className="ll-btn ll-btn-primary"
                  aria-label="Proceed to checkout"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
