import { expect, Page, Locator } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const actionTimeOut = 30000;

export const clickLink = When(
  'I click link {string}',
  async ({ page }, name) => {
    await page.getByRole('link', { name }).click();
  },
);

When('I click {string}', async ({ page }, buttonName) => {
  await page.waitForLoadState();
  await page.getByRole('button', { name: buttonName }).click();
});

export const clickMenuOption = When(
  'I click {string} menu option',
  async ({ page }, menu: string) => {
    await page.waitForLoadState();

    /*
      This is to avoid this error using the syntax below:
      Error: expect.toHaveText: Error: strict mode violation: getByTestId('sidebar-root').getByLabel('Home') resolved to 2 elements:
        1) <a href="/" aria-label="Home" class="MuiTypography-…>…</a> aka getByLabel('Home').first()
        2) <a href="/catalog" aria-label="Home" aria-current="…>…</a> aka locator('a').filter({ hasText: 'Home' })
    */
    const menuLink = page
      .getByTestId('sidebar-root')
      .getByLabel(menu)
      .filter({ hasText: menu });
    await menuLink.click();
  },
);

Then('I should see the Create button', async ({ page }) => {
  await page.waitForLoadState();
  expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
});

Then('I should not see the Create button', async ({ page }) => {
  await page.waitForLoadState();
  expect(await page.$('text="Create"')).toBeNull();
});

Then(
  'I should see error message\\(s) [{string}]',
  async ({ page }, error: string) => {
    if (error.includes('Please') || error.includes('This field is required') || error.includes('Value must')) {
      const errorMessage = await page.$eval('input:invalid', (el: HTMLInputElement) => el.validationMessage);
      expect(errorMessage).toContain(error);
    } else {
      await expect(page.getByText(error, { exact: false }).first()).toBeVisible();
    }
  },
);

Then(
  'I should see error message\\(s) [{string}, {string}]',
  async ({ page }, error: string, error2: string) => {
    if (error.includes('Please')) {
      const errorMessage = await page.$eval('input:invalid', (el: HTMLInputElement) => el.validationMessage);
      expect(errorMessage).toContain(error);
    } else {
      await expect.soft(page.getByText(error, { exact: false }).first()).toBeVisible();
      await expect(
        page.getByText(error2, { exact: false }).first(),
      ).toBeVisible();
    }
  },
);

Then('I enter {string} into the {string} textbox', async ({ page }, text: string, textbox: string) => {
  let textboxLocator = page.getByLabel(textbox, { exact: true })
  try {
    await textboxLocator.waitFor({ timeout: actionTimeOut });
  } catch (error) {
    console.log(`Textbox with text "${textbox}" was not found with the exact text, trying with aria-label`);
    textboxLocator = page.locator(`input[aria-label="${textbox}" i]`);

  }
  await textboxLocator.fill(text);
});

When('I attempt to enter {string} into the {string} textbox causing [{string}]', async ({ page }, text: string, textbox: string, errorMessage: string) => {
  let pass: boolean = false;
  try {
    await page.getByLabel(textbox, { exact: true }).fill(text);
  } catch (error) {
    if (error instanceof Error) {
      expect(error.stack).toContain(errorMessage);
      pass = true;
    } else {
      console.log('\nIs not an Error type\n');
    }
  }
  expect(pass, `"${errorMessage}" was not seen.`).toBeTruthy();
});

When(
  'I select {string} from the {string} Dropdown',
  async ({ page }, text: string, dropdown_name: string) => {
    if (text.length > 0) {
      const dropdownControl = page.getByLabel(dropdown_name, {exact: true });
      await dropdownControl.waitFor();
      // Scroll the element into view if needed
      await dropdownControl.scrollIntoViewIfNeeded();
      await dropdownControl.click();
      await page.getByRole('option', { name: text }).click();
    }
  },
);