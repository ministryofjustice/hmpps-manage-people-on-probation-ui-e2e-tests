import { Browser, BrowserContext, expect, Locator, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { navigateToAlerts } from '../../steps/mpop/navigation/base-navigation'
import AlertsPage from '../../steps/mpop/pages/alerts'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../steps/delius/create-offender/createOffender'
import { automatedTestUser1, deliusAlert } from '../../steps/test-data'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createContact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/create-contact.mjs'
import HomePage from '../../steps/mpop/pages/home.page'
import { login, loginIfNotAlready } from '../../steps/mpop/login'
import OverviewPage from '../../steps/mpop/pages/case/overview.page'
import ManageAppointmentsPage from '../../steps/mpop/pages/appointments/manage-appointment.page'
import NotePage from '../../steps/mpop/pages/appointments/note.page'

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
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    await login(page)
    home = new HomePage(page)
    alertCount = await home.getAlertsCount()

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
    test.setTimeout(120000)
    await navigateToAlerts(page)
    const home = new HomePage(page)
    const updatedCount = await home.getAlertsCount()
    expect(updatedCount).toBeGreaterThan(alertCount)
  })

  test('Check person link', async() => {
    test.setTimeout(120000)
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertPerson', row).getByRole('link', {name: `${person.lastName}, ${person.firstName}`}).click()
    const overviewPage = new OverviewPage(page)
    expect(overviewPage.page.url()).toContain(crn)
  })

  test('Check activity link', async() => {
    test.setTimeout(120000)
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertActivity', row).getByRole('link', {name: "3 Way Meeting (Non NS)"}).click()
    const managePage = new ManageAppointmentsPage(page)
    expect(managePage.page.url()).toContain(crn)
    await managePage.clickBackLink()
    await alerts.checkOnPage()
  })
  //
  // test('Check activity note', async() => {
  //   test.setTimeout(120000)
  //   alerts = await navigateToAlerts(page)
  //   const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
  //   await alerts.getQA('alertActivity', row).getByText('More information').click()
  //   await alerts.getQA('alertActivity', row).getByRole('link', {name: "View full note"}).click()
  //   const notePage = new NotePage(page)
  //   await notePage.checkOnPage()
  //   await notePage.clickBackLink()
  //   await alerts.checkOnPage()
  // })
  //
  // test('Check pagination', async() => {
  //   test.setTimeout(120000)
  //   alerts = await navigateToAlerts(page)
  //   await alerts.pagination("Next")
  //   await expect(alerts.getQA("alertsCount")).toContainText('Showing 11 to 20')
  //   await alerts.pagination(1)
  //   await expect(alerts.getQA("alertsCount")).toContainText('Showing 1 to 10')
  // })
  //
  // test('Check select all alerts', async() => {
  //   test.setTimeout(120000)
  //   alerts = await navigateToAlerts(page)
  //   await alerts.getQA("selectAllAlertsBtn").click()
  //   const checkboxes : Locator[] = await alerts.page.getByRole('checkbox').all()
  //   for (const checkbox of checkboxes){
  //     await expect(checkbox).toBeChecked()
  //   }
  //   await alerts.getQA("selectAllAlertsBtn").click()
  //   for (const checkbox of checkboxes){
  //     await expect(checkbox).not.toBeChecked()
  //   }
  // })
  //
  // test('Check clear alert - none', async() => {
  //   test.setTimeout(120000)
  //   alerts = await navigateToAlerts(page)
  //   await alerts.getQA("clearSelectedAlerts").click()
  //   await expect(alerts.getClass('moj-alert moj-alert--error')).toContainText('Select an alert to clear it')
  // })
  //
  // test('Check clear alert', async() => {
  //   test.setTimeout(120000)
  //   alerts = await navigateToAlerts(page)
  //   const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
  //   await row.getByRole('checkbox').click()
  //   await alerts.getQA("clearSelectedAlerts").click()
  //   await expect(alerts.getClass('moj-alert moj-alert--success')).toContainText('You\'ve cleared 1 alert.')
  //   const finalCount = await alerts.getAlertsCount()
  //   expect(finalCount).toBe(alertCount)
  // })
})