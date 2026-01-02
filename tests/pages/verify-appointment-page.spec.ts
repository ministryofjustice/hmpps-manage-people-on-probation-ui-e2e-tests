import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import AppointmentsPage from '../../steps/mpop/pages/case/appointments.page'
import CaseUpcomingAppointmentsPage from '../../steps/mpop/pages/appointments/upcoming-appointments.page'
import ActivityLogPage from '../../steps/mpop/pages/case/activity-log.page'
import { testCrn } from '../../steps/test-data'
import { navigateToAppointments } from '../../steps/mpop/navigation/case-navigation'
import {login} from "../../steps/mpop/login";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage

test.describe('Appointments page', () => {

  test.beforeEach(async ({ browser: b }) => {

    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await login(page)
    appointments = await navigateToAppointments(page, testCrn)
    await appointments.checkOnPage()
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