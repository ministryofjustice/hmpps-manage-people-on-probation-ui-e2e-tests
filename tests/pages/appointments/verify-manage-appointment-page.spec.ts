import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import ManageAppointmentsPage, { ManageAction } from '../../../steps/mpop/pages/appointments/manage-appointment.page.ts'
import { testCrn } from '../../../steps/test-data.ts'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
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
  })
  test.afterEach(async () => {
    await context.close()
  })

  test('Render the page', async() => {
    appointment = new ManageAppointmentsPage(page)
    await appointment.goTo(crn, contactIdLatest)
    await appointment.checkOnPage()
  })
  test('Check action links exist - notes and next', async() => {
    appointment = new ManageAppointmentsPage(page)
    await appointment.goTo(crn, contactIdLatest)
    await appointment.checkHref("Add appointment notes", `/case/${crn}/appointments/appointment/${contactIdLatest}/add-note`)
    await appointment.checkActionLink(ManageAction.Notes, "Add appointment notes")
    await appointment.checkHref("Arrange next appointment", `/case/${crn}/appointments/appointment/${contactIdLatest}/next-appointment?back=/case/${crn}/appointments/appointment/${contactIdLatest}/manage`)
    await appointment.checkActionLink(ManageAction.Next, "Arrange next appointment")
  })
  test('Check action links exist - notes and log', async() => {
    appointment = new ManageAppointmentsPage(page)
    await appointment.goTo(crn, contactIdPast)
    //tags and alerts
    await appointment.checkQA("appointmentAlert", "You must log an outcome for this appointment")
    await appointment.checkQA("sensitiveTag", "Sensitive")
    //action links
    await appointment.checkHref("Log attended and complied appointment", `/case/${crn}/appointments/appointment/${contactIdPast}/attended-complied`)
    await appointment.checkActionLink(ManageAction.AttendedComplied, "Log attended and complied appointment")
    await appointment.checkHref("Add appointment notes", `/case/${crn}/appointments/appointment/${contactIdPast}/add-note`)
    await appointment.checkActionLink(ManageAction.Notes, "Add appointment notes")
  })
})