import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test'
import { createContact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/create-contact.mjs'
import { createBdd } from 'playwright-bdd';
import HomePage from '../../pageObjects/home.page'
import AlertsPage from '../../pageObjects/alerts'
import { deliusAlert, testUser } from '../../util/Data'
import OverviewPage from '../../pageObjects/Case/overview.page'
import ManageAppointmentsPage from '../../pageObjects/Case/Contacts/Appointments/manage-appointment.page'
import NotePage from '../../pageObjects/Case/Contacts/Appointments/note.page'
import { testContext } from '../../features/Fixtures'

const { Given, When, Then } = createBdd(testContext);

Given('I have noted the alerts count', async ({ ctx }) => {
    const home = new HomePage(ctx.base.page)
    const alertCount = await home.getAlertsCount()
    ctx.alerts.alertCount = alertCount
});

Given('The offender has been given an alert', async ({ ctx }) => {
    await createContact(ctx.base.page, ctx.case.crn, deliusAlert)
});

Given('I have navigated to alerts', async ({ ctx }) => {
    const alerts = new AlertsPage(ctx.base.page)
    await alerts.navigateTo(ctx.base.page)
    ctx.alerts.alertsPage = alerts
})

Then('the page should be rendered', async ({ ctx }) => {
    await ctx.alerts.alertsPage.checkOnPage()
});

Then('the new alert should be present', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await alerts.navigateTo(ctx.base.page)
    await alerts.checkOnPage()
    const updatedCount = await alerts.getAlertsCount()
    expect(updatedCount).toBeGreaterThan(ctx.alerts.alertCount)
});

When('I click the person link', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    const page = ctx.base.page
    const person = ctx.case.person
    const crn = ctx.case.crn
    await alerts.navigateTo(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertPerson', row).getByRole('link', {name: `${person!.lastName}, ${person.firstName}`}).click()
});

Then('I should be taken to the overview page', async ({ ctx }) => {
    const overviewPage = new OverviewPage(ctx.base.page)
    expect(overviewPage.page.url()).toContain(ctx.case.crn)
});

When('I click the activity link', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    const page = ctx.base.page
    const person = ctx.case.person
    const crn = ctx.case.crn
    await alerts.navigateTo(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertActivity', row).getByRole('link', {name: "3 Way Meeting (Non NS)"}).click()
});

Then('I should be taken to the manage appointments page', async ({ ctx }) => {
    const managePage = new ManageAppointmentsPage(ctx.base.page)
    expect(managePage.page.url()).toContain(ctx.case.crn)
    await managePage.clickBackLink()
    await ctx.alerts.alertsPage.checkOnPage()
});

When('I view the activity note', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    const page = ctx.base.page
    const person = ctx.case.person
    const crn = ctx.case.crn
    await alerts.navigateTo(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await alerts.getQA('alertActivity', row).getByText('More information').click()
    await alerts.getQA('alertActivity', row).getByRole('link', {name: "View full note"}).click()
});

Then('I should be on the note page', async ({ ctx }) => {
    const notePage = new NotePage(ctx.base.page)
    await notePage.checkOnPage()
    await notePage.clickBackLink()
    await ctx.alerts.alertsPage.checkOnPage()
});

When('I navigate through pagination', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await alerts.navigateTo(ctx.base.page)
    await alerts.pagination("Next")
});

Then('the alerts list should be updated', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 11 to 20')
    await alerts.pagination(1)
    await expect(alerts.getQA("alertsCount")).toContainText('Showing 1 to 10')
});

When('I select and deselect all alerts', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await alerts.navigateTo(ctx.base.page)
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

When('I try to clear alerts without selection', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await alerts.navigateTo(ctx.base.page)
    await alerts.getQA("clearSelectedAlerts").click()
});

Then('I should see an error message', async ({ ctx }) => {
    await expect(ctx.alerts.alertsPage.getClass('moj-alert moj-alert--error')).toContainText('Select an alert to clear it')
});

When('I select and clear an alert', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    const page = ctx.base.page
    const person = ctx.case.person
    const crn = ctx.case.crn
    await alerts.navigateTo(page)
    const row = alerts.getClass('govuk-table__row').filter({has: page.getByRole('cell', {name: `${person.lastName}, ${person.firstName} ${crn}`})})
    await row.getByRole('checkbox').click()
    await alerts.getQA("clearSelectedAlerts").click()
});

Then('the alert should be cleared', async ({ ctx }) => {
    const alerts = ctx.alerts.alertsPage
    await expect(alerts.getClass('moj-alert moj-alert--success')).toContainText('You\'ve cleared 1 alert.')
    const finalCount = await alerts.getAlertsCount()
    expect(finalCount).toBe(ctx.alerts.alertCount)
});