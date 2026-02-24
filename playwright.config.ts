import { defineConfig, devices } from '@playwright/test';
import {
  secondsToMilliseconds
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/date-time.mjs'

import path from "path";

const ROOT_DIR = process.cwd();
// const testDir = defineBddConfig({
//   "paths": [
//     "src/test/**/features"
//   ],
//   "import":[
//     "src/test/**/*.ts"
//   ],
// });

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
 // testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  timeout: 180000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    viewport: null,
    actionTimeout: secondsToMilliseconds(30),
    timezoneId: 'Europe/London',
    launchOptions: { slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 150 },
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'off' : 'on',
    ...devices['Desktop Chrome'],
      headless: true,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
          // permissions: ["camera"],
          //...devices['Desktop Chrome'],
          launchOptions: {
              args: [
                '--start-maximized', 
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--use-file-for-fake-video-capture=/Users/aidan.filby/Desktop/MPOP/hmpps-manage-people-on-probation-ui-e2e-tests-1/src/test/fixtures/newfile.mjpeg'
              ],
          }

      },
    },
  ],
  globalTeardown: path.join(ROOT_DIR, "global-teardown.ts"),
});
