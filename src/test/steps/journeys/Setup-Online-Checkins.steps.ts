import {Browser, BrowserContext, expect, Page} from '@playwright/test'
import * as dotenv from 'dotenv'
import {data} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs";
import {
    createCustodialEvent, CreatedEvent
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs";
import {Person} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";
import AppointmentsPage from '../../pageObjects/Case/appointments.page';
import OverviewPage from '../../pageObjects/Case/overview.page';
import ConfirmationPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/confirmation.page';
import CheckInSummaryPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page';
import PhotoMeetRulesPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/photo-meet-rules.page';
import UploadPhotoPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/upload-photo.page';
import PhotoOptionsPage, { PhotoOptions } from '../../pageObjects/Case/Contacts/Checkins/SetUp/photo-options.page';
import ContactPreferencePage, { Preference } from '../../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page';
import DateFrequencyPage, { FrequencyOptions } from '../../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page';
import { test as base, createBdd, DataTable } from 'playwright-bdd';
import loginDeliusAndCreateOffender from '../../utilities/Delius';
import { login } from '../../Utilities/Login';
import InstructionsPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/instructions.page';
import { luxonString, nextWeek, tomorrow } from '../../utilities/DateTime';
import { DateTime } from 'luxon';
import { makeChangesSetupCheckins, MPoPCheckinDetails, MpopSetupChanges, MpopSetupCheckin, setupCheckinsMPop, setupDataTable } from '../../utilities/SetupOnlineCheckins';
import { testUser } from '../../utilities/Data';
import { checkInTest, test } from '../../features/Fixtures';

const { Given, When, Then } = createBdd(checkInTest);

let crn: string //= 'X978434'
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page
let overviewPage: OverviewPage
let setUpOnLineCheckinsPage: AppointmentsPage
let instructionPage: InstructionsPage
let dateFrequencyPage: DateFrequencyPage
let contactPreferencePage: ContactPreferencePage
let photoOptionsPage: PhotoOptionsPage
let uploadPhotoPage: UploadPhotoPage
let photoMeetRulesPage: PhotoMeetRulesPage
let checkInSummaryPage: CheckInSummaryPage
let confirmationPage: ConfirmationPage

Given('A new offender has been created for setups', async ({ browser: b }) => {
    browser = b
    context = process.env.LOCAL ? await browser.newContext({ recordVideo: { dir: 'videos/' } }) : await browser.newContext()
    page = await context.newPage()

    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
})

Given('I am logged in and have navigated to new offender', async () => {
    await login(page)
    setUpOnLineCheckinsPage = new AppointmentsPage(page, crn)
    await setUpOnLineCheckinsPage.navigateTo()
    overviewPage = new OverviewPage(page)
    dateFrequencyPage = new DateFrequencyPage(page)
    contactPreferencePage = new ContactPreferencePage(page)
    photoOptionsPage = new PhotoOptionsPage(page)
    uploadPhotoPage = new UploadPhotoPage(page)
    photoMeetRulesPage = new PhotoMeetRulesPage(page)
    checkInSummaryPage = new CheckInSummaryPage(page)
    confirmationPage = new ConfirmationPage(page)
    instructionPage = new InstructionsPage(page)
});

When('I set up checkIns with values', async({ ctx }, data: DataTable) => {
    const setup : MpopSetupCheckin = setupDataTable(data) as MpopSetupCheckin
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
    await setupCheckinsMPop(page, setup)
    await checkInSummaryPage.checkOnPage()
    ctx.setup = setup
})

When('I make the following changes', async({ ctx }, data:DataTable) => {
    const changes: MpopSetupChanges = setupDataTable(data)
    await makeChangesSetupCheckins(page, changes)
    await checkInSummaryPage.checkOnPage()
    await checkInSummaryPage.submit()
    await new Promise(resolve => setTimeout(resolve, 4000));
    ctx.changes = changes
})

When('I submit the checkin', async({}, data:DataTable) => {
    await confirmationPage.checkOnPage()
    await confirmationPage.checkWhatHappensNextTextExists()
    await confirmationPage.checkGoToAllCasesLinkExists()
    await confirmationPage.returnToPoPsOverviewButtonExist()
    await confirmationPage.selectPoPsOverviewButton()
})

Then('Checkins should be setup', async({ ctx }) => {
    const setup = ctx.setup
    const changes = ctx.changes
    const details: MPoPCheckinDetails = {
        date: changes.date ?? setup.date,
        frequency: changes.frequency ?? setup.frequency,
        preference: changes.preference ?? setup.preference
    }
    //Overview Page - Verify Online check ins section is displayed. Verify Contact Preference
    await overviewPage.checkOnPage()
    await overviewPage.verifyCheckinDetails(details)
    await context.close()
})