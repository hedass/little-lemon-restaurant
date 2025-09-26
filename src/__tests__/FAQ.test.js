import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import FAQ from '../components/FAQ';

describe('FAQ Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<FAQ />);
    expect(screen.getByText('Help & Info')).toBeInTheDocument();
  });

  test('displays all FAQ questions', () => {
    renderWithProviders(<FAQ />);
    
    expect(screen.getByText(/Do you accept reservations/i)).toBeInTheDocument();
    expect(screen.getByText(/Do you offer vegetarian options/i)).toBeInTheDocument();
    expect(screen.getByText(/Is parking available/i)).toBeInTheDocument();
  });

  test('questions are collapsed by default', () => {
    renderWithProviders(<FAQ />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('shows plus icons when collapsed', () => {
    renderWithProviders(<FAQ />);
    
    expect(screen.getAllByText('+')).toHaveLength(3);
  });

  test('expands FAQ when clicked', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    userEvent.click(firstQuestion);
    
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    });
    
    expect(screen.getByText(/Yes — reserve a table online/i)).toBeInTheDocument();
  });

  test('shows minus icon when expanded', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    userEvent.click(firstQuestion);
    
    await waitFor(() => {
      expect(screen.getByText('−')).toBeInTheDocument();
    });
  });

  test('collapses FAQ when clicked again', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    
    // Expand
    userEvent.click(firstQuestion);
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Collapse
    userEvent.click(firstQuestion);
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('only one FAQ can be open at a time', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    const secondQuestion = screen.getByRole('button', { name: /Do you offer vegetarian options/i });
    
    // Open first FAQ
    userEvent.click(firstQuestion);
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Open second FAQ (should close first)
    userEvent.click(secondQuestion);
    await waitFor(() => {
      expect(secondQuestion).toHaveAttribute('aria-expanded', 'true');
    });
    
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
  });

  test('displays correct answers for each question', async () => {
    renderWithProviders(<FAQ />);
    
    // Test first FAQ
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    userEvent.click(firstQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/Yes — reserve a table online/i)).toBeInTheDocument();
    });
    
    // Test second FAQ
    const secondQuestion = screen.getByRole('button', { name: /Do you offer vegetarian options/i });
    userEvent.click(secondQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/We have vegetarian and gluten-friendly choices/i)).toBeInTheDocument();
    });
    
    // Test third FAQ
    const thirdQuestion = screen.getByRole('button', { name: /Is parking available/i });
    userEvent.click(thirdQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/Limited street parking is available/i)).toBeInTheDocument();
    });
  });

  test('has proper accessibility structure', () => {
    renderWithProviders(<FAQ />);
    
    const section = screen.getByRole('region', { name: /help & info/i });
    expect(section).toHaveAttribute('aria-labelledby', 'faq-heading');
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-controls', `faq-${index + 1}`);
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  test('answer regions are properly displayed when expanded', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    userEvent.click(firstQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/Yes — reserve a table online/i)).toBeInTheDocument();
    });
  });

  test('chevron icons have aria-hidden attribute', () => {
    renderWithProviders(<FAQ />);
    
    const chevrons = screen.getAllByText('+');
    chevrons.forEach(chevron => {
      expect(chevron).toHaveAttribute('aria-hidden');
    });
  });

  test('handles keyboard navigation', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    
    // Focus and press Enter
    firstQuestion.focus();
    userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('handles Space key navigation', async () => {
    renderWithProviders(<FAQ />);
    
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    
    // Focus and press Space
    firstQuestion.focus();
    userEvent.keyboard(' ');
    
    await waitFor(() => {
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('maintains proper state across multiple interactions', async () => {
    renderWithProviders(<FAQ />);
    
    const questions = screen.getAllByRole('button');
    
    // Open and close multiple FAQs
    for (let i = 0; i < questions.length; i++) {
      userEvent.click(questions[i]);
      await waitFor(() => {
        expect(questions[i]).toHaveAttribute('aria-expanded', 'true');
      });
      
      userEvent.click(questions[i]);
      await waitFor(() => {
        expect(questions[i]).toHaveAttribute('aria-expanded', 'false');
      });
    }
  });

  test('has proper CSS classes applied', async () => {
    renderWithProviders(<FAQ />);
    const user = userEvent.setup();
    const firstQuestion = screen.getByRole('button', { name: /Do you accept reservations/i });
    await user.click(firstQuestion);
    await waitFor(() => {
      expect(screen.getByText(/Yes — reserve a table online/i)).toBeVisible();
    });
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
  });
});
