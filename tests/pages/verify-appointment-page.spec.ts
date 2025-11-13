import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../../steps/mpop/pages/appointments.page.ts'
import CaseUpcomingAppointmentsPage from '../../steps/mpop/pages/appointments/upcoming-appointments.page.ts'
import ActivityLogPage from '../../steps/mpop/pages/activity-log.page.ts'
import { testCrn } from '../../steps/test-data.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage

test.describe('Appointments page', () => {

  test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await loginToManageMySupervision(page)
    appointments = new AppointmentsPage(page)
    await appointments.goTo(crn)
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    await appointments.checkOnPage()
  })
  test('Link to upcoming appointments', async() => {
    await appointments.viewUpcomingAppointments()
    const upcomingAppointments = new CaseUpcomingAppointmentsPage(page)
    upcomingAppointments.checkOnPage()
  })
  test('Link to past appointments', async() => {
    await appointments.viewPastAppointments()
    const pastAppointments = new ActivityLogPage(page)
    await pastAppointments.checkOnPage()
  })
})