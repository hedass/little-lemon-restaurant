import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

export default function CartScreen() {
  return (
    <>
      <Navbar />
      <main>
        <Cart />
      </main>
      <Footer />
    </>
  );
}
