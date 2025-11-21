import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import AppointmentsPage from "../../../steps/mpop/pages/case/appointments.page";
// import CaseUpcomingAppointmentsPage from '../../steps/mpop/pages/appointments/upcoming-appointments.page.ts'
// import ActivityLogPage from '../../steps/mpop/pages/case/activity-log.page.ts'
import { testCrn } from '../../../steps/test-data.ts'
import { navigateToAppointments } from '../../../steps/mpop/navigation/case-navigation.ts'
import SetupOnlineCheckinsPage from "../../../steps/mpop/pages/case/setup-online-checkins-page";
import SentencePage from "../../../steps/mpop/pages/appointments/sentence.page";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage
let setuponlinecheckinspage: SetupOnlineCheckinsPage

test.describe('Set up online checkins page', () => {

    test.beforeEach(async ({ browser: b }) => {
        test.setTimeout(120000)
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        appointments = await navigateToAppointments(page, testCrn)
        await appointments.checkOnPage()

        setuponlinecheckinspage = new SetupOnlineCheckinsPage(page)
        await setuponlinecheckinspage.checkOnPage()

    })
    test.afterEach(async () => {
        await context.close()
    })

    test('Render the page', async() => {
        await appointments.checkOnPage()
        await setuponlinecheckinspage.checkOnPage()
    })

    test('Verify the button Set up online checkins and select it', async() => {
        //await setuponlinecheckinspage.checkOnPage()
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
    })

})