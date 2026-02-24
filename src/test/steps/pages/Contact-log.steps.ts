import {createBdd} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { getClientToken, getContacts } from "../../util/API";

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
