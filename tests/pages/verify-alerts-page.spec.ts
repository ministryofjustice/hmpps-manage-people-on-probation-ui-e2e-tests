import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { navigateToAlerts } from '../../steps/mpop/navigation/base-navigation.ts'
import AlertsPage from '../../steps/mpop/pages/alerts.ts'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import loginDeliusAndCreateOffender from '../../steps/delius/create-offender/createOffender.ts'
import { automatedTestUser1, deliusAlert } from '../../steps/test-data.ts'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { tomorrow } from '../../steps/mpop/utils.ts'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { createContact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/create-contact.mjs'
import HomePage from '../../steps/mpop/pages/home.page.ts'
import { login, loginIfNotAlready } from '../../steps/mpop/login.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let browser: Browser
let context: BrowserContext
let page: Page
let alerts: AlertsPage
let home: HomePage
let alertCount: number
let person: Person
let crn: string
let sentence: CreatedEvent

test.describe.configure({ mode: 'serial' })
test.describe('Alerts page', () => {

  test.beforeAll(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    await login(page)
    home = new HomePage(page)
    alertCount = await home.getAlertsCount()
    await home.logout()

    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    await createContact(page, crn, deliusAlert)
  })
  test.afterAll(async() => {
    await context.close()
  })

  test('Render the page', async() => {
    alerts = await navigateToAlerts(page)
    await alerts.checkOnPage()
  })

  test('Check alert added', async() => {
    await loginIfNotAlready(page)
    const home = new HomePage(page)
    const updatedCount = await home.getAlertsCount()
    expect(updatedCount).toBe(alertCount+1)
  })

  test('Check alert links', async() => {
    alerts = await navigateToAlerts(page)
    await alerts.checkOnPage()
  })
})