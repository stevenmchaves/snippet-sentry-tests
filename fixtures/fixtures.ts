// fixtures.ts
// Note: import base from playwright-bdd, not from @playwright/test!
import { test as base, createBdd } from 'playwright-bdd';
import fs from 'fs';
import path from 'path';

type Fixtures = {
  // set types of your fixtures
};

export const { Given, When, Then } = createBdd(test);
