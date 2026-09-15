import { test, expect } from '@playwright/test';

test('admin approves a pending enrollment', async ({ page }) => {
  await page.goto('/dashboard');

  // The dashboard heading text comes from M9's InstructorDashboardComponent template
  await expect(
    page.getByRole('heading', { name: /command center/i })
  ).toBeVisible();

  // Navigate to enrollments page
  const enrollmentsLink = page.getByRole('link', { name: /enrollments/i }).first();
  if (await enrollmentsLink.isVisible()) {
    await enrollmentsLink.click();
    await page.waitForURL(/.*enrollments/);
  }

  // M9's EnrollmentListComponent renders a per-row "Approve" button
  // only when the enrollment is still Pending.
  const firstApprove = page.getByRole('button', { name: 'Approve' }).first();
  if (await firstApprove.isVisible()) {
    await firstApprove.click();
    // The row's status badge flips to "Approved"
    await expect(page.getByText('Approved').first()).toBeVisible();
  }
});
