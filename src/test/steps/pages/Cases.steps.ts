import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import CasesPage from "../../pageObjects/cases.page";
import { caseDataTable } from "../../util/Cases";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to cases page', async({ctx})=>{
    const casePage = new CasesPage(ctx.base.page)
    await casePage.navigateTo()
    await casePage.assertOnPage()
    ctx.cases.count = await casePage.getCount()
})

Then('the cases page is populated',async ({ctx})=>{
    const casePage = new CasesPage(ctx.base.page)
    await casePage.assertOnPage()
    await casePage.checkSections()
})

Then('the cases page links work correctly',async ({ctx})=>{
    const casePage = new CasesPage(ctx.base.page)
    await casePage.assertOnPage()
    await casePage.checkLinks()
})

When('I filter the cases with values',async ({ctx}, data:DataTable)=>{
    const page = ctx.base.page
    const caseFilters = caseDataTable(data)
    const casePage = new CasesPage(page)
    await casePage.applyFilters(caseFilters)
})

Then('the cases page contains {string} entries',async ({ctx}, count: string)=>{
    const page = ctx.base.page
    const casePage = new CasesPage(page)
    await casePage.assertOnPage()
    if (count === 'full'){
        expect(await casePage.getCount()).toBeGreaterThanOrEqual(ctx.cases.count) //may increase during tests
    } else if (count === 'filtered') {
         expect(await casePage.getCount()).toBeLessThan(ctx.cases.count)
    } else if (count === '0'){
         expect(await casePage.getCount()).toEqual(0)
    } else {
        expect(await casePage.getCount()).toEqual(Number(count))
    }
})

When('I clear filters on cases page', async ({ctx})=>{
    const page = ctx.base.page
    const casePage = new CasesPage(page)
    await casePage.clickLink('Clear')
})

Then('all cases are present on cases page', async ({ctx})=>{
    const page = ctx.base.page
    const casePage = new CasesPage(page)
    expect(await casePage.getCount()).toBeGreaterThanOrEqual(ctx.cases.count) //may increase during tests
})

