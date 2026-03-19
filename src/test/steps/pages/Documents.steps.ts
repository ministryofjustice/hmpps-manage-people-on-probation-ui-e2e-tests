import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { getClientToken, getContacts } from "../../util/API";
import { contactDataTable } from "../../util/Contacts";
import { expect } from "@playwright/test";
import DocumentsPage from "../../pageObjects/Case/documents.page";
import { documentsDataTable } from "../../util/Documents";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to documents',async ({ctx})=>{
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.assertOnPage()
    await overviewPage.useSubNavigation('documentsTab')
    const documentsPage = new DocumentsPage(ctx.base.page)
    await documentsPage.assertOnPage()
    ctx.documents.count = (await documentsPage.getCount())!
})

When('I filter the documents with values',async ({ctx}, data:DataTable)=>{
    const page = ctx.base.page
    const docFilters = documentsDataTable(data)
    const documentsPage = new DocumentsPage(page)
    await documentsPage.applyFilters(docFilters)
})

Then('the documents list contains {string} entries',async ({ctx}, count: string)=>{
    const page = ctx.base.page
    const documentsPage = new DocumentsPage(page)
    if (count === 'full'){
        expect(await documentsPage.getCount()).toEqual(ctx.documents.count)
    } else if (count === 'filtered') {
        expect(await documentsPage.getCount()).toBeLessThan(ctx.documents.count)
    } else if (count === '0'){
        await expect(documentsPage.getQA('noResults')).toContainText('0 search results')
    } else {
        expect(await documentsPage.getCount()).toEqual(count)
    }
})

Then('there are {string} on documents page',async ({ctx}, error: string)=>{
    const page = ctx.base.page
    const contactsPage = new ActivityLogPage(page)
    if (error === 'no errors'){
        await expect(contactsPage.getQA('errorList')).not.toBeVisible()
    } else if (error === 'a missing date from error') {
        await expect(contactsPage.getQA('errorList')).toContainText('Enter or select a from date')
    }
})