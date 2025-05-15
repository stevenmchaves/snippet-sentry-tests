import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { isExampleStore } from './signin-steps';
import { validateNoHeading } from './steps-visual-customizations';
import { componentStatus } from './customer-steps';

const { Given, When, Then } = createBdd();

let generatedProjectName: string;

Given('I am on the Create Project Context page', async ({ page }) => {
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Choose' }).nth(1).click();
  await expect(page.getByRole('heading', { name: 'Project ' })).toBeVisible();
});

When(
  'I enter a {string} for the Short Project name',
  async ({ page }, project_name: string) => {
    if (project_name.length > 0) {
      await page.waitForLoadState();
      const proj_name_locator = page.locator('#validateName');
      await proj_name_locator.click();
      await proj_name_locator.fill(project_name);
    }
  },
);

When(
  'I enter a random project name for the Short Project name',
  async ({ page }) => {
    // Create a random project name to avoid conflicts. Prefix the project name with `qapr` to make it easier to identify for deletion, etc.
    generatedProjectName = `qapr${Math.random()
      .toString(36)
      .substring(2, 3)}`;
    await page.waitForLoadState();
    const proj_name_locator = page.locator('#validateName');
    await proj_name_locator.click();
    await proj_name_locator.fill(generatedProjectName);
  },
);

When(
  'I enter the random name full name for the Project Full Name.',
  async ({ page }) => {
    // Create a random project name to avoid conflicts. Prefix the project name with `qapr` to make it easier to identify for deletion, etc.
    const fullProjectName = generatedProjectName + 'hello';
    await page.waitForLoadState();
    const proj_name_locator = page.locator('#root_projectFullName');
    await proj_name_locator.click();
    await proj_name_locator.fill(fullProjectName);
  },
);

When(
  'I enter {string} for the project description',
  async ({ page }, project_description) => {
    if (project_description.length > 0) {
      await page.waitForLoadState();
      await page.getByLabel('Project description').fill(project_description);
    }
  },
);

Then(
  'I should see Project Context Source Control files created',
  async ({ page }) => {
    if (isExampleStore) {
      await page.waitForLoadState();
      const page2Promise = page.waitForEvent('popup');
      await page.getByRole('link', { name: 'Open in Getlab', exact: false }).click();
      const page2 = await page2Promise;
      await page2.getByRole('button', { name: 'SDA-SSO' }).click();
      await page2.waitForLoadState();
      const currentUrl = page2.url();
      expect.soft(currentUrl).toContain(generatedProjectName);
      await page2.close();
      expect(page2.isClosed()).toBeTruthy();
    } else {
      console.log('Not using Example Store Auth - Cannot validate Project Context Source Control files created');
    }
  },
);

Then('I should see Project Context in the Catalog', async ({ page }) => {
  // Set the action timeout to 300 seconds (300000 milliseconds)
  page.setDefaultTimeout(300000);
  await page.waitForLoadState();
  const page2Promise = page.waitForEvent('popup');
  page.getByRole('link', {
    name: 'Open in Catalog',
  }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState();
  expect(page2.url()).toContain(generatedProjectName);
  await validateNoHeading({ page: page2 }, 'Warning');
  await validateNoHeading({ page: page2 }, 'Error');
  await componentStatus({ page: page2 }, generatedProjectName);
});

Then('I should see Merge Request created', async ({ page }) => {
  // Set the action timeout to 60 seconds (60000 milliseconds)
  page.setDefaultTimeout(60000);
  if (isExampleStore) {
    const page2Promise = page.waitForEvent('popup');
    page.getByRole('link', { name: 'Merge Request' }).click();
    const page2 = await page2Promise;
    await page2.getByRole('button', { name: 'SDA-SSO' }).click();
    await page2.waitForLoadState();
    const currentUrl = page2.url();
    expect.soft(currentUrl).toContain(generatedProjectName);
    await page2.close();
    expect(page2.isClosed()).toBeTruthy();

  } else {
    console.log('Not using Example Store Auth - Cannot validate Merge Request created');
  }
});

When(
  'I select {string} from the {string} ComboBox',
  async ({ page }, text: string, dropdown_name: string) => {
    const comboxboxLocator = page.getByRole('combobox', {
      name: dropdown_name, exact: false,
    });
    await comboxboxLocator.waitFor();
    // Scroll the element into view if needed
    await comboxboxLocator.scrollIntoViewIfNeeded();
    await comboxboxLocator.click();
    if (text.length > 0) {
      await comboxboxLocator.fill(text);
      // Click away to close the dropdown
      await page.click('body');
    }
  },
);

Then(
  'I should see error message\\(s) {string}',
  async ({ page }, errors: string) => {
    if (errors.length > 0) {
      const errorArray = JSON.parse(errors);
      for (const item of errorArray) {
        await expect.soft(page.getByText(item)).toBeVisible();
      }
    }
  },
);


Then(
  'I should see Progress of Project Context Creation',
  async ({ page }) => {
    const timeout = 20000; // Set the timeout to 20 seconds (20000 milliseconds)
    await expect.soft(page.getByRole('button', { name: 'Create Project', exact: false })).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Generate Project Configuration$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Setup Project Data$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Setup Business Unit Data$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Merge GitLab$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Monitor Pipeline Plan$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Merge Request$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Monitor Pipeline Deploy$/ }).first()).toBeVisible({ timeout });
    await expect.soft(page.locator('div').filter({ hasText: /^Openmeter Event$/ }).first()).toBeVisible({ timeout });
    expect.soft(page.getByRole('button', { name: 'Start Over' })).toBeVisible({ timeout });
    expect.soft(page.getByRole('button', { name: 'Show Logs' })).toBeVisible({ timeout });
    expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible({ timeout });

  },
);

