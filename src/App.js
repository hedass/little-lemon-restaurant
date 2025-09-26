import './App.css';
import './styles/landing.css';
import './styles/cart.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import CartScreen from './screens/CartScreen';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Router>
    <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/reservation" element={<ReservationScreen />} />
            <Route path="/cart" element={<CartScreen />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
