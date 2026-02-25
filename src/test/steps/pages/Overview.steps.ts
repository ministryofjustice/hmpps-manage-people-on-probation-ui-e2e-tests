import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";

const { Given, When, Then } = createBdd(testContext);

Then('the overview page is populated',async ({ctx})=>{
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.checkOnPage()
    await overviewPage.checkSections()
})

Then('the overview page links work correctly',async ({ctx})=>{
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.checkOnPage()
    await overviewPage.checkLinks()
})