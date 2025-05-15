import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";


const { When, Then, Given } = createBdd();

export const validateHeading = Then("I should see {string} heading",
  async ({ page }, heading: string, exact = false, timeout = 0) => {
    await page.waitForLoadState();
    const options = { name: heading, exact: exact };
    if (timeout !== 0) {
      await expect(page.getByRole("heading", options)).toBeVisible({ timeout });
    } else {
      await expect(page.getByRole("heading", options)).toBeVisible();
    }
  }
);

Then("I should NOT see {string} heading",
  async ({ page }, heading: string, exact = false, timeout = 0) => {
    await page.waitForLoadState();
    const options = { name: heading, exact: exact };
    if (timeout !== 0) {
      await expect(page.getByRole("heading", options)).not.toBeVisible({
        timeout,
      });
    } else {
      await expect(page.getByRole("heading", options)).not.toBeVisible();
    }
  }
);

Then("I should see {string}", async ({ page }, expectedText: string) => {
  await page.waitForLoadState();
  await expect(page.getByText(expectedText)).toBeVisible();
});

export const dashboardPage = Then(
  "I should see the SnippetSentry Dashboard",
  async ({ page }) => {
    await page.waitForLoadState();
    try {
      await page.waitForURL("/");
    } catch (error) {
      throw new Error("Login to SnippetSentry Application failed");
    }
    await validateHeading({ page }, "SnippetSentry");
  }
);

Given('I am on the Manage Users screen', async ({}) => {
  // Step: Given I am on the Manage Users screen
  // From: features/manage_users.feature:15:5
});

When('I click the User Avatar', async ({}) => {
  // Step: When I click the User Avatar
  // From: features/manage_users.feature:118:7
});
