import { test as setup, expect } from '@playwright/test';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  // Fill credentials using accessible form labels
  await page.getByLabel(/email|username/i).fill(
    process.env.TMS_ADMIN_EMAIL ?? process.env.TMS_ADMIN_USER ?? 'admin'
  );
  await page.getByLabel('Password').fill(
    process.env.TMS_ADMIN_PASS ?? 'Password123!'
  );

  // Click the submit button
  const submitButton = page.locator('button.submit-btn, button[type="submit"]').first();
  await submitButton.click();

  // M9's InstructorDashboardComponent renders Command Center heading
  await expect(
    page.getByRole('heading', { name: /command center/i })
  ).toBeVisible({ timeout: 15000 });

  // Save authenticated state for reuse
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});
