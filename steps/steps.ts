import { expect, Page, Locator } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const actionTimeOut = 30000;

export const clickLink = When('I click the link {string}',
  async ({ page }, name: string) => {
    await page.getByRole('link', { name }).click();
  },
);

export const clickLinkWithExactText = When('I click link with exact text {string}',
  async ({ page }, name: string) => {
    await page.getByRole('link', { name, exact: true }).click();
  },
);

Then('I should see the {string} link', async ({page}, link: string) => {
  // Step: And I should see the "Send email invite" link
  // From: features/manage_users.feature:26:5
});

When('I click the {string} button', async ({ page }, buttonName: string) => {
  await page.waitForLoadState();
  await page.getByRole('button', { name: buttonName }).click();
});


Then('I should see the {string} button', async ({ page }, buttonName: string) => {
  await page.waitForLoadState();
  expect(page.getByRole('button', { name: buttonName })).toBeVisible();
});

Then('I should not see the {string} button', async ({ page }, buttonName: string) => {
  await page.waitForLoadState();
  expect(await page.$('text='+buttonName)).toBeNull();
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

Then('I should see the {string} textbox', async ({ page }, textbox: string) => {
  let textboxLocator = page.getByLabel(textbox, { exact: true })
  try {
    await textboxLocator.waitFor({ timeout: actionTimeOut });
  } catch (error) {
    console.log(`Textbox with text "${textbox}" was not found with the exact text, trying with aria-label`);
    textboxLocator = page.locator(`input[aria-label="${textbox}" i]`);

  }
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

When('I select {string} from the {string} Dropdown',
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

When('I select the {string} checkbox',
  async ({ page }, text: string) => {
    await page.getByRole('checkbox', { name: text }).click();
  },
);

Then('I should see the text {string}', async ({ page }, group: string) => {
  await expect(page.getByRole('p', { name: group })).toBeVisible();
});

Then('I should see the {string} checkbox', async ({ page }, arg: string) => {
  await expect(page.getByRole('checkbox', { name: arg })).toBeVisible();
});

Then('I should see the Dismiss button', async ({}) => {
  // Step: And I should see the Dismiss button
  // From: features/manage_users.feature:35:5
});

When('I click the Dismiss button', async ({}) => {
  // Step: And I should see the Dismiss button
});

Then('I should see the {string} Modal close', async ({}, arg: string) => {
  // Step: Then I should see the "Add User" Modal close
  // From: features/manage_users.feature:52:7
});

Then('I should see the {string} pop-up', async ({}, arg: string) => {
  // Step: And I should see "User Added Successfully!" pop-up
  // From: features/manage_users.feature:53:7
});

When('I go to Gmail app', async ({}) => {
  // Step: When I go to Gmail app
  // From: features/manage_users.feature:104:7
});

When('Open the SnippetSentry email', async ({}) => {
  // Step: And Open the SnippetSentry email
  // From: features/manage_users.feature:105:7
});

When('I refresh the screen', async ({page: Page}) => {
  // Step: When I refresh the screen
  Page.reload();
});