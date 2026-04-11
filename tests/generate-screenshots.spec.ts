import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

// Check if we already have a saved session
const hasAuthFile = fs.existsSync(authFile);

// If you've already logged in, reuse the browser session state automatically!
if (hasAuthFile) {
  test.use({ storageState: authFile });
}

/**
 * Run this script using: npx playwright test tests/generate-screenshots.spec.ts
 * It will automatically capture the UI state and save screenshots to public/readme/
 */
test('generate application workflow screenshots', async ({ page }) => {
  // Set viewport to a standard desktop size
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. Capture Landing Page
  await page.goto('http://localhost:3000/');
  // Wait for animations to settle
  await page.waitForTimeout(1000); 
  await page.screenshot({ path: 'public/readme/landing-page.png', fullPage: true });

  // 2. Capture Authentication (Sign In / Sign Up)
  if (!hasAuthFile) {
    await page.getByRole('button', { name: 'Sign In' }).first().click();
    await page.waitForTimeout(2500); // Give the Clerk widget time to fully mount and animate
    await page.screenshot({ path: 'public/readme/sign-in.png' });
  }

  // 3. Capture Dashboard
  await page.goto('http://localhost:3000/dashboard');
  
  if (!hasAuthFile) {
    // If not authenticated, we log in automatically using the provided credentials
    console.log('\n⏳ Logging in automatically...');
    
    // Navigating to /dashboard while logged out likely redirected to the home page.
    // Open the Sign In modal if the email input is not already visible.
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    if (!(await emailInput.isVisible())) {
      await page.getByRole('button', { name: 'Sign In' }).first().click();
    }

    // Fill email
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('shyaml.cse162@gmail.com');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    
    // Fill password
    await page.locator('input[name="password"], input[type="password"]').first().waitFor({ state: 'visible' });
    await page.locator('input[name="password"], input[type="password"]').first().fill('Mhari@1319');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await page.waitForSelector('text=Total links', { timeout: 60000 });
    
    // Create .auth directory and save session so you don't have to log in next time!
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
    console.log('✅ Browser session saved! You won\'t need to log in next time.');
  } else {
    // We are already authenticated, just wait for the dashboard to load
    await page.waitForSelector('text=Total links', { timeout: 10000 });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/readme/dashboard.png', fullPage: true });

  // 4. Capture Create Link Modal
  await page.getByRole('button', { name: 'Create Link' }).first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/readme/create-link.png' });
  
  // Close Create Link modal before opening the next one
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 5. Capture Share Modal
  await page.getByRole('button', { name: 'Share Link' }).first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/readme/share-modal.png' });
});