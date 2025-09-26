import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItemCount } = useCartContext();

  // Track last focused element to restore after closing menu (a11y)
  const lastFocusRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
      // Basic focus trap when open
      if (open && e.key === 'Tab') {
        const focusable = navRef.current?.querySelectorAll('[data-nav-focus]');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    function onDoc(e) {
      if (!open) return;
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDoc);
    };
  }, [open]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // restore focus
      if (lastFocusRef.current) {
        try { lastFocusRef.current.focus(); } catch(_) { /* ignore */ }
      }
    }
  }, [open]);

  const toggleMenu = () => {
    if (!open) {
      lastFocusRef.current = document.activeElement;
    }
    setOpen(v => !v);
  };

  const closeMenu = () => setOpen(false);

  const handleNavClick = () => {
    closeMenu();
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    closeMenu();
    navigate('/');
    setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0 });
      } catch (err) {
        // ignore
      }
    }, 0);
  };

  const handleSectionClick = (sectionId) => (e) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="ll-navbar" role="banner">
      <nav className="ll-nav container" aria-label="Main navigation" ref={navRef}>
        <div className="ll-brand">
          <Link to="/" className="ll-logo" onClick={handleHomeClick} data-nav-focus>
            <img src="/assets/Logo.svg" alt="Little Lemon Logo" className="ll-logo-img" />
            <span className="ll-logo-text">Little Lemon</span>
          </Link>
        </div>

        <button
          className="ll-nav-toggle"
          aria-expanded={open}
          aria-controls="ll-nav-list"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
          data-nav-focus
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden>{open ? '✕' : '☰'}</span>
        </button>

        {/* Overlay container for mobile full screen */}
        <div className={`ll-nav-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
          <ul className={`ll-nav-list ${open ? 'is-open' : ''}`} id="ll-nav-list">
            <li>
              <Link 
                to="/" 
                onClick={handleHomeClick}
                className={location.pathname === '/' ? 'active' : ''}
                data-nav-focus
              >
                Home
              </Link>
            </li>
            <li>
              <a href="#menu" onClick={handleSectionClick('menu')} data-nav-focus>Menu</a>
            </li>
            <li>
              <a href="#about" onClick={handleSectionClick('about')} data-nav-focus>About</a>
            </li>
            <li>
              <a href="#contact" onClick={handleSectionClick('contact')} data-nav-focus>Contact</a>
            </li>
            <li>
              <Link 
                to="/reservation" 
                onClick={handleNavClick}
                className={location.pathname === '/reservation' ? 'active' : ''}
                data-nav-focus
              >
                Reservations
              </Link>
            </li>
            <li>
              <Link 
                to="/cart" 
                onClick={handleNavClick}
                className={`ll-cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
                data-nav-focus
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
        </div>
      </nav>
    </header>
  );
}

