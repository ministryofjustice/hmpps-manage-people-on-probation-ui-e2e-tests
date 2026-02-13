import { Browser, BrowserContext, Page } from '@playwright/test'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createBdd } from 'playwright-bdd';
import { testUser } from '../utilities/Data'
import { login } from '../utilities/Login';
import loginDeliusAndCreateOffender from '../utilities/Delius';
import { getBrowserContext } from '../utilities/Common';

const { Given, When, Then } = createBdd();

let crn: string
let browser: Browser
let context: BrowserContext
let page: Page

Given(`Context has been created for {string} test`, async ({browser: b}, name) => {
    browser = b
    context = await browser.newContext(getBrowserContext(name))
    page = await context.newPage()
})

Given('A new offender has been created in Ndelius', async () => {
    crn = (await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam))[1]
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
});

Given('I am logged in', async () => {
    await login(page)
});

Given('I close the context', async () => {
    await context.close()
});