import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { validateHeading } from "./steps-visual-customizations";

const { Given, When, Then } = createBdd();

let generatedProjectName: string;

Given("I am on the Create Customer Preferences page", async ({ page }) => {
  await page.getByRole("button", { name: "Create" }).click();
  const headingElement = page.getByRole("heading", {
    name: "Environment",
    exact: false,
  });

  // Ensure the <heading> element is found
  expect.soft(await headingElement.isVisible()).toBe(true);

  // Go up two levels to get the parent element
  const parentElement = headingElement.locator("..");
  const button = parentElement
    .locator("..")
    .getByRole("button", { name: "Choose" });

  // Wait for the button to be visible
  await expect(button).toBeVisible();

  // Click the button
  await button.click();
});

When(
  "I enter {string} for the Customer Preferences Entity",
  async ({ page }, entity = "gt_myproject1") => {
    const entity_locator = page.locator("#root_project");
    await entity_locator.click();
    await entity_locator.fill(entity);
    (await page.$("#root_project-option-0"))?.click();
  }
);

When(
  "I select {string} from the Customer Preferences Subscription",
  async ({ page }, subscription = "sub-nonprod-usbu-bdf01") => {
    // Find the <p> element with the specific text content
    const subElement = page.locator("#select-subscription");
    if (subscription.length > 0) {
      await expect.soft(page.locator("#select-subscription")).toContainText("");
      await subElement.click();
      const option = page.getByRole("option", { name: subscription });
      // Assert that the option element is visible
      await expect(option).toBeVisible();
      // Click the option element
      await option.click();
    }
  }
);

When(
  "I enter {string} for the Customer Preferences {string}",
  async ({ page }, option = "East US", dropdownLabel = "Location") => {
    await page.getByRole("button", { name: dropdownLabel + " *" }).click();
    if (option.length > 0) {
      await page.getByLabel(dropdownLabel + " *").fill(option);
      await page.getByRole("option", { name: option }).click();
    }
  }
);

Then("I should see Select Virtual Network section", async ({ page }) => {
  await expect
    .soft(page.getByRole("heading", { name: "Environment Template" }))
    .toBeVisible();
  await expect
    .soft(page.getByTestId("info-card-subheader").getByRole("paragraph"))
    .toContainText(
      "Template to create environments and configure GitLab projects."
    );
  await expect.soft(page.getByLabel("Step 1")).toContainText("Provide values");
  await expect
    .soft(page.getByLabel("Step 2"))
    .toContainText("Select Virtual Network");
  await expect
    .soft(page.getByLabel("Step 3"))
    .toContainText("Select Routable Subnet");
  expect(page.getByRole("button", { name: "Back" })).toBeVisible();
});

When(
  "I enter {string} in the Select Virtual Network section",
  async ({ page }, option = "az-vnet-ca-bdfcanada-t01 (rg-") => {
    await page.getByLabel("", { exact: true }).click();
    if (option.length > 0) {
      await page.getByRole("option", { name: option }).click();
    } else {
      // Click away to close the dropdown
      await page.click("body");
    }
  }
);

Then(
  "I should see Environment Creation Completion section",
  async ({ page }) => {
    await expect
      .soft(page.getByRole("button", { name: "Retrieve Project" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Create Environment" }))
      .toBeVisible();
    await expect
      .soft(
        page.getByRole("button", { name: "Generate Environment Configuration" })
      )
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Setup Environment Data" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Setup Project Data" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Setup Business Unit Data" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Merge GitLab" }))
      .toBeVisible();
    await expect.soft(page.getByPlaceholder("Search")).toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Hide Logs" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Show Logs" }))
      .not.toBeVisible();
    await page.getByRole("button", { name: "Hide Logs" }).click();
    await expect
      .soft(page.getByRole("button", { name: "Hide Logs" }))
      .not.toBeVisible();
    await expect(page.getByRole("button", { name: "Show Logs" })).toBeVisible();
  }
);

Then("I should see Customer Preferences in the Catalog", async ({ page }) => {
  await page.waitForLoadState();
  const openCatalogLink = page.getByRole("link", {
    name: "Open in Catalog",
  });
  await openCatalogLink.click();
  await page.waitForLoadState();
  await validateHeading({ page: page }, "Customer Preferences");
});

