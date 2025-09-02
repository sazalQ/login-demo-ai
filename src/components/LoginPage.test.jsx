import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('renders login form with all required elements', () => {
    render(<LoginPage />);
    
    // Check if the main elements are present
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields when form is submitted', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);
    
    // Check for validation error messages
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Fill in an invalid email and valid password
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    
    // Use fireEvent to bypass HTML5 validation
    const form = emailInput.closest('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for password shorter than 6 characters', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(passwordInput, '12345');
    await user.click(submitButton);
    
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('clears validation errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    // First, trigger validation error
    await user.click(submitButton);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    
    // Then start typing to clear the error
    await user.type(emailInput, 'test@example.com');
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock console.log to verify successful login
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Check if button shows loading state
    expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login successful:', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    consoleSpy.mockRestore();
  });

  it('disables submit button during form submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
  });

  it('updates input values when user types', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'mypassword');
    
    expect(emailInput).toHaveValue('user@test.com');
    expect(passwordInput).toHaveValue('mypassword');
  });

  it('applies error styling to invalid fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.click(submitButton);
    
    // Check if error class is applied
    expect(emailInput).toHaveClass('error');
  });
});