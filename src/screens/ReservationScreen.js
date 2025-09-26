import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/reservation.css';

export default function ReservationScreen() {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  date: '',
  time: '',
  guests: '',
  occasion: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  // Local storage functions
  const getExistingBookings = () => {
    try {
      const bookings = localStorage.getItem('littleLemonReservations');
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Error reading reservations from localStorage:', error);
      return [];
    }
  };

  const saveBooking = (booking) => {
    try {
      const existingBookings = getExistingBookings();
      const newBooking = {
        ...booking,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      const updatedBookings = [...existingBookings, newBooking];
      localStorage.setItem('littleLemonReservations', JSON.stringify(updatedBookings));
      setExistingBookings(updatedBookings);
      return true;
    } catch (error) {
      console.error('Error saving reservation to localStorage:', error);
      return false;
    }
  };

  const isTimeSlotTaken = (date, time) => {
    const bookings = getExistingBookings();
    return bookings.some(booking => booking.date === date && booking.time === time);
  };

  // Load existing bookings on component mount
  useEffect(() => {
    setExistingBookings(getExistingBookings());
  }, []);

  // Development helper function to clear all bookings (remove in production)
  const clearAllBookings = () => {
    if (window.confirm('Are you sure you want to clear all reservations? This action cannot be undone.')) {
      localStorage.removeItem('littleLemonReservations');
      setExistingBookings([]);
      alert('All reservations have been cleared.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    // Email validation (simple)
    if (!formData.email) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    } else if (formData.date && isTimeSlotTaken(formData.date, formData.time)) {
      newErrors.time = 'This time slot is already booked. Please select a different time.';
    }
    
    if (!formData.guests || formData.guests < 1 || formData.guests > 10) {
      newErrors.guests = 'Please select number of guests (1-10)';
    }
    
    if (!formData.occasion) {
      newErrors.occasion = 'Please select an occasion';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Mock API call and save to localStorage
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save booking to localStorage
      const bookingSaved = saveBooking(formData);
      
      if (bookingSaved) {
        alert('Reservation submitted successfully! We will contact you shortly to confirm.');
        setFormData({ name: '', email: '', date: '', time: '', guests: '', occasion: '' });
        setErrors({});
      } else {
        alert('There was an error saving your reservation. Please try again.');
      }
    } catch (error) {
      alert('There was an error submitting your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-page">
      <Navbar />
      
      <main role="main">
      {/* Hero Section */}
      <section className="reservation-hero">
        <div className="reservation-hero-overlay" />
        <div className="container">
          <div className="reservation-hero-content">
            <h1 className="reservation-hero-title">Service Reservation</h1>
            <p className="reservation-hero-subtitle">Book your table at Little Lemon</p>
          </div>
        </div>
        <img 
          className="reservation-hero-bg" 
          src="/assets/restaurant.jpg" 
          alt="Little Lemon restaurant interior" 
          aria-hidden="true" 
        />
      </section>

      {/* Reservation Form */}
      <section className="reservation-form-section">
        <div className="container">
          <div className="reservation-form-card">
            <h2 className="form-title">Make a Reservation</h2>
            <form onSubmit={handleSubmit} className="reservation-form" noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="form-icon">🧑</span>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  aria-label="Enter your name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  required
                />
                {errors.name && (
                  <span id="name-error" className="form-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="form-icon">✉️</span>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  aria-label="Enter your email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <span id="email-error" className="form-error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  <span className="form-icon">📅</span>
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className={`form-input ${errors.date ? 'form-input-error' : ''}`}
                  aria-label="Select reservation date"
                  aria-describedby={errors.date ? 'date-error' : undefined}
                  required
                />
                {errors.date && (
                  <span id="date-error" className="form-error" role="alert">
                    {errors.date}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  <span className="form-icon">🕐</span>
                  Time
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`form-input ${errors.time ? 'form-input-error' : ''}`}
                  aria-label="Select reservation time"
                  aria-describedby={errors.time ? 'time-error' : undefined}
                  required
                >
                  <option value="">Select time</option>
                  {timeOptions.map(time => {
                    const isBooked = formData.date && isTimeSlotTaken(formData.date, time);
                    return (
                      <option
                        key={time}
                        value={time}
                        style={isBooked ? { color: '#999', fontStyle: 'italic' } : {}}
                        aria-label={isBooked ? `${time} (already booked)` : time}
                      >
                        {time}{isBooked ? ' (Booked)' : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.time && (
                  <span id="time-error" className="form-error" role="alert">
                    {errors.time}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="guests" className="form-label">
                  <span className="form-icon">👥</span>
                  Number of Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className={`form-input ${errors.guests ? 'form-input-error' : ''}`}
                  aria-label="Select number of guests"
                  aria-describedby={errors.guests ? 'guests-error' : undefined}
                  required
                >
                  <option value="">Select guests</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                {errors.guests && (
                  <span id="guests-error" className="form-error" role="alert">
                    {errors.guests}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="occasion" className="form-label">
                  <span className="form-icon">🎉</span>
                  Occasion
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className={`form-input ${errors.occasion ? 'form-input-error' : ''}`}
                  aria-label="Select occasion"
                  aria-describedby={errors.occasion ? 'occasion-error' : undefined}
                  required
                >
                  <option value="">Select occasion</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
                {errors.occasion && (
                  <span id="occasion-error" className="form-error" role="alert">
                    {errors.occasion}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`form-submit ${isSubmitting ? 'form-submit-loading' : ''}`}
                aria-label="Submit reservation"
              >
                {isSubmitting ? 'Submitting...' : 'Reserve Table'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Existing Bookings Section */}
      {existingBookings.length > 0 && (
        <section className="existing-bookings-section">
          <div className="container">
            <h2 className="existing-bookings-title">Current Reservations</h2>
            <p className="existing-bookings-subtitle">
              {existingBookings.length} time slot{existingBookings.length !== 1 ? 's are' : ' is'} currently booked:
            </p>
            <div className="existing-bookings-grid">
              {existingBookings
                .sort((a, b) => {
                  const dateA = new Date(a.date + ' ' + a.time);
                  const dateB = new Date(b.date + ' ' + b.time);
                  return dateA - dateB;
                })
                .map((booking) => {
                  const bookingDate = new Date(booking.date);
                  const formattedDate = bookingDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  return (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-date">
                        <span className="booking-icon">📅</span>
                        <span className="booking-text">{formattedDate}</span>
                      </div>
                      <div className="booking-time">
                        <span className="booking-icon">🕐</span>
                        <span className="booking-text">{booking.time}</span>
                      </div>
                      <div className="booking-guests">
                        <span className="booking-icon">👥</span>
                        <span className="booking-text">{booking.guests} guests</span>
                      </div>
                      {booking.occasion && (
                        <div className="booking-occasion">
                          <span className="booking-icon">🎉</span>
                          <span className="booking-text">{booking.occasion}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            {/* Development Admin Panel */}
            {process.env.NODE_ENV === 'development' && (
              <div className="admin-panel">
                <button 
                  type="button" 
                  onClick={clearAllBookings}
                  className="admin-button"
                >
                  Clear All Reservations (Dev Only)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="contact-title">Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h3>Write Us</h3>
              <p>info@littlelemon.com</p>
              <p>reservations@littlelemon.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>Reservations: (555) 123-4567</p>
              <p>General: (555) 123-4568</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h3>Visit Us</h3>
              <p>123 Main Street<br />Chicago, IL 60601</p>
              <p>Open daily 11am - 10pm</p>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
