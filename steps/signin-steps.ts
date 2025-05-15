import { createBdd } from 'playwright-bdd';
import { Page } from 'playwright-core';

import { getEnvVar } from '../helpers/testHelpers';

const { Given, When } = createBdd();

Given('I open {string}', async ({ page: Page }, url: string) => { 
  await page.goto(url);
  // Wait for the new page to load
  await page.waitForLoadState();
});

When('I fill in the username field with {string}',
  async ({ page: Page }, username: string) => {
    await page.waitForLoadState();
    await page.getByLabel('UserName*').fill(getEnvVar(username));
  },
);

When('I fill in the password field with {string}',
  async ({ page: Page }, password) => {
    await page.waitForLoadState();
    await page.getByLabel('Password*').fill(getEnvVar(password));
  },
);

When('I click on the LOGIN button', async ({ page: Page }) => {
  await page.waitForLoadState();
  await page.getByRole('button', { name: 'LOGIN' }).click();
});

