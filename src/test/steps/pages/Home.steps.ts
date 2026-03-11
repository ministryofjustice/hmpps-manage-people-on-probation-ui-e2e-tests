import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import TierPage from "../../pageObjects/Case/tier.page";
import HomePage from "../../pageObjects/home.page";

const { Given, When, Then } = createBdd(testContext);

Then('the home page is populated',async ({ctx})=>{
    const homePage = new HomePage(ctx.base.page)
    await homePage.checkOnPage()
    await homePage.checkSections()
})

Then('the home page links work correctly',async ({ctx})=>{
    const homePage = new HomePage(ctx.base.page)
    await homePage.checkOnPage()
    await homePage.checkLinks()
})
