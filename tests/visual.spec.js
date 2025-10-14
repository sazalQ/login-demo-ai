import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match main page screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('main-page.png');
  });

  test('should match login form screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of login form area
    const loginForm = page.locator('.login-form');
    if (await loginForm.isVisible()) {
      await expect(loginForm).toHaveScreenshot('login-form.png');
    }
  });

  test('should match error state screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Trigger validation errors
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for errors to appear
      await page.waitForSelector('.error-message', { timeout: 5000 }).catch(() => {});
      
      // Take screenshot of form with errors
      const loginForm = page.locator('.login-form');
      if (await loginForm.isVisible()) {
        await expect(loginForm).toHaveScreenshot('login-form-errors.png');
      }
    }
  });

  test('should match loading state screenshot', async ({ page }) => {
    await page.goto('/');
    
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // Fill form with valid data
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      // Submit and quickly capture loading state
      await submitButton.click();
      
      // Take screenshot during loading
      const loginForm = page.locator('.login-form');
      await expect(loginForm).toHaveScreenshot('login-form-loading.png');
    }
  });
});

test.describe('Cross-browser Visual Tests', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should look consistent in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      // Only run this test for the current browser
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test in ${currentBrowser}`);
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot(`${browserName}-full-page.png`, {
        fullPage: true
      });
    });
  });
});