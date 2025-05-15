import { expect } from '@playwright/test';

import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('I should see {string} Group', async ({ page }, group: string) => {
  await expect(page.getByRole('p', { name: group })).toBeVisible();
});
