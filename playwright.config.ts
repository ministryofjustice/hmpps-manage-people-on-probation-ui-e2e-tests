import { defineConfig, devices } from '@playwright/test';
import {
  secondsToMilliseconds
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/date-time.mjs'
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['features/smoke/*.feature'],
  require: ['features/smoke/*.steps.ts'],
  importTestFrom: 'features/fixtures.ts',
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  reporter: [
        ['github'],
        ['line'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'junit.xml' }],
        ['json', { outputFile: 'results.json' }],
    ],
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  timeout: 120000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: secondsToMilliseconds(30),
    timezoneId: 'Europe/London',
    launchOptions: { slowMo: 150 },
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'off' : 'on',
    ...devices['Desktop Chrome'],
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
