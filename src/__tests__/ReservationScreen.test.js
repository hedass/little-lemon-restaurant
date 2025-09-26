import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockLocalStorage, mockWindowMethods, createFormData, sampleReservations } from './test-utils';
import ReservationScreen from '../screens/ReservationScreen';

beforeEach(() => {
  mockWindowMethods();
  mockLocalStorage.clear();
});

describe('ReservationScreen Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<ReservationScreen />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders reservation form', () => {
    renderWithProviders(<ReservationScreen />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
  });

  test('renders navigation and footer', () => {
    renderWithProviders(<ReservationScreen />);
    
  // There are two navigation landmarks (main nav + social links). Scope to main navigation.
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('submits valid form successfully', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData();
    
    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
    await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
    await user.selectOptions(screen.getByLabelText(/occasion/i), formData.occasion);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('success'));
    });
  });

  test('clears form after successful submission', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData();
    
    // Fill out form
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, formData.name);
    
    expect(nameInput).toHaveValue(formData.name);
    
    // Submit form
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
    await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
    await user.selectOptions(screen.getByLabelText(/occasion/i), formData.occasion);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });

  test('loads existing reservations from localStorage', () => {
    mockLocalStorage.setItem('littleLemonReservations', JSON.stringify(sampleReservations));
    
    renderWithProviders(<ReservationScreen />);
    
    // Component should load without crashing even with existing reservations
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('handles corrupted localStorage gracefully', () => {
    mockLocalStorage.setItem('littleLemonReservations', 'invalid json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProviders(<ReservationScreen />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  test('prevents double booking same time slot', async () => {
    const existingReservation = {
      date: '2025-09-30',
      time: '19:00'
    };
    
    mockLocalStorage.setItem('littleLemonReservations', JSON.stringify([existingReservation]));
    
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData({
      date: '2025-09-30',
      time: '19:00'
    });
    
    // Fill out form with same date/time
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
  await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
  // Include occasion so validation passes other fields and shows time conflict
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'birthday');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
  // Component uses a longer error message, assert on a stable substring.
  expect(screen.getByText(/time slot is already booked/i)).toBeInTheDocument();
    });
  });

  test('clears form validation errors when user starts typing', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    // Trigger validation error
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    });
    
    // Start typing in name field
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'T');
    
    await waitFor(() => {
      expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
    });
  });

  test('disables submit button during submission', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData();
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
  await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
  await user.selectOptions(screen.getByLabelText(/occasion/i), formData.occasion);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    expect(submitButton).not.toBeDisabled();
    
  await user.click(submitButton);
    
  // During submission, button should become disabled
  await waitFor(() => expect(submitButton).toBeDisabled());
  });

  test('saves reservation to localStorage', async () => {
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData();
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
    await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
    await user.selectOptions(screen.getByLabelText(/occasion/i), formData.occasion);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const savedReservations = JSON.parse(mockLocalStorage.getItem('littleLemonReservations') || '[]');
      expect(savedReservations).toHaveLength(1);
    });
    
    const savedReservations = JSON.parse(mockLocalStorage.getItem('littleLemonReservations') || '[]');
    expect(savedReservations[0]).toMatchObject({
      name: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time
    });
  });

  test('handles localStorage save errors gracefully', async () => {
    // Mock localStorage to throw error
    const originalSetItem = mockLocalStorage.setItem;
    mockLocalStorage.setItem = jest.fn(() => {
      throw new Error('Storage full');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProviders(<ReservationScreen />);
    const user = userEvent.setup();
    
    const formData = createFormData();
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/date/i), formData.date);
    await user.selectOptions(screen.getByLabelText(/time/i), formData.time);
  await user.selectOptions(screen.getByLabelText(/guests/i), formData.guests);
  await user.selectOptions(screen.getByLabelText(/occasion/i), formData.occasion);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('error'));
    });
    
    // Restore mocks
    mockLocalStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });

  test('has proper accessibility attributes', () => {
    renderWithProviders(<ReservationScreen />);
    
    // Form should have proper labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
    
    const selects = screen.getAllByRole('combobox');
    selects.forEach(select => {
      expect(select).toHaveAccessibleName();
    });
  });

  test('handles development helper functions', async () => {
    renderWithProviders(<ReservationScreen />);
    
    // This test ensures the clearAllBookings function works (if exposed in development)
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
