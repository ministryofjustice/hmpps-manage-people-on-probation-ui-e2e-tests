import { Browser, BrowserContext, Page } from '@playwright/test'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createBdd } from 'playwright-bdd';
import { testUser } from '../util/Data'
import { login } from '../util/Login';
import { loginDeliusAndCreateOffender } from '../util/Delius';
import { getBrowserContext } from '../util/Common';
import { testContext } from '../features/Fixtures';
import OverviewPage from '../pageObjects/Case/overview.page';
import PersonalDetailsPage from '../pageObjects/Case/personal-details.page';

const { Given, When, Then } = createBdd(testContext);

Given(`Context has been created for {string} test`, async ({browser: b, ctx}, name) => {
    const browser = b
    const context = await browser.newContext(getBrowserContext(name))
    const page = await context.newPage()
    ctx.base = {
        browser: browser,
        context: context,
        page: page   
    }
})

Given('A new offender has been created in Ndelius', async ({ ctx }) => {
    const [person, crn, created] = (await loginDeliusAndCreateOffender(ctx.base.page, 'Wales', testUser, data.teams.allocationsTestTeam, true))
    await createCustodialEvent(ctx.base.page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    ctx.case.crn = crn
    ctx.case.person = person
    ctx.case.created = true
});

Given('A new offender has been created or existing made available', async ({ ctx }) => {
    const [person, crn, created] = (await loginDeliusAndCreateOffender(ctx.base.page, 'Wales', testUser, data.teams.allocationsTestTeam))
    await createCustodialEvent(ctx.base.page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    ctx.case.crn = crn
    ctx.case.person = person
    ctx.case.created = created
});

Given('I clear the contact details if set', async ({ ctx }) => {
    const created = ctx.case.created
    const page = ctx.base.page
    const crn = ctx.case.crn
    if (!created){
        const personalDetailsPage = new PersonalDetailsPage(page, crn)
        await personalDetailsPage.navigateTo()
        await personalDetailsPage.checkOnPage()
        await personalDetailsPage.updateContactDetails({
            phone: '',
            mobile: '',
            email: ''
        })
        await personalDetailsPage.usePrimaryNavigation('Home')
    }
});

Given('I am logged in', async ({ ctx }) => {
    await login(ctx.base.page)
});

Given('I close the context', async ({ ctx }) => {
    await ctx.base.context.close()
});

Given('I navigate to {string}',async ({ctx}, crn)=>{
    const overviewPage = new OverviewPage(ctx.base.page, crn)
    await overviewPage.navigateTo(crn)
    ctx.case.crn = crn
})