import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import ManageAppointmentsPage, { ManageAction } from '../../../steps/mpop/pages/appointments/manage-appointment.page.ts'
import { testCrn } from '../../../steps/test-data.ts'
import { navigateToLatestAppointment, navigateToPastAppointment } from '../../../steps/mpop/navigation/contact-navigation.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
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
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    appointment = await navigateToLatestAppointment(page, crn)
    await appointment.checkOnPage()
  })
  test('Check action links exist - notes and next', async() => {
    appointment = await navigateToLatestAppointment(page, crn)
    await appointment.checkActionLink(ManageAction.Next, "Arrange next appointment")
  })
  test('Check action links exist - notes and log', async() => {
    appointment = await navigateToPastAppointment(page, crn, 1)
    //tags and alerts
    await appointment.checkQA("appointmentAlert", "You must log an outcome")
    //action links
    await appointment.checkActionLink(ManageAction.AttendedComplied, "Log attended and complied appointment")
  })
})