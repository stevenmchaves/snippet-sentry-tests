import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { clickMenuOption } from "./steps";

const { Then } = createBdd();

export const validateHeading = Then("I should see {string} heading",
  async ({ page }, heading, exact = false, timeout = 0) => {
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
  async ({ page }, heading, exact = false, timeout = 0) => {
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

Then("I should see {string}", async ({ page }, expectedText) => {
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

Then("I should not see the {string} button", async ({ page }, buttonName) => {
  await page.waitForLoadState();
  for (const menuItem of qaExpectations.menu_items) {
    await clickMenuOption({ page }, menuItem);
    await page.waitForLoadState();
    expect
      .soft(page.getByRole("button", { name: buttonName }))
      .not.toBeVisible();
  }
});

Then("I should see the sidebar", async ({ page }) => {
  await page.waitForLoadState();
  const sidebar = await page.getByTestId("sidebar-root").elementHandle();
  if (sidebar === null) {
    new Error("Sidebar not found");
  } else {
    expect.soft(sidebar.isVisible()).toBeTruthy();
    // Find all 'a' elements within the element
    const linkElements = await sidebar.$$("a");
    expect
      .soft(linkElements.length)
      .toBe(qaExpectations.default_menu_items.length);
    const linkTexts = await Promise.all(
      linkElements.map(async (linkElement) => await linkElement.textContent())
    );
    expect(linkTexts).toEqual(qaExpectations.default_menu_items);
  }
});

Then("I should see the default page", async ({ page }) => {
  await page.waitForLoadState();
  const titleText = await page.title();
  const headerText = await page.textContent("h1");
  await expect.soft(page.locator("header")).toContainText(qaExpectations.heading);
  // Find all 'ul' elements on the page
  const ulElements = await page.$$("ul");
  expect.soft(ulElements.length).toBe(1);
  // Find all 'li' elements in the first 'ul'
  const liElements = await ulElements[0].$$("li");
  // there should be 2 'li' elements
  await expect
    .soft(page.locator("li").filter({ hasText: qaExpectations.signon_message }))
    .toBeVisible();
  // Find the first 'li' element
  const firstLiElement = liElements[0];
  // Get the text content of the first 'li' element
  const firstLiElementText = await firstLiElement.textContent();
  expect.soft(firstLiElementText).toContain(qaExpectations.signon_message);
  expect.soft(titleText).toContain("Example Store");
  expect(headerText).toContain("Example Store");
});
