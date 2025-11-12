import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import ActivityLogPage from '../../steps/mpop/pages/activity-log.page.ts'
import { testCrn } from '../../steps/test-data.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let activityLog: ActivityLogPage

test.describe('Activity log page', () => {

  test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await loginToManageMySupervision(page)
    activityLog = new ActivityLogPage(page)
    await activityLog.goTo(crn)
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    await activityLog.checkOnPage()
  })
  test('View default view', async() => {
    const card = activityLog.getTimelineCard(1)
    await expect(card).toContainText("Planned office visit (NS) at 3:15pm")
    await expect(activityLog.getClass("govuk-details__summary", card)).toContainText("Notes (sensitive)")
  })
  test('View compact view', async() => {
    await activityLog.changeView()
    await expect(activityLog.getTimelineCard(1)).toContainText("Planned office visit (NS) at 3:15pm")
  })
  test('Apply filters', async() => {
    await activityLog.fillText('keywords', "Email")
    await activityLog.fillText('date-from', "26/9/2024")
    await activityLog.fillText('date-to', "26/9/2024")
    await activityLog.getQA('submit-button').click()

    const card = activityLog.getTimelineCard(1)
    await expect(card).toContainText("Email/text from other at 4:36pm")
  })
  test('Apply more filters', async() => {
    await activityLog.toggleComplianceFilter(0)
    await activityLog.toggleComplianceFilter(0)
    await activityLog.toggleComplianceFilter(1)
    await activityLog.toggleComplianceFilter(2)
    
    await activityLog.getQA('submit-button').click()

    const card = activityLog.getTimelineCard(1)
    await expect(activityLog.getTimelineCard(1)).toContainText("Planned office visit (NS) at 3:15pm")
  })
})