import { createBdd } from 'playwright-bdd';
import { Page } from 'playwright-core';

import { getEnvVar } from '../helpers/testHelpers';

const { Given, When, Then } = createBdd();

Then('I should see the SnippetSentry Login page', async ({}) => {
  // Step: Then I should see the SnippetSentry Login page
  // From: features/forgot_password.feature:28:5
});

Given('I open {string}', async ({ page }, url: string) => { 
  await page.goto(url);
  // Wait for the new page to load
  await page.waitForLoadState();
});

Given('I am logged in as {string} with {string}', async ({page}, username: string, password: string) => {
  await enterUserName(username);
  await enterPassword(password);
  await page.getByRole('button', { name: 'LOGIN' }).click();
  // From: features/manage_users.feature:14:5
});

export const enterUserName = When('I fill in the username field with {string}',
  async ({ page }, username: string) => {
    await page.waitForLoadState();
    await page.getByLabel('UserName*').fill(getEnvVar(username));
  },
);

export const enterPassword = When('I fill in the password field with {string}',
  async ({ page }, password: string) => {
    await page.waitForLoadState();
    await page.getByLabel('Password*').fill(getEnvVar(password));
  },
);

When('I click on the LOGIN button', async ({ page }) => {
  await page.waitForLoadState();
  await page.getByRole('button', { name: 'LOGIN' }).click();
});

