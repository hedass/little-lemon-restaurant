import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('littleLemonCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('littleLemonCart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart items to localStorage whenever cartItems changes (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('littleLemonCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // If new item, add with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove one item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        // If quantity > 1, decrease quantity
        return prevItems.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        // If quantity is 1, remove item completely
        return prevItems.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  // Remove all items of a specific type from cart
  const removeAllFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 12.99) * item.quantity, 0);
  };

  // Get total item count
  const getTotalItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    removeAllFromCart,
    clearCart,
    calculateTotal,
    getTotalItemCount,
    isLoaded
  };
};
