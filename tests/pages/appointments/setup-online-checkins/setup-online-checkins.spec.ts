import {Browser, BrowserContext, expect, Page, test} from '@playwright/test'
import * as dotenv from 'dotenv'
import AppointmentsPage from "../../../../steps/mpop/pages/case/appointments.page";
import { testCrn } from '../../../../steps/test-data.ts'
import { navigateToAppointments } from '../../../../steps/mpop/navigation/case-navigation.ts'
import SetupOnlineCheckinsPage from "../../../../steps/mpop/pages/case/setup-online-checkins/setup-online-checkins-page";
import DateFrequencyPagePage from "../../../../steps/mpop/pages/case/setup-online-checkins/date-frequency.page";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage
let setuponlinecheckinspage: SetupOnlineCheckinsPage
let datefrequencypage: DateFrequencyPagePage

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

    test('Select the button Set Up Online Check Ins & verify the content', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await setuponlinecheckinspage.checkH2Header("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
    })

    test('Verify the text and date frequency appears in the page', async () => {
        await datefrequencypage.checkH2Header("pageHeading", "Set up online check ins")
        await datefrequencypage.checkElementExists(datefrequencypage.datepickerQA)
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        await datefrequencypage.useTomorrowsDate()

    })



})