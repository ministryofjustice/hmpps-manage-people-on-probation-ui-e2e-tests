import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createContact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/create-contact.mjs'
import { createBdd } from 'playwright-bdd';
import HomePage from '../../pageObjects/home.page'
import { login } from '../../Utilities/Login'
import AlertsPage from '../../pageObjects/alerts'
import loginDeliusAndCreateOffender from '../../../../steps/delius/create-offender/createOffender'
import { ContextConfig, deliusAlert, testUser } from '../../utilities/Data'
import OverviewPage from '../../pageObjects/Case/overview.page'
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page'
import NotePage from '../../pageObjects/Case/Contacts/Appointments/note.page'

const { Given, When, Then } = createBdd();

let browser: Browser
let context: BrowserContext
let page: Page
let alerts: AlertsPage
let home: HomePage
let alertCount: number
let person: Person
let crn: string

Given('A new offender has been created with an alert', async ({ browser: b }) => {
    browser = b
    context = await browser.newContext(ContextConfig)
    page = await context.newPage()

    [person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    await createContact(page, crn, deliusAlert)
});

Given('I am logged in and on the alerts page', async () => {
    await login(page)
    home = new HomePage(page)
    alertCount = await home.getAlertsCount()
    alerts = new AlertsPage(page)
    alerts.navigateTo(page)
});

Then('the page should be rendered', async () => {
    await alerts.checkOnPage()
});

Then('the new alert should be present', async () => {
    await alerts.navigateTo(page)
    const home = new HomePage(page)
    const updatedCount = await home.getAlertsCount()
    expect(updatedCount).toBeGreaterThan(alertCount)
});

When('I click the person link', async () => {
    alerts.navigateTo(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertPerson', row).getByRole('link', {name: `${person.lastName}, ${person.firstName}`}).click()
});

Then('I should be taken to the overview page', async () => {
    const overviewPage = new OverviewPage(page)
    expect(overviewPage.page.url()).toContain(crn)
});

When('I click the activity link', async () => {
    alerts.navigateTo(page)
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
    alerts.navigateTo(page)
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
    alerts.navigateTo(page)
    await alerts.pagination("Next")
});

Then('the alerts list should be updated', async () => {
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 11 to 20')
    await alerts.pagination(1)
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 1 to 10')
});

When('I select and deselect all alerts', async () => {
    alerts.navigateTo(page)
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
    alerts.navigateTo(page)
    await alerts.getQA("clearSelectedAlerts").click()
});

Then('I should see an error message', async () => {
    await expect(alerts.getClass('moj-alert moj-alert--error')).toContainText('Select an alert to clear it')
});

When('I select and clear an alert', async () => {
    alerts.navigateTo(page)
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