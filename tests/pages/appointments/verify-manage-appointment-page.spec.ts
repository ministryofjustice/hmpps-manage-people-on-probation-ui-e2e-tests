import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import ManageAppointmentsPage from '../../../steps/mpop/pages/appointments/manage-appointment.page.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = "X756510"
let contactIdLatest: string = "2509987234"
let contactIdPast: string = "2510027627"
let browser: Browser
let context: BrowserContext
let page: Page
let appointment: ManageAppointmentsPage

test.describe('Manage page', () => {

  test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await loginToManageMySupervision(page)
    appointment = new ManageAppointmentsPage(page)
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    await appointment.goTo(crn, contactIdLatest)
    await appointment.checkOnPage()
  })
  test('Check action links exist - notes and next', async() => {
    await appointment.goTo(crn, contactIdLatest)
    await appointment.checkActionLink(1, "Add appointment notes")
    await appointment.checkActionLink(2, "Arrange next appointment")
  })
  test('Check action links exist - notes and log', async() => {
    await appointment.goTo(crn, contactIdPast)
    await appointment.checkActionLink(0, "Log attended and complied appointment")
    await appointment.checkActionLink(1, "Add appointment notes")
  })
})