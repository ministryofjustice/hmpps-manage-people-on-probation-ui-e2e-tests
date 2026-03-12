import AppointmentsPage from '../../pageObjects/Case/appointments.page';
import OverviewPage from '../../pageObjects/Case/overview.page';
import ConfirmationPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/confirmation.page';
import CheckInSummaryPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page';
import { test as base, createBdd, DataTable } from 'playwright-bdd';
import { dueDateString, lastWeek, luxonString, nextWeek, today, tomorrow, threeDaysAgo, yesterday } from '../../util/DateTime';
import { makeChangesSetupCheckins, MPoPCheckinDetails, MpopSetupChanges, MpopSetupCheckin, MpopSetupRestart, randomCheckIn, setupCheckinsMPop, setupDataTable } from '../../util/SetupOnlineCheckins';
import { test, testContext } from '../../features/Fixtures';
import { createEsupervisionCheckin, getClientToken, getProbationPractitioner, postEsupervisionVideo, submitEsupervisionCheckin, verifyEsupervisionVideo } from '../../util/API';
import { getBrowserContext, getUuid } from '../../util/Common';
import ActivityLogPage from '../../pageObjects/Case/activity-log.page';
import { getCasesWithCheckInsSetup, getCrnsWithCheckInsSetup, Review, reviewCheckinMpop, reviewDataTable, reviewSubmittedCheckinMpop, ReviewType, SurveyResponse, YesNoCheck } from '../../util/ReviewCheckins';
import ReviewedSubmittedPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-submitted.page';
import ReviewedExpiredPage from '../../pageObjects/Case/Contacts/Checkins/Review/reviewed-expired.page';
import ManageCheckInsPage from '../../pageObjects/Case/Contacts/Checkins/manage.page';
import StopCheckInsPage from '../../pageObjects/Case/Contacts/Checkins/stop.page';
import { restartCheckinsMPop } from '../../util/StopStartCheckins';
import ReviewExpiredPage from '../../pageObjects/Case/Contacts/Checkins/Review/review-expired.page';
import { expect } from '@playwright/test';
import EligibilityPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/eligibility-check.page';
import PartiallyEligiblePage from '../../pageObjects/Case/Contacts/Checkins/SetUp/partially-eligible.page';
import DateFrequencyPage from '../../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page';
import EligiblePage from '../../pageObjects/Case/Contacts/Checkins/SetUp/eligible.page';
import IneligiblePage from '../../pageObjects/Case/Contacts/Checkins/SetUp/ineligible.page';

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
    await checkInSummaryPage.assertOnPage()
    const uuid = getUuid(page)
    ctx.contact.uuid = uuid
    ctx.checkIns.setup = setup
})

When('I set up checkIns with random values', async({ ctx }) => {
    const page = ctx.base.page
    const setup : MpopSetupCheckin = randomCheckIn() as MpopSetupCheckin
    const setUpOnLineCheckinsPage = new AppointmentsPage(page)
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
    await setupCheckinsMPop(page, setup)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.assertOnPage()
    const uuid = getUuid(page)
    ctx.contact.uuid = uuid
    ctx.checkIns.setup = setup
})

When('I make the following changes', async({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const changes: MpopSetupChanges = setupDataTable(data)
    await makeChangesSetupCheckins(page, changes)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.assertOnPage()
    await checkInSummaryPage.submit()
    await new Promise(resolve => setTimeout(resolve, 4000));
    ctx.checkIns.changes = changes
})

When('I make random changes', async({ ctx }) => {
    const page = ctx.base.page
    const changes : MpopSetupChanges = randomCheckIn(false) as MpopSetupChanges
    await makeChangesSetupCheckins(page, changes)
    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.assertOnPage()
    await checkInSummaryPage.submit()
    await new Promise(resolve => setTimeout(resolve, 4000));
    ctx.checkIns.changes = changes
})

When('I submit the checkin', async({ ctx }, data:DataTable) => {
    const confirmationPage = new ConfirmationPage(ctx.base.page)
    await confirmationPage.assertOnPage()
    await confirmationPage.checkWhatHappensNextTextExists()
    await confirmationPage.checkGoToAllCasesLinkExists()
    await confirmationPage.returnToPoPsOverviewButtonExist()
    await confirmationPage.selectPoPsOverviewButton()
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
   const contactLog = new ActivityLogPage(page, crn)
   await contactLog.navigateTo()
   await contactLog.assertOnPage()
   await contactLog.getQA('esup-manage-link').first().click()
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
   const contactLog = new ActivityLogPage(page, crn)
   await contactLog.assertOnPage()
   await contactLog.getQA('esup-manage-link').first().click()
   const reviewedSubmittedPage = new ReviewedSubmittedPage(page, crn)
   await reviewedSubmittedPage.assertOnPage()
})

When('I find a number of valid CRNs', async({ctx}) => {
    const page = ctx.base.page
    const startCrn = 'X983000'
    await getCrnsWithCheckInsSetup(page, startCrn) 
})

When('I find a number of valid cases', async({ctx}) => {
    const page = ctx.base.page
    await getCasesWithCheckInsSetup(page) 
})

When('I mock the completion of an expired checkin', async({ ctx }) => {
    const expiredCrn = ctx.checkIns.expiredCrn
    const token = await getClientToken()
    const practitioner = await getProbationPractitioner(expiredCrn, token)
    await createEsupervisionCheckin(practitioner, expiredCrn, dueDateString(today.minus({days: 7})), token)
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
   const contactLog = new ActivityLogPage(page, expiredCrn)
   await contactLog.assertOnPage()
   await contactLog.getQA('esup-manage-link').first().click()
   const reviewedExpiredPage = new ReviewedExpiredPage(page, expiredCrn)
   await reviewedExpiredPage.assertOnPage()
})

When('I navigate to checkIn details', async({ ctx }) => {
   const page = ctx.base.page
   const crn = ctx.case.crn
   const managePage = new ManageCheckInsPage(page, crn)
   await managePage.navigateTo()
   await managePage.assertOnPage()
})

When('I stop checkIns with {string}', async({ ctx }, reason) => {
   const page = ctx.base.page
   const managePage = new ManageCheckInsPage(page)
   await managePage.assertOnPage()
   await managePage.clickStopCheckIns()
   const stopPage = new StopCheckInsPage(page)
   await stopPage.completePage(true, reason)
})

Then('checkIns are labelled as stopped', async({ ctx }) => {
   const page = ctx.base.page
   const managePage = new ManageCheckInsPage(page)
   await managePage.assertOnPage()
   await managePage.clickBackLink()
   const overview = new OverviewPage(page)
   await overview.assertOnPage()
   await overview.checkSummaryRowValue(await overview.getSummaryRowByKey('Next check in due'), 'Check ins stopped')
})

Then('I restart checkIns with values', async({ ctx }, data:DataTable) => {
    const page = ctx.base.page
    const overview = new OverviewPage(page)
    await overview.assertOnPage()
    await overview.checkOnlineCheckInsLink(false)
    const managePage = new ManageCheckInsPage(page)
    await managePage.assertOnPage()
    await managePage.clickRestartCheckIns()
    const restart: MpopSetupRestart = setupDataTable(data) as MpopSetupRestart
    ctx.checkIns.restart = restart
    await restartCheckinsMPop(page, restart)
    const checkInSummaryPage = new CheckInSummaryPage(page, true)
    await checkInSummaryPage.assertOnPage()
    await checkInSummaryPage.submit()
    const confirmationPage = new ConfirmationPage(ctx.base.page, true)
    await confirmationPage.assertOnPage()
    await confirmationPage.checkWhatHappensNextTextExists()
    await confirmationPage.checkGoToAllCasesLinkExists()
    await confirmationPage.returnToPoPsOverviewButtonExist()
    await confirmationPage.selectPoPsOverviewButton()
})

Then('Checkins should be setup', async({ ctx }) => {
    const restart = ctx.checkIns.restart
    let details: MPoPCheckinDetails
    if (restart){
        details = {
            date: restart.date,
            frequency: restart.frequency,
            preference: restart.preference   
        }
    } else {
        const setup = ctx.checkIns.setup
        const changes = ctx.checkIns.changes
        details = {
            date: changes.date ?? setup.date,
            frequency: changes.frequency ?? setup.frequency,
            preference: changes.preference ?? setup.preference
        }
    }
    //Overview Page - Verify Online check ins section is displayed. Verify Contact Preference
    const overviewPage = new OverviewPage(ctx.base.page)
    await overviewPage.assertOnPage()
    await overviewPage.verifyCheckinDetails(details)
})

Then('I mock the completion of an expired checkin for {string}', async({ ctx }, cases) => {
    const caseList = cases.split(',')
    for (let i=0; i<caseList.length; i++){
        const crn = caseList[i]
        console.log(crn)
        const token = await getClientToken()
        const practitioner = await getProbationPractitioner(crn, token)
        await createEsupervisionCheckin(practitioner, crn, dueDateString(lastWeek), token, true)
    }
})

When('I find valid case from {string}', async({ ctx }, cases) => {
    const page = ctx.base.page
    const caseList = cases.split(',')
    for (let i=0; i<caseList.length; i++){
        const crn = caseList[i]
        console.log(crn)
        const contactPage = new ActivityLogPage(page, crn)
        await contactPage.navigateTo()
        await contactPage.assertOnPage()
        try {
            await contactPage.getQA('esup-manage-link').first().click({timeout: 3000})
        } catch {
            console.log('no checkins')
            continue
        }
        const review = new ReviewExpiredPage(page)
        try {
            await expect(review.getQA('pageHeading')).toHaveText(review.title!, {timeout: 3000})
            ctx.checkIns.expiredCrn = crn
            return 
        } catch {
            console.log('completed or reviewed')
        }
    }
    console.log('No valid cases left')
})

When('I fill eligibility values with {string}', async({ ctx }, ids: string) => {
    const page = ctx.base.page
    const numbers = ids.split(',').map(i => Number(i))
    const setUpOnLineCheckinsPage = new AppointmentsPage(page)
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
    const eligibilityPage = new EligibilityPage(page)
    await eligibilityPage.assertOnPage()
    await eligibilityPage.completePage(numbers)
})

Then('I {string} use checkIns', async({ ctx }, can: string) => {
    const page = ctx.base.page
    if (can === 'can, alongside face-to-face contact,'){
        const partialPage = new PartiallyEligiblePage(page)
        await partialPage.assertOnPage()
        await partialPage.completePage()
        const dateFrequencyPage = new DateFrequencyPage(page)
        await dateFrequencyPage.assertOnPage()
    } else if (can === 'can'){
        const eligiblePage = new EligiblePage(page)
        await eligiblePage.assertOnPage()
        await eligiblePage.completePage(1)
        const dateFrequencyPage = new DateFrequencyPage(page)
        await dateFrequencyPage.assertOnPage()
    } else if (can === 'cannot'){
        const ineligiblePage = new IneligiblePage(page)
        await ineligiblePage.assertOnPage()
        await ineligiblePage.completePage()
        const overview = new OverviewPage(page)
        await overview.assertOnPage()
    }

})