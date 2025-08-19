import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/'); // Assuming Vite dev server runs on 5173

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click the "Get Started" link.
  await page.getByRole('link', { name: 'Get Started' }).click();

  // Expects the URL to contain a "#".
  await expect(page).toHaveURL(/#/);
});
