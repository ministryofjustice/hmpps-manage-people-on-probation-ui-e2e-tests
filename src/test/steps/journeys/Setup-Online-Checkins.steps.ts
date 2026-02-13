import AppointmentsPage from '../../pageObjects/Case/appointments.page';
import OverviewPage from '../../pageObjects/Case/overview.page';
import ConfirmationPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/confirmation.page';
import CheckInSummaryPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page';
import { test as base, createBdd, DataTable } from 'playwright-bdd';
import { dueDateString, lastWeek, luxonString, nextWeek, today, tomorrow, twoDaysAgo, yesterday } from '../../utilities/DateTime';
import { makeChangesSetupCheckins, MPoPCheckinDetails, MpopSetupChanges, MpopSetupCheckin, randomCheckIn, setupCheckinsMPop, setupDataTable } from '../../utilities/SetupOnlineCheckins';
import { test, testContext } from '../../features/Fixtures';
import { createEsupervisionCheckin, getClientToken, getProbationPractitioner, postEsupervisionVideo, submitEsupervisionCheckin, verifyEsupervisionVideo } from '../../utilities/API';
import { getBrowserContext, getUuid } from '../../utilities/Common';
import ActivityLogPage from '../../pageObjects/Case/activity-log.page';
import { getValidCrnForExpiredCheckin, Review, reviewCheckinMpop, reviewDataTable, reviewSubmittedCheckinMpop, ReviewType, SurveyResponse, YesNoCheck } from '../../utilities/ReviewCheckins';
import ReviewedSubmittedPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-submitted.page';
import ReviewedExpiredPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-expired.page';

const { Given, When, Then } = createBdd(testContext);

Given('I have navigated to new offender', async ({ ctx }) => {
    const setUpOnLineCheckinsPage = new AppointmentsPage(ctx.base.page, ctx.case.crn)
    await setUpOnLineCheckinsPage.navigateTo()
});

When('I set up checkIns with values', async({ ctx }, data: DataTable) => {
    const page = ctx.base.page
    const setup : MpopSetupCheckin = setupDataTable(data) as MpopSetupCheckin
    const setUpOnLineCheckinsPage = new AppointmentsPage(page)
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
    await setupCheckinsMPop(page, setup)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
    const uuid = getUuid(page)
    ctx.contact.uuid = uuid
    ctx.checkIns.setup = setup
})

When('I set up checkIns with random values', async({ ctx }) => {
    const page = ctx.base.page
    const setup : MpopSetupCheckin = randomCheckIn() as MpopSetupCheckin
    console.log(setup)
    const setUpOnLineCheckinsPage = new AppointmentsPage(page)
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
    await setupCheckinsMPop(page, setup)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
    const uuid = getUuid(page)
    ctx.contact.uuid = uuid
    ctx.checkIns.setup = setup
})

When('I make the following changes', async({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const changes: MpopSetupChanges = setupDataTable(data)
    console.log(changes)
    await makeChangesSetupCheckins(page, changes)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
    await checkInSummaryPage.submit()
    await new Promise(resolve => setTimeout(resolve, 4000));
    ctx.checkIns.changes = changes
})

When('I make random changes', async({ ctx }) => {
    const page = ctx.base.page
    const changes : MpopSetupChanges = randomCheckIn(false) as MpopSetupChanges
    await makeChangesSetupCheckins(page, changes)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
    await checkInSummaryPage.submit()
    await new Promise(resolve => setTimeout(resolve, 4000));
    ctx.checkIns.changes = changes
})

When('I submit the checkin', async({ ctx }, data:DataTable) => {
    const confirmationPage = new ConfirmationPage(ctx.base.page)
    await confirmationPage.checkOnPage()
    await confirmationPage.checkWhatHappensNextTextExists()
    await confirmationPage.checkGoToAllCasesLinkExists()
    await confirmationPage.returnToPoPsOverviewButtonExist()
    await confirmationPage.selectPoPsOverviewButton()
})

Then('Checkins should be setup', async({ ctx }) => {
    const setup = ctx.checkIns.setup
    const changes = ctx.checkIns.changes
    const details: MPoPCheckinDetails = {
        date: changes.date ?? setup.date,
        frequency: changes.frequency ?? setup.frequency,
        preference: changes.preference ?? setup.preference
    }
    //Overview Page - Verify Online check ins section is displayed. Verify Contact Preference
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.checkOnPage()
    await overviewPage.verifyCheckinDetails(details)
})

When('I mock the completion of a completed checkin', async({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const token = await getClientToken()
    const practitioner = await getProbationPractitioner(crn, token)
    const uuid = await createEsupervisionCheckin(practitioner, crn, dueDateString(today), token)
    await postEsupervisionVideo(page, uuid, token)
    await verifyEsupervisionVideo(uuid, token)
    const surveyResponse = reviewDataTable(data) as SurveyResponse
    await submitEsupervisionCheckin(uuid, token, surveyResponse)
})

Then('I can access the new checkIn in the contact log', async({ ctx }) => {
   const page = ctx.base.page
   const crn = ctx.case.crn
   await page.waitForTimeout(5000)
   const contactLog = new ActivityLogPage(page, 'compact', crn)
   await contactLog.navigateTo()
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
})

When('I review the completed checkIn', async({ ctx }) => {
    const review : Review = {
        type: ReviewType.SUBMITTED,
        review: {
            identity: YesNoCheck.YES
        }
    }
    await reviewCheckinMpop(ctx.base.page, review)
})

Then('I can view the reviewed checkIn', async({ ctx }) => {
   const page = ctx.base.page
   const crn = ctx.case.crn
   const contactLog = new ActivityLogPage(page, 'compact', crn)
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
   const reviewedSubmittedPage = new ReviewedSubmittedPage(page, crn)
   await reviewedSubmittedPage.checkOnPage()
})

When('I find a suitable CRN', async({ctx}) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const newCrn = crn ?? undefined
    const expiredCrn = await getValidCrnForExpiredCheckin(page, newCrn) 
    console.log(expiredCrn)
    ctx.checkIns.expiredCrn = expiredCrn
})

When('I mock the completion of an expired checkin', async({ ctx }) => {
    const expiredCrn = ctx.checkIns.expiredCrn
    const token = await getClientToken()
    const practitioner = await getProbationPractitioner(expiredCrn, token)
    await createEsupervisionCheckin(practitioner, expiredCrn, dueDateString(today.minus({days: 7})), token)
})

Then('I can access the expired checkIn in the contact log', async({ ctx }) => {
   const page = ctx.base.page
   const expiredCrn = ctx.checkIns.expiredCrn
   await page.waitForTimeout(5000)
   const contactLog = new ActivityLogPage(page, 'compact', expiredCrn)
   await contactLog.navigateTo()
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
})

When('I review the missed checkIn', async({ ctx }) => {
    const review : Review = {
        type: ReviewType.EXPIRED,
        review: {
            comment: 'note'
        }
    }
    await reviewCheckinMpop(ctx.base.page, review)
})

Then('I can view the expired and reviewed checkIn', async({ ctx }) => {
   const page = ctx.base.page
   const expiredCrn = ctx.checkIns.expiredCrn
   const contactLog = new ActivityLogPage(page, 'compact', expiredCrn)
   await contactLog.checkOnPage()
   await contactLog.getLink('Update').first().click()
   const reviewedExpiredPage = new ReviewedExpiredPage(page, expiredCrn)
   await reviewedExpiredPage.checkOnPage()
})