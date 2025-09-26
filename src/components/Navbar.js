import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItemCount } = useCartContext();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onDoc(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDoc);
    };
  }, []);

  const handleNavClick = () => {
    setOpen(false);
  };

  const handleHomeClick = (e) => {
    // Prevent the default link behavior and perform programmatic navigation
    // so we can ensure the page is at the top after navigating.
    e.preventDefault();
    setOpen(false);
    navigate('/');
    // Schedule a scroll to top after navigation/render. Use immediate timeout
    // to avoid interfering with hash anchor handling elsewhere.
    setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0 });
      } catch (err) {
        // ignore in non-browser environments
      }
    }, 0);
  };

  const handleSectionClick = (sectionId) => (e) => {
    e.preventDefault();
    setOpen(false);
    
    if (location.pathname === '/') {
      // On home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // On other pages, navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="ll-navbar" role="banner">
      <nav className="ll-nav container" aria-label="Main navigation" ref={navRef}>
        <div className="ll-brand">
          <Link to="/" className="ll-logo" onClick={handleHomeClick}>
            <img src="/assets/Logo.svg" alt="Little Lemon Logo" className="ll-logo-img" />
            <span className="ll-logo-text">Little Lemon</span>
          </Link>
        </div>

        <button
          className="ll-nav-toggle"
          aria-expanded={open}
          aria-controls="ll-nav-list"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden>☰</span>
        </button>

        <ul className={`ll-nav-list ${open ? 'is-open' : ''}`} id="ll-nav-list">
          <li>
            <Link 
              to="/" 
              onClick={(e) => { handleHomeClick(e); }}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <a href="#menu" onClick={handleSectionClick('menu')}>Menu</a>
          </li>
          <li>
            <a href="#about" onClick={handleSectionClick('about')}>About</a>
          </li>
          <li>
            <a href="#contact" onClick={handleSectionClick('contact')}>Contact</a>
          </li>
          <li>
            <Link 
              to="/reservation" 
              onClick={handleNavClick}
              className={location.pathname === '/reservation' ? 'active' : ''}
            >
              Reservations
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              onClick={handleNavClick}
              className={`ll-cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
            >
              Cart 🛒
              {getTotalItemCount() > 0 && (
                <span className="ll-cart-badge" aria-label={`${getTotalItemCount()} items in cart`}>
                  {getTotalItemCount()}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

