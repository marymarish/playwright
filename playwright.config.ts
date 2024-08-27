import { defineConfig, devices } from '@playwright/test';
// ! 3 ENV. import env var "<TestOptions>" specified in created fille "test-options.ts" 
import type { TestOptions } from './test-options';

// ! to run test with provided URL in .env
require('dotenv').config();

// ! 2 ENV. extend env var "<TestOptions>" specified in created fille "test-options.ts" 
export default defineConfig<TestOptions>({
  timeout: 30000,
  // globalTimeout: 40000,
  expect: {
    timeout: 2000,
    // ! for screenshot comparisson
    toMatchSnapshot: {maxDiffPixels: 50}
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // ! could be specified as:
  // reporter: 'json',

  // ! or to save reporter into:
  // reporter: [['json', {outputFile: 'test-results/jsonReport.json'}]],

  // ! or for multiple reporters
  // reporter: [
  //   ['json', {outputFile: 'test-results/jsonReport.json'}],
  //   ['junit', {outputFile: 'test-results/junitReport.xlm'}],
  // ],

  // ! or install third party reporters # Alure
  // 1. brew install allure
  // 2. command: npm i -D @playwright/test allure-playwright --force
  // 3. then:
  reporter: [
    // ! aditional:
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        // ! don't require if there is direct connection between git and argos
        // token: "<YOUR-ARGOS-TOKEN>",
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xlm'}],
    // ['allure-playwright'],
    ['html']
  ],
  // 4. run command: 'allure generate allure-results -o allure-report'
  // 5. to open report, run: 'allure open allure-report'

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. 
    ! added baseURL instead hardcoded URL in the test */
    // baseURL: 'http://localhost:4200/',
    // ! additional URL for dragAndDrop.spec.ts
    globalsURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    // URL without project
    baseURL: process.env.ENV === 'DEV' ? 'http://localhost:4200/' 
      : process.env.ENV === 'STAGE' ? 'http://localhost:4200/' 
      : 'http://localhost:4200/',  // ! default value

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* ! to record video. The default resolution is 800 x 400. For higer resolution add size in property */
    video: {
      mode: 'off',
      size: {width: 1200, height: 600}
    },
    screenshot: "only-on-failure"
  },


  /* Configure projects for major browsers */
  projects: [
    // ! for dynamic baseURL create a project 'dev' or 'stage'
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      timeout: 20000,  // ! timeout in the project will overwrite general timeout
      fullyParallel: true // ! for parallel execution 
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox' 
      },  // instead "...devices['Desktop Firefox'] "
    },
    {
      // ! to create a project for provided test file
      name: 'pageObjectTest',
      testMatch: '001-usePOM.spec.ts',
      use: {
        viewport: {width: 1200, height: 600}
      }
    },
    // ! for test on mobile devices
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        // ! provide device 
        // ...devices['iPhone 11']
        // ! or view
        viewport: {width: 414, height: 800}
      }
    }
  ],

  // ! for docker container
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4201/'
  }
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
