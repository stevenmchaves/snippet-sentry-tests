import { defineConfig } from "@playwright/test";
import { generateProjects, defineBddConfig } from "playwright-bdd";


const testDir = defineBddConfig({
  features: "features/*.feature",
  steps: [
    "steps/*.ts",
  ],
});

export default defineConfig({
  globalTimeout: 1800000, // Sets global timeout to 30 minutes
  testDir,
  // get rid of the warning
  reportSlowTests: null,
  // timeout for each test
  timeout: 90_000,

  expect: {
    // timeout for each expect
    timeout: 15_000,
  },

  reporter: "list",
  use: {
    // timeout for each action
    actionTimeout: 15_000,
    // Navigation timeout
    navigationTimeout: 30000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    // Context options to ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },
  // If you want to define projects, do so here, or remove this line if not needed
  // projects: generateProjects(testDir, {}), // Pass testDir and options object
});
