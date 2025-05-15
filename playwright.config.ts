import { defineConfig, ReporterDescription } from "@playwright/test";
import { defineBddConfig, cucumberReporter } from "playwright-bdd";
import * as dotenv from "dotenv";

import { expectations } from "./packages/app/e2e-tests/expects/expectations";
import { getFormattedDateTime } from "./packages/app/e2e-tests/helpers/testHelpers";
import { SpiraReporterOptions } from "./SpiraReporter";

const env = process.env.NODE_ENV;

if (typeof env === "undefined") {
  process.env.NODE_ENV = "dev";
}

const envPath = process.cwd() + "/e2e-" + env + ".env";

dotenv.config({ path: envPath });
const spiraReporterOptions: SpiraReporterOptions = {
  spiraUrl: process.env.SPIRATEST_URL || "",
  username: process.env.SPIRATEST_USERNAME || "",
  apiKey: process.env.SPIRATEST_TOKEN || "",
  projectId: process.env.SPIRATEST_PROJECT_ID || "",
  releaseId: process.env.SPIRATEST_RELEASE_ID,
  testSetId: process.env.SPIRATEST_TEST_SET_ID,
  testCases: {
    default: 475240,
    "Happy path Keycloak Login": 488320,
    "Create a Project Context": 475285,
    "Create a Project Context - Error Scenarios": 475286,
    "Update Customer Preferences": 472392,
    "Update Customer Preferences - Error Scenarios in first section": 488315,
    "Update Customer Preferences - cannot leave Virtual Network empty": 488316,
    "Update Customer Preferences - cannot leave Subnet Network empty": 488317,
    "Update Customer Preferences - Using New Subnet - error empty": 488318,
    "Update Customer Preferences - Using New Subnet": 488319,
    "Python Cookie Cutter - Gold Standard - Create Instance": 488322,
    "Create Instance - Error Scenarios in first section": 488323,
    "Create Instance - Error Scenarios in second section": 488324,
    "Create Instance - Error CosmosDB Throughput": 488325,
    "User belongs to Subscription groups": 479228,
    "User does not belong to Subscription groups": 488321,
    "Create Button does exist on Home Page": 475284,
    "Create Button does not exist on Customers Page": 475283,
    "Create Button does not exist on Cookie Cutters Page": 475282,
    "Default - components filtered on engineering owner": 472388,
    "Register Existing Component Button does not exist": 475281,
    "Register Existing Customer button does not exist": 471522,
    "Scaffolded should be replaced with Example Store": 471521,
    "Create Button Removed": 471520,
    "Check sidebar menu options": 471519,
    "Check the default Components available": 471518,
    "Check the Study Customer details": 471517,
    "Check the different IQWise Customer details": 471516,
    "Check the existence of Clinical Study Customers": 471510,
    "Check the existence of Customers": 471216,
  },
};

const spiraReporterTuple: [string, SpiraReporterOptions] = [
  "./SpiraReporter",
  spiraReporterOptions,
];

const testDir = defineBddConfig({
  features: "packages/app/e2e-tests/features/*.feature",
  steps: [
    "packages/app/e2e-tests/fixtures/*.ts",
    "packages/app/e2e-tests/steps/*.ts",
  ],
});

const testTime = getFormattedDateTime();

let result: ReporterDescription[] = [];
result.push(
  cucumberReporter("html", {
    outputFile: `e2e-test-report/${process.env.NODE_ENV}/cucumber-report-${testTime}.html`,
  })
);

if (process.env.NODE_ENV == "qa") {
  result.push(spiraReporterTuple);
}
const reporters = () => {
  return result;
};

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

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: reporters(),
  use: {
    // timeout for each action
    actionTimeout: 15_000,
    // Navigation timeout
    navigationTimeout: 30000,
    baseURL: expectations.baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    // Context options to ignore HTTPS errors
    ignoreHTTPSErrors: true,
    launchOptions: {
      // Use this ENV variable to run tests in headful mode so you can see what's happening
      slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || "0"),
    },
  },
  outputDir: `node_modules/.cache/e2e-test-results/${process.env.NODE_ENV}/${testTime}`,
  workers: 5, // Set the max number of workers
  //projects: generateProjects(), // Find all packages with e2e-test folders
});
