import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { getClientToken, getContacts } from "../../util/API";
import { contactDataTable } from "../../util/Contacts";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to contact log',async ({ctx})=>{
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.checkOnPage()
    await overviewPage.useSubNavigation('activityLogTab')
})

Given('I record the full list of activities',async ({ctx})=>{
    const page = ctx.base.page
    const token = await getClientToken()
    const contacts = await getContacts(ctx.case.crn, token)
    ctx.contacts = contacts
    console.log(contacts)
})

When('I filter the contact log with values',async ({ctx}, data:DataTable)=>{
    const page = ctx.base.page
    const contactFilters = contactDataTable(data)
    const contactsPage = new ActivityLogPage(page)
    await contactsPage.applyFilters(contactFilters)
})

Then('the contact log contains the correct info',async ({ctx})=>{
    const page = ctx.base.page
    const contactsPage = new ActivityLogPage(page)
    await page.waitForTimeout(3000)
    await contactsPage.checkOnPage()
})

Then('the contact log contains {string} entries',async ({ctx}, count: string)=>{
    const page = ctx.base.page
    const contactsPage = new ActivityLogPage(page)
    if (count === '0'){
        await expect(contactsPage.getQA('no-results')).toContainText('0 search results')
    } else {
        await expect(contactsPage.getQA('results-count-total')).toHaveText(count)
    }
})

Then('there are {string}',async ({ctx}, error: string)=>{
    const page = ctx.base.page
    const contactsPage = new ActivityLogPage(page)
    if (error === 'no errors'){
        await expect(contactsPage.getQA('errorList')).not.toBeVisible()
    } else if (error === 'a missing date to error') {
        await expect(contactsPage.getQA('errorList')).toContainText('Enter or select a date to')
    }
})



