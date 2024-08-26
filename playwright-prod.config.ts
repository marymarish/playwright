import { defineConfig, devices } from '@playwright/test';
// ! 3 ENV. import env var "<TestOptions>" specified in created fille "test-options.ts" 
import type { TestOptions } from './test-options';

// ! to run test with provided URL in .env
require('dotenv').config();

// ! 2 ENV. extend env var "<TestOptions>" specified in created fille "test-options.ts" 
export default defineConfig<TestOptions>({

  use: {
    globalsURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.ENV === 'DEV' ? 'http://localhost:4200/' 
      : process.env.ENV === 'STAGE' ? 'http://localhost:4200/' 
      : 'http://localhost:4200/',  // ! default value
  },

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
    // {
    //   name: 'mobile',
    //   testMatch: 'testMobile.spec.ts',
    //   use: {
    //     ...devices['iPhone 11']
    //   }
    // }
  ],
});
