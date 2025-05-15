import { expect } from '@playwright/test';

import { createBdd } from 'playwright-bdd';

const { Then, When } = createBdd();

Then('I see that the link was sent message', async ({}) => {
  // Step: Then I see that the link was sent message
  // From: features/forgot_password.feature:17:5
});

When('I go to my email', async ({}) => {
  // Step: When I go to my email
  // From: features/forgot_password.feature:18:5
});


When('I open the email', async ({}) => {
  // Step: When I go to my email
  // From: features/forgot_password.feature:18:5
});


Then('I should see the SnippetSentry Reset Password page opens in my default browser', async ({}) => {
  // Step: When I go to my email
  // From: features/forgot_password.feature:18:5
});