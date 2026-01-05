import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import ManageAppointmentsPage, { ManageAction } from '../../../steps/mpop/pages/appointments/manage-appointment.page'
import { testCrn } from '../../../steps/test-data'
import { navigateToLatestAppointment, navigateToPastAppointment } from '../../../steps/mpop/navigation/contact-navigation'
import {login} from "../../../steps/mpop/login";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointment: ManageAppointmentsPage

test.describe('Manage page', () => {

  test.beforeEach(async ({ browser: b }) => {
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await login(page)
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