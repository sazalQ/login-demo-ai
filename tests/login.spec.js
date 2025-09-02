import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Note: You'll need to update this route based on how LoginPage is integrated
    // For now, assuming it's accessible at /login or integrated into the main page
    await page.goto('/');
  });

  test('should display login form elements', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.locator('h2', { hasText: 'Login' })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check labels
    await expect(page.locator('label[for="email"]')).toContainText('Email');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
    
    // Check placeholders
    await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'Enter your email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('placeholder', 'Enter your password');
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Check for validation errors
    await expect(page.locator('.error-message', { hasText: 'Email is required' })).toBeVisible();
    await expect(page.locator('.error-message', { hasText: 'Password is required' })).toBeVisible();
  });

  test('should show email validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Check for email validation error
    await expect(page.locator('.error-message', { hasText: 'Email is invalid' })).toBeVisible();
  });

  test('should show password validation error for short password', async ({ page }) => {
    // Enter valid email but short password
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Check for password validation error
    await expect(page.locator('.error-message', { hasText: 'Password must be at least 6 characters' })).toBeVisible();
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    // Submit empty form to trigger errors
    await page.locator('button[type="submit"]').click();
    
    // Verify errors are shown
    await expect(page.locator('.error-message', { hasText: 'Email is required' })).toBeVisible();
    await expect(page.locator('.error-message', { hasText: 'Password is required' })).toBeVisible();
    
    // Start typing in email field
    await page.locator('input[name="email"]').fill('t');
    
    // Email error should be cleared
    await expect(page.locator('.error-message', { hasText: 'Email is required' })).not.toBeVisible();
    
    // Password error should still be visible
    await expect(page.locator('.error-message', { hasText: 'Password is required' })).toBeVisible();
    
    // Start typing in password field
    await page.locator('input[name="password"]').fill('p');
    
    // Password error should be cleared
    await expect(page.locator('.error-message', { hasText: 'Password is required' })).not.toBeVisible();
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill form with valid data
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Check loading state
    await expect(page.locator('button[type="submit"]')).toContainText('Logging in...');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for loading to complete (simulated 1 second delay)
    await page.waitForTimeout(1100);
    
    // Check that loading state is cleared
    await expect(page.locator('button[type="submit"]')).toContainText('Login');
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled();
  });

  test('should handle successful login with valid credentials', async ({ page }) => {
    // Fill form with valid data
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('password123');
    
    // Listen for console logs to verify successful login
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for the simulated API call to complete
    await page.waitForTimeout(1100);
    
    // Verify no error messages are shown
    await expect(page.locator('.error-message')).not.toBeVisible();
    
    // Check console for success message (in a real app, you'd check for navigation or success UI)
    expect(consoleMessages.some(msg => msg.includes('Login successful'))).toBeTruthy();
  });

  test('should handle form input changes correctly', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    
    // Test email input
    await emailInput.fill('user@test.com');
    await expect(emailInput).toHaveValue('user@test.com');
    
    // Test password input
    await passwordInput.fill('mypassword');
    await expect(passwordInput).toHaveValue('mypassword');
    
    // Test clearing inputs
    await emailInput.clear();
    await passwordInput.clear();
    
    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should have proper form accessibility', async ({ page }) => {
    // Check that form inputs have proper labels
    await expect(page.locator('input[name="email"]')).toHaveAttribute('id', 'email');
    await expect(page.locator('label[for="email"]')).toBeVisible();
    
    await expect(page.locator('input[name="password"]')).toHaveAttribute('id', 'password');
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Check input types
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    // Fill form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('password123');
    
    // Press Enter in password field
    await page.locator('input[name="password"]').press('Enter');
    
    // Check that form submission started (loading state)
    await expect(page.locator('button[type="submit"]')).toContainText('Logging in...');
  });
});