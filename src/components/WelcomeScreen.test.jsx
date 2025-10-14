import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
    loginTime: '2023-01-01T12:00:00.000Z'
  };

  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it('renders welcome message with user name', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText('Welcome to Agilechain Dashboard')).toBeInTheDocument();
  });

  it('displays user email', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows appropriate greeting based on time', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    // Should show one of the greetings
    const greetings = ['Good Morning', 'Good Afternoon', 'Good Evening'];
    const hasGreeting = greetings.some(greeting => 
      screen.queryByText(new RegExp(greeting)) !== null
    );
    expect(hasGreeting).toBe(true);
  });

  it('handles logout confirmation flow', async () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    // Click logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Should show confirmation modal
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument();
    
    // Click confirm
    fireEvent.click(screen.getByText('Yes, Logout'));
    
    // Should call onLogout
    await waitFor(() => {
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('can cancel logout', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    // Click logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));
    
    // Modal should be closed
    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    expect(mockOnLogout).not.toHaveBeenCalled();
  });

  it('handles user without name gracefully', () => {
    const userWithoutName = {
      email: 'test@example.com'
    };
    
    render(<WelcomeScreen user={userWithoutName} onLogout={mockOnLogout} />);
    
    // Should use email prefix as name
    expect(screen.getByText(/test!/)).toBeInTheDocument();
  });

  it('shows dashboard and profile buttons', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });

  it('shows success message', () => {
    render(<WelcomeScreen user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('🎉 Login Successful!')).toBeInTheDocument();
    expect(screen.getByText('You have successfully logged into your account.')).toBeInTheDocument();
  });
});