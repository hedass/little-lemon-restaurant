import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="ll-footer" role="contentinfo">
      <div className="container ll-footer-inner">
        <div className="ll-contact">
          <p>123 Neighborhood St., City, State</p>
        </div>
        <div className="ll-hours">
          <p>Mon-Fri: 11:00 – 22:00</p>
        </div>
        <nav className="ll-social" aria-label="Social links">
          <ul>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a></li>
          </ul>
        </nav>
      </div>
      <div className="ll-footer-bottom">
        <small>&copy; {new Date().getFullYear()} Little Lemon</small>
      </div>
    </footer>
  );
}
