import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import TierPage from "../../pageObjects/Case/tier.page";
import RiskPage from "../../pageObjects/Case/risk.page";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to risk page',async ({ctx})=>{
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.checkOnPage()
    await overviewPage.useSubNavigation('riskTab')
})

Then('the risk page is populated',async ({ctx})=>{
    const riskPage = new RiskPage(ctx.base.page)
    await riskPage.checkOnPage()
    await riskPage.checkSections()
})

Then('the risk page links work correctly',async ({ctx})=>{
    const riskPage = new RiskPage(ctx.base.page)
    await riskPage.checkOnPage()
    await riskPage.checkLinks()
})