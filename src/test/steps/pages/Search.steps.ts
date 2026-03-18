import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import CasesPage from "../../pageObjects/cases.page";
import { caseDataTable } from "../../util/Cases";
import { expect } from "@playwright/test";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { caseNavigation } from "../../util/Navigation";

const { Given, When, Then } = createBdd(testContext);

When('I search for CRN', async({ctx})=>{
    const crn = ctx.case.crn
    const page = ctx.base.page
    await caseNavigation(page, crn, "overviewTab", false)
})

Then('I can view the CRN', async({ctx})=>{
    const crn = ctx.case.crn
    const page = ctx.base.page
    const overviewPage = new OverviewPage(page, crn)
    await overviewPage.checkPopHeader()
})