import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { navigateToAlerts } from '../../steps/mpop/navigation/base-navigation.ts'
import AlertsPage from '../../steps/mpop/pages/alerts.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let browser: Browser
let context: BrowserContext
let page: Page
let alerts: AlertsPage

test.describe('Alerts page', () => {

  test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    alerts = await navigateToAlerts(page)
    await alerts.checkOnPage()
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    await alerts.checkOnPage()
  })
})