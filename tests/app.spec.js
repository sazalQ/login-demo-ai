import { test, expect } from '@playwright/test';

test.describe('Main App', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/Vite \+ React/);
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Vite + React');
    
    // Check for logos
    await expect(page.locator('img[alt="Vite logo"]')).toBeVisible();
    await expect(page.locator('img[alt="React logo"]')).toBeVisible();
  });

  test('should increment counter when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find the counter button
    const counterButton = page.locator('button', { hasText: 'count is' });
    
    // Check initial state
    await expect(counterButton).toContainText('count is 0');
    
    // Click the button
    await counterButton.click();
    
    // Check if counter incremented
    await expect(counterButton).toContainText('count is 1');
    
    // Click multiple times
    await counterButton.click();
    await counterButton.click();
    
    // Check final state
    await expect(counterButton).toContainText('count is 3');
  });

  test('should have working external links', async ({ page, context }) => {
    await page.goto('/');
    
    // Test Vite link
    const viteLink = page.locator('a[href="https://vite.dev"]');
    await expect(viteLink).toBeVisible();
    await expect(viteLink).toHaveAttribute('target', '_blank');
    
    // Test React link
    const reactLink = page.locator('a[href="https://react.dev"]');
    await expect(reactLink).toBeVisible();
    await expect(reactLink).toHaveAttribute('target', '_blank');
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });
});