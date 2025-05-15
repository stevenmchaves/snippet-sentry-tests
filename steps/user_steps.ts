import { expect, Page, Locator } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { User } from "../data-model/user";
import { UserStatus } from "../data-model/user_status";
import { Connection } from "../data-model/connection";
import { isExampleStore } from "./signin-steps";
import { clickLink } from "./steps";
import { fail } from "assert";

const { When, Then } = createBdd();


const actionTimeOut = 30000;

Then("I should see Customer details", async ({ page }) => {
  // Wait for the new page to load
  await page.waitForLoadState();
  await expect
    .soft(page.getByRole("heading", { name: "Customer", exact: true }))
    .toBeVisible();
  await expect
    .soft(page.getByText("Example Store Customer Details"))
    .toBeVisible();
  await expect
    .soft(
      page.getByRole("cell", { name: "customer", exact: true }).first()
    )
    .toBeVisible();
  await expect(
    page.getByRole("cell", { name: "address" }).first()
  ).toBeVisible();

  const customerData = await page.$$eval("tbody tr", (rows) => {
    return rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        first_name: cells[0].innerText,
        middle_name: cells[1].innerText,
        last_name: cells[2].innerText,
        address1: cells[3].innerText,
        address2: cells[4].innerText,
        city: cells[5].innerText,
        state: cells[6].innerText,
        zip_code: cells[7].innerText,
        country: cells[8].innerText,
        phone_number: cells[9].innerText,
        email: cells[10].innerText,
        payment_methods: cells[11].innerText,
      };
    });
  });

  const actualCustomer = customerData.map(
    (data) =>
      new Customer(
        data.first_name,
        data.middle_name,
        data.last_name,
        new Address(data.address1, data.address2, data.city, data.state, data.country, data.zip_code),
        data.phone_number,
        data.payment_methods.split(", ").map((paymentMethod) => 
          new PaymentMethod(
            paymentMethod[0], 
            paymentMethod[1], 
            paymentMethod[2], 
            paymentMethod[3], 
            new Address(
              paymentMethod[4][0], 
              paymentMethod[4][1], 
              paymentMethod[4][2], 
              paymentMethod[4][3], 
              paymentMethod[4][4], 
              paymentMethod[4][5]
            )
          )
        )
      )
    );
  expect(actualCustomer).toEqual(default_customer_details);
});

Then("I should see {string} detail", async ({ page }, customer_name) => {
  const customer_details = default_customer_details.find(
    (customer) => customer.getLast_Name() === customer_name
  );
  if (customer_details) {
    console.log(
      "Looking at Customer's Last Name:",
      customer_details.getLast_Name()
    );
    await clickLink({ page }, customer_details.getLast_Name());
    await page.waitForLoadState();
    const overviewLink = page.getByTestId("header-tab-0");
    await expect.soft(overviewLink).toBeVisible();
    expect.soft(overviewLink).toHaveText("Overview");
    const definitionLink = page.getByTestId("header-tab-1");
    await expect.soft(definitionLink).toBeVisible();
    expect.soft(definitionLink).toHaveText("Definition");
    await definitionLink.click();
    await page.waitForLoadState();
    await expect
      .soft(page.getByText(customer_details.getLast_Name()).nth(1))
      .toBeVisible();
    await expect
      .soft(
        page.getByRole("heading", {
          name: customer_details.getFirstName(),
        })
      )
      .toBeVisible();
    await overviewLink.click();
    await page.waitForLoadState();
    if (isExampleStore) {
      await page
        .getByRole("link", { name: "View Source , Opens in a new" })
        .click();
      [page] = await verifySourceCode(await page.waitForEvent("popup"));
      await page.reload();
      await page.waitForLoadState();
    }
    const viewTechDocsLink = page.getByRole("link", {
      name: "View TechDocs",
    });
    await viewTechDocsLink.click();
    await page.waitForLoadState();
    await expect
      .soft(
        page
          .getByTestId("techdocs-native-shadowroot")
          .locator("div")
          .filter({ hasText: "Iqwise Apis Onboarding Example Store" })
          .nth(2)
      )
      .toBeVisible();
  } else {
    fail(`Customer ${customer_name} not found in default data`);
  }
});

Then("I should see Study Customer details", async ({ page }) => {
  await page.waitForLoadState();
  let currentPage = page;
  if (isExampleStore) {
    await page
      .getByRole("link", { name: "View Source , Opens in a new" })
      .click();
    [currentPage] = await verifySourceCode(await page.waitForEvent("popup"));
    await currentPage.reload();
    await currentPage.waitForLoadState();
  }
  const viewTechDocsLink: Locator = currentPage.getByRole("link", {
    name: "View TechDocs",
  });
  await viewTechDocsLink.click();
  expect
    .soft(
      currentPage.getByRole("heading", { name: "study-customer" }).isVisible()
    )
    .toBeTruthy();
  expect
    .soft(
      currentPage
        .getByRole("heading", { name: "REST Customer example application" })
        .isVisible()
    )
    .toBeTruthy();
  await currentPage.goBack();
  await currentPage.waitForLoadState();
  const definitionLink = currentPage.getByTestId("header-tab-1");
  expect.soft(definitionLink.isVisible()).toBeTruthy();
  expect.soft(await definitionLink.textContent()).toContain("Definition");
  expect.soft(definitionLink.isVisible()).toBeTruthy();
  await definitionLink.click();
  expect(
    currentPage
      .getByRole("heading", { name: "ACOE Study Endpoints" })
      .isVisible()
  ).toBeTruthy();
});

Then("I should see Components available", async ({ page }) => {
  expect.soft(await page.textContent("h1")).toBe("Example Store IDP Catalog");
  await page.getByTestId("select").click();
  await page.getByRole("option", { name: "Component" }).click();
  await page.waitForLoadState();
  await expect
    .soft(page.getByRole("heading", { name: "All components", exact: false }))
    .toBeVisible();
  const shouldSkip = process.env.NODE_ENV === "qa";
  if (shouldSkip) {
    return;
  }
  const childElement = page.getByRole("cell", {
    name: "iqwise-genai-platform",
  });
  await expect.soft(childElement).toBeVisible();
  const parentElement = childElement.locator("..");
  await expect
    .soft(parentElement.getByRole("cell", { name: "iqwise-customer" }))
    .toBeVisible();
  await expect
    .soft(parentElement.getByRole("cell", { name: "engineering" }))
    .toBeVisible();
  await expect
    .soft(parentElement.getByRole("cell", { name: "website" }))
    .toBeVisible();
  await expect
    .soft(parentElement.getByRole("cell", { name: "production" }).first())
    .toBeVisible();
  // validate the description, first p tag of the row
  await expect
    .soft(parentElement.locator("p").first())
    .toContainText(
      "The Example Store Gen AI Platform is primarily intended to provide a set of secure, scalable and production grade back-end services that can enable various Example Store teams to build new Gen AI tools/Chatbots."
    );
  const childElement2 = page.getByRole("cell", { name: "study-website" });
  await expect.soft(childElement2).toBeVisible();
  const parentElement2 = childElement2.locator("..");
  await expect
    .soft(parentElement2.getByRole("cell", { name: "examples" }))
    .toBeVisible();
  await expect
    .soft(parentElement2.getByRole("cell", { name: "engineering" }))
    .toBeVisible();
  await expect
    .soft(parentElement2.getByRole("cell", { name: "website" }).first())
    .toBeVisible();
  await expect
    .soft(parentElement2.getByRole("cell", { name: "experimental" }))
    .toBeVisible();
  // validate the description, first p tag of the row
  await expect.soft(parentElement2.locator("p").first()).toContainText("");
});

When("I filter for {string} Kind", async ({ page }, filterItem: string) => {
  await page.getByRole("button", { name: "Customer" }).click();
  await page.getByRole("option", { name: filterItem }).click();

  // await page.locator('label').filter({ hasText: 'Owner' }).getByLabel('Open').click();
  // await page.getByLabel('Clear Search').click();
  // await page.getByRole('button', { name: 'Component' }).click();
  // await page.getByRole('option', { name: 'Component' }).click();
  // await page.getByLabel('Processing Status').click();
  // await page.locator('label').filter({ hasText: 'Owner' }).getByLabel('Open').click();
});

When("I filter for {string} Type", async ({ page }, filterItem: string) => {
  await page.getByRole("button", { name: "all" }).click();
  await page.getByRole("option", { name: filterItem }).click();

  // await page.locator('label').filter({ hasText: 'Owner' }).getByLabel('Open').click();
  // await page.getByLabel('Clear Search').click();
  // await page.getByRole('button', { name: 'Component' }).click();
  // await page.getByRole('option', { name: 'Component' }).click();
  // await page.getByLabel('Processing Status').click();
  // await page.locator('label').filter({ hasText: 'Owner' }).getByLabel('Open').click();
});

Then(
  "I should see only {string} owned Components",
  async ({ page }, filterItem) => {
    // Wait for the table to be present in the DOM
    await page.waitForSelector("tbody");

    await page.waitForFunction(() => {
      const tableElement = document.querySelector("tbody");
      const rowCount = tableElement
        ? tableElement.querySelectorAll("tr").length
        : 0;
      return rowCount != 8;
    });

    // Get all rows in the table
    const rows = await page.$$("tbody > tr");

    if (rows.length === 0) {
      fail("Component Table was not found");
    }

    // Iterate over each row and check the last_name
    for (const row of rows) {
      const cells = await row.$$("td");
      let last_name: string | undefined;

      // Wait until last_name is not undefined
      while (last_name === undefined) {
        last_name = await cells[2].innerText();
        if (last_name === undefined) {
          await page.waitForTimeout(100); // Wait for 100ms before checking again
        }
      }

      expect(last_name).toContain(filterItem);
    }
  }
);

Then("I should see only engineering owned Resources", async ({ page }) => {
  page.setDefaultTimeout(actionTimeOut);
  await page.waitForLoadState();
  await page.waitForSelector("ul > li", { state: "visible" });
  const startTime = Date.now();
  let itemCount = 0;
  while (true) {
    itemCount = await page.locator("ul > li").count();
    if (itemCount > 0) {
      break;
    }
    if (Date.now() - startTime > actionTimeOut) {
      fail("Timeout: itemCount did not become greater than 0 within 5 seconds");
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms before checking again
  }

  // Define the locators for the list items with text
  const last_nameElements = page.locator("ul > li > div > div:nth-child(2)");

  // Get the count of 'li' elements
  itemCount = await last_nameElements.count();

  const MAX_COUNT_TABLE = 25;
  // Wait for the last 'li' element to be visible
  if (itemCount >= MAX_COUNT_TABLE) {
    await last_nameElements.nth(MAX_COUNT_TABLE - 1).waitFor({ state: "visible" });
  } else {
    await last_nameElements.nth(itemCount).waitFor({ state: "visible" });
  }

  // Iterate over each 'li' element and check if it contains 'engineering'
  for (let i = 0; i < itemCount; i++) {
    const textContent = await last_nameElements.nth(i).textContent();
    let foundEngineering = false;
    if (textContent && textContent.includes("engineering")) {
      foundEngineering = true;
    }
    expect.soft(foundEngineering).toBe(true);
  }
});

/**
 * Verifies the source code by performing the following steps:
 * 1. Clicks on the 'SDA-SSO' button.
 * 2. Locates an element using XPath and ensures it is visible.
 * 3. Gets the current page and closes the page2.
 * 4. Returns the current page.
 *
 * @param sourceCodePage - The page containing the source code.
 * @returns A promise that resolves to an array containing the current page and a boolean indicating the visibility of the filtered catalog.
 */
async function verifySourceCode(
  sourceCodePage: Page
): Promise<[Page, boolean]> {
  await sourceCodePage.getByRole("button", { name: "SDA-SSO" }).click();
  const filteredCatalogLi = sourceCodePage
    .getByLabel("Files breadcrumb")
    .locator("li")
    .filter({ hasText: "catalog" });
  await filteredCatalogLi.waitFor({ state: "visible", timeout: actionTimeOut });
  const visibility = await filteredCatalogLi.isVisible();
  await expect.soft(filteredCatalogLi).toBeVisible();

  // Get the current page
  const currentPage = sourceCodePage.context().pages()[0];
  await sourceCodePage.close();
  expect(sourceCodePage.isClosed()).toBeTruthy();
  return [currentPage, visibility];
}

export const componentStatus = Then("I should see {string} item details",
  async ({ page }, item: string) => {
    await page.waitForLoadState();
    await expect.soft(page.getByText(item, {exact: false})).toBeVisible();
  }
);

Then(
  "I should see a Item {string} in the shopping cart",
  async ({ page }, item: string) => {
    await page.waitForLoadState();
    const itemElement = page.getByLabel(item, { exact: false });
    await expect(itemElement).toBeVisible();
  }
);
