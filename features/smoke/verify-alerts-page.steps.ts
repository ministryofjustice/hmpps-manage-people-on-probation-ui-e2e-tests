import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import { navigateToAlerts } from '../../steps/mpop/navigation/base-navigation'
import AlertsPage from '../../steps/mpop/pages/alerts'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../steps/delius/create-offender/createOffender'
import { testUser, deliusAlert } from '../../steps/test-data'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createContact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/create-contact.mjs'
import HomePage from '../../steps/mpop/pages/home.page'
import { login } from '../../steps/mpop/login'
import OverviewPage from '../../steps/mpop/pages/case/overview.page'
import ManageAppointmentsPage from '../../steps/mpop/pages/appointments/manage-appointment.page'
import NotePage from '../../steps/mpop/pages/appointments/note.page'
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

dotenv.config({ path: '.env' }) // Load environment variables

let browser: Browser
let context: BrowserContext
let page: Page
let alerts: AlertsPage
let home: HomePage
let alertCount: number
let person: Person
let crn: string

Given('I am logged in and on the alerts page', async ({ browser: b }) => {
    browser = b
    context = process.env.LOCAL ? await browser.newContext({ recordVideo: { dir: 'videos/' } }) : await browser.newContext()
    page = await context.newPage()

    await login(page)
    home = new HomePage(page)
    alertCount = await home.getAlertsCount()
    alerts = await navigateToAlerts(page)
});

Given('a new offender has been created with an alert', async () => {
    [person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    await createContact(page, crn, deliusAlert)
});

Then('the page should be rendered', async () => {
    await alerts.checkOnPage()
});

Then('the new alert should be present', async () => {
    await navigateToAlerts(page)
    const home = new HomePage(page)
    const updatedCount = await home.getAlertsCount()
    expect(updatedCount).toBeGreaterThan(alertCount)
});

When('I click the person link', async () => {
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertPerson', row).getByRole('link', {name: `${person.lastName}, ${person.firstName}`}).click()
});

Then('I should be taken to the overview page', async () => {
    const overviewPage = new OverviewPage(page)
    expect(overviewPage.page.url()).toContain(crn)
});

When('I click the activity link', async () => {
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertActivity', row).getByRole('link', {name: "3 Way Meeting (Non NS)"}).click()
});

Then('I should be taken to the manage appointments page', async () => {
    const managePage = new ManageAppointmentsPage(page)
    expect(managePage.page.url()).toContain(crn)
    await managePage.clickBackLink()
    await alerts.checkOnPage()
});

When('I view the activity note', async () => {
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertActivity', row).getByText('More information').click()
    await alerts.getQA('alertActivity', row).getByRole('link', {name: "View full note"}).click()
});

Then('I should be on the note page', async () => {
    const notePage = new NotePage(page)
    await notePage.checkOnPage()
    await notePage.clickBackLink()
    await alerts.checkOnPage()
});

When('I navigate through pagination', async () => {
    alerts = await navigateToAlerts(page)
    await alerts.pagination("Next")
});

Then('the alerts list should be updated', async () => {
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 11 to 20')
    await alerts.pagination(1)
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 1 to 10')
});

When('I select and deselect all alerts', async () => {
    alerts = await navigateToAlerts(page)
    await alerts.getQA("selectAllAlertsBtn").click()
    const checkboxes : Locator[] = await alerts.page.getByRole('checkbox').all()
    for (const checkbox of checkboxes){
      await expect(checkbox).toBeChecked()
    }
    await alerts.getQA("selectAllAlertsBtn").click()
    for (const checkbox of checkboxes){
      await expect(checkbox).not.toBeChecked()
    }
});

When('I try to clear alerts without selection', async () => {
    alerts = await navigateToAlerts(page)
    await alerts.getQA("clearSelectedAlerts").click()
});

Then('I should see an error message', async () => {
    await expect(alerts.getClass('moj-alert moj-alert--error')).toContainText('Select an alert to clear it')
});

When('I select and clear an alert', async () => {
    alerts = await navigateToAlerts(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await row.getByRole('checkbox').click()
    await alerts.getQA("clearSelectedAlerts").click()
});

Then('the alert should be cleared', async () => {
    await expect(alerts.getClass('moj-alert moj-alert--success')).toContainText('You\'ve cleared 1 alert.')
    const finalCount = await alerts.getAlertsCount()
    expect(finalCount).toBe(alertCount)
    await context.close()
});
