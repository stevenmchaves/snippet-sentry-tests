import { expect, Page, Locator } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { User } from "../data-model/user";
import { DataTable } from "playwright-bdd/dist/types";
import { fail } from "assert";
const { Given, When, Then } = createBdd();


Then("I should see User details", async ({ page }) => {
  // Wait for the new page to load
  await page.waitForLoadState();
  await expect
    .soft(page.getByRole("heading", { name: "User", exact: true }))
    .toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Name" }).first()
  ).toBeVisible();

  const userData = await page.$$eval("tbody tr", (rows) => {
    return rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return {
        first_name: cells[0].innerText,
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

  const actualUser = userData.map(
    (data: User) =>
      new User(
        data.isAdmin(),
        data.getFirstName(),
        data.getLastName(),
        data.getEmail(),
        data.getStatus(),
        data.getPhoneNumber(),
        data.getNotes(),
        data.getConnections()
      )
    );
});

Then("I should see the {string} modal", async ({ page }, modal_name: string) => {
  await expect
    .soft(
      page.getByRole("heading", {
          name: modal_name
        })
      )
      .toBeVisible();
});


Then("I should see the User List table",
  async ({ page }) => {
    // Wait for the table to be present in the DOM
    await page.waitForSelector("tbody");

    // Get all rows in the table
    const rows = await page.$$("tbody > tr");

    if (rows.length === 0) {
      fail("Table was not found");
    }
  }
);

Then('I should see the Default US dial prefix', async ({}) => {
  // Step: And I should see the Default US dial prefix
  // From: features/manage_users.feature:31:5
});

Then('I should see {int} user in the Users List', async ({}, arg: number) => {
  // Step: Then I should see 1 user in the Users List
  // From: features/manage_users.feature:43:7
});


Then('I see the User List table with the following users:', async ({}, dataTable: DataTable) => {
  // Step: And I see the User List table with the following users:
  // From: features/manage_users.feature:54:7
});

Then('I should see the user row with the Email {string}', async ({}, arg: string) => {
  // Step: Then I should see the user row with the Email "stevenmchaves@gmail.com"
  // From: features/manage_users.feature:87:7
});

Then('I should see the user {string} should have the following details:', async ({}, arg: string, dataTable: DataTable) => {
  // Step: And I should see the user "stevenmchaves@gmail.com" should have the following details:
  // From: features/manage_users.feature:88:7
});

Given('I have created {string} user as a {string} user.', async ({}, arg: string, arg1: string) => {
  // Step: Given I have created "portchavz@gmail.com" user as a "normal" user.
  // From: features/manage_users.feature:94:7
});

Then('I should see at least {int} user rows in the Users List', async ({}, arg: number) => {
  // Step: Then I should see at least 2 user rows in the Users List
  // From: features/manage_users.feature:99:7
});

When('I click on the Name link for the user {string}', async ({}, arg: string) => {
  // Step: When I click on the Name link for the user "portchavz@gmail.com"
  // From: features/manage_users.feature:100:7
});

Then('I should see a new Browser Window and\\/or Tab open with the Email address verified heading', async ({}) => {
  // Step: Then I should see a new Browser Window and/or Tab open with the Email address verified heading
  // From: features/manage_users.feature:107:7
});

Then('I should see the user {string} details shows {string} as the Phone entry in the Users List table', async ({}, arg: string, arg1: string) => {
  // Step: And I should see the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
  // From: features/manage_users.feature:160:7
});
