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
import { login } from '../../utilities/Login';
import InstructionsPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/instructions.page';
import { dueDateString, lastWeek, luxonString, nextWeek, today, tomorrow, twoDaysAgo, yesterday } from '../../utilities/DateTime';
import { DateTime } from 'luxon';
import { makeChangesSetupCheckins, MPoPCheckinDetails, MpopSetupChanges, MpopSetupCheckin, setupCheckinsMPop, setupDataTable } from '../../utilities/SetupOnlineCheckins';
import { testCrn, testUser } from '../../utilities/Data';
import { checkInTest, test } from '../../features/Fixtures';
import { createEsupervisionCheckin, getClientToken, getProbationPractitioner, postEsupervisionVideo, submitEsupervisionCheckin, verifyEsupervisionVideo } from '../../utilities/API';
import { getBrowserContext, getUuid } from '../../utilities/Common';
import ActivityLogPage from '../../pageObjects/Case/activity-log.page';
import { getValidCrnForExpiredCheckin, Review, reviewCheckinMpop, reviewDataTable, reviewSubmittedCheckinMpop, ReviewType, SurveyResponse, YesNoCheck } from '../../utilities/ReviewCheckins';
import ReviewedSubmittedPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-submitted.page';
import ReviewedExpiredPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-expired.page';

const { Given, When, Then } = createBdd(checkInTest);

let crn: string //= 'X978434'
let expiredCrn: string
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
    context = await browser.newContext(getBrowserContext('esupervision'))
    page = await context.newPage()

    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } , event: data.events.community })
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
    const uuid = getUuid(page)
    ctx.uuid = uuid
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
})

When('I mock the completion of a completed checkin', async({}, data:DataTable) => {
    const token = await getClientToken()
    const practitioner = await getProbationPractitioner(crn, token)
    const uuid = await createEsupervisionCheckin(practitioner, crn, dueDateString(today), token)
    await postEsupervisionVideo(page, uuid, token)
    await verifyEsupervisionVideo(uuid, token)
    const surveyResponse = reviewDataTable(data) as SurveyResponse
    await submitEsupervisionCheckin(uuid, token, surveyResponse)
})

Then('I can access the new checkIn in the contact log', async({ }) => {
   await page.waitForTimeout(5000)
   const contactLog = new ActivityLogPage(page, 'compact', crn)
   await contactLog.navigateTo()
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
})

When('I review the completed checkIn', async({ }) => {
    const review : Review = {
        type: ReviewType.SUBMITTED,
        review: {
            identity: YesNoCheck.YES
        }
    }
    await reviewCheckinMpop(page, review)
})

Then('I can view the reviewed checkIn', async({ }) => {
   const contactLog = new ActivityLogPage(page, 'compact', crn)
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
   const reviewedSubmittedPage = new ReviewedSubmittedPage(page, crn)
   await reviewedSubmittedPage.checkOnPage()
})

Given('I am logged in with context', async ({browser: b}) => {
    browser = b
    context = await browser.newContext(getBrowserContext('esupervision'))
    page = await context.newPage()
    await login(page)
});

When('I find a suitable CRN', async({}) => {
    crn = crn ?? undefined
    expiredCrn = await getValidCrnForExpiredCheckin(page, crn) //crn must be >1 day old, have online checkins setup, and not have an existing expired checkin today
    console.log(expiredCrn)
})

When('I mock the completion of an expired checkin', async({ }) => {
    const token = await getClientToken()
    const practitioner = await getProbationPractitioner(expiredCrn, token)
    await createEsupervisionCheckin(practitioner, expiredCrn, dueDateString(today.minus({days: 7})), token)
})

Then('I can access the expired checkIn in the contact log', async({ }) => {
   await page.waitForTimeout(5000)
   const contactLog = new ActivityLogPage(page, 'compact', expiredCrn)
   await contactLog.navigateTo()
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
})

When('I review the missed checkIn', async({ }) => {
    const review : Review = {
        type: ReviewType.EXPIRED,
        review: {
            comment: 'note'
        }
    }
    await reviewCheckinMpop(page, review)
})

Then('I can view the expired and reviewed checkIn', async({ }) => {
   const contactLog = new ActivityLogPage(page, 'compact', expiredCrn)
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
   const reviewedExpiredPage = new ReviewedExpiredPage(page, expiredCrn)
   await reviewedExpiredPage.checkOnPage()
})

Then('Context is closed', async() => {
    await context.close()
})