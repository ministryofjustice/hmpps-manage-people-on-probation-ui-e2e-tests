import {Browser, BrowserContext, expect, Page, test} from '@playwright/test'
import * as dotenv from 'dotenv'
import AppointmentsPage from "../../../steps/mpop/pages/case/appointments.page";
import {automatedTestUser1, testCrn, testPOPName} from '../../../steps/test-data.ts'
import { navigateToAppointments } from '../../../steps/mpop/navigation/case-navigation.ts'
import SetupOnlineCheckinsPage from "../../../steps/mpop/pages/setup-online-checkins/setup-online-checkins-page";
import DateFrequencyPagePage from "../../../steps/mpop/pages/setup-online-checkins/date-frequency.page";
import ContactPreferencePage from "../../../steps/mpop/pages/setup-online-checkins/contact-preference.page";
import PhotoOptionsPage from "../../../steps/mpop/pages/setup-online-checkins/photo-options.page";
import UploadPhotoPage from "../../../steps/mpop/pages/setup-online-checkins/upload-photo.page";
import PhotoMeetRulesPage    from "../../../steps/mpop/pages/setup-online-checkins/photo-meet-rules.page";
import CheckInSummaryPage    from "../../../steps/mpop/pages/setup-online-checkins/check-in-summary.page";
import ConfirmationPage from "../../../steps/mpop/pages/setup-online-checkins/confirmation.page";
import OverviewPage from "../../../steps/mpop/pages/case/overview.page";
import loginDeliusAndCreateOffender from "../../../steps/delius/create-offender/createOffender";
import {data} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data";
import {
    createCustodialEvent
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let person;
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage
let overviewPage: OverviewPage
let setUpOnLineCheckinsPage: SetupOnlineCheckinsPage
let dateFrequencyPage: DateFrequencyPagePage
let contactPreferencePage: ContactPreferencePage
let photoOptionsPage: PhotoOptionsPage
let uploadPhotoPage: UploadPhotoPage
let photoMeetRulesPage: PhotoMeetRulesPage
let checkInSummaryPage: CheckInSummaryPage
let confirmationPage: ConfirmationPage

test.describe('Set up online checkins page', () => {
    test.beforeAll(async ({browser: b}) => {
        test.setTimeout(120000)
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        ;
        //[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
        //sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

    })

    test.beforeEach(async ({ browser: b }) => {
        test.setTimeout(120000)
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        appointments = await navigateToAppointments(page, testCrn)
        //await appointments.checkOnPage()

        setUpOnLineCheckinsPage = new SetupOnlineCheckinsPage(page)
        await setUpOnLineCheckinsPage.checkOnPage()
        overviewPage = new OverviewPage(page)
        dateFrequencyPage = new DateFrequencyPagePage(page)
        contactPreferencePage = new ContactPreferencePage(page)
        photoOptionsPage = new PhotoOptionsPage(page)
        uploadPhotoPage = new UploadPhotoPage(page)
        photoMeetRulesPage = new PhotoMeetRulesPage(page)
        checkInSummaryPage = new CheckInSummaryPage(page)
        confirmationPage = new ConfirmationPage(page)

    })
    test.afterEach(async () => {
        await context.close()
    })

    test('Render the page', async() => {
        await appointments.checkOnPage()
        await setUpOnLineCheckinsPage.checkOnPage()
    })

    test.only('Select the Contact Preference as TEXT MESSAGE and proceed through the journey', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await setUpOnLineCheckinsPage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)

        // Asserting the Date Picker element exists in Dom and is visible
        await dateFrequencyPage.expectElementVisible(dateFrequencyPage.datepickerQA)

        await dateFrequencyPage.useTomorrowsDate()
        await dateFrequencyPage.selectOption8Weeks()

        // Navigate to Contact preference page, verify page header and select TEXT Message option
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
        // If mobile number does not exist, click the change link and add the new mobile number. If it exists do nothing
        await contactPreferencePage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )

        // Photo options page
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photoOptionsPage.selectUploadAPhoto()

        // Upload a Photo page
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.uploadPhoto()
        await uploadPhotoPage.submit()

        // Photo Meet the rules page
        await photoOptionsPage.checkPageHeader("pageHeading", "Does this photo meet the rules?");
        await photoMeetRulesPage.checkPhotoRulesDisplayed();
        await Promise.all([page.waitForURL(/\/check-in\/checkin-summary$/), photoMeetRulesPage.submit(),]);

        // ******   Summary Page   ******
        // Submit and wait for Summary page navigation
        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);


        // Change date
        await checkInSummaryPage.clickDateChangeLink()
        const { summaryFormat } = await dateFrequencyPage.updateToNextWeekDate()
        await dateFrequencyPage.submit()

        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);
        await checkInSummaryPage.verifySummaryField('date', summaryFormat)

        // Change Date frequency
        // await checkInSummaryPage.clickDateIntervalChangeLink()
        // const updatedFrequencyForSummaryPage = await dateFrequencyPage.selectOption2Weeks()
        // await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);
        // await checkInSummaryPage.verifySummaryField('frequency', updatedFrequencyForSummaryPage)



        // Change Preferred Communication
        await checkInSummaryPage.clickPreferredCommsActionChangeLink()
        const preferredCommsEmail = await contactPreferencePage.enterContactPreferenceIfDoesNotExists("Test@test.com", "emailUpdate" )
        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);
        await checkInSummaryPage.verifySummaryField('preferredCommunication', preferredCommsEmail)

        // TODO Radio selections are not persisted - Bug already reported https://dsdmoj.atlassian.net/browse/MAN-1611
        // Change Mobile Number
        await checkInSummaryPage.clickMobileActionChangeLink()
        const preferredCommsMobileUpdate = await contactPreferencePage.enterContactPreferenceIfDoesNotExists("07771 999 999", "textUpdate" )
        await contactPreferencePage.continueButton()
        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);
        await checkInSummaryPage.verifySummaryField('preferredCommunication', preferredCommsMobileUpdate)

        // Email Address
        await checkInSummaryPage.clickEmailActionChangeLink()
        const preferredCommsEmailUpdate = await contactPreferencePage.enterContactPreferenceIfDoesNotExists("Test@gmail.com", "emailUpdate" )
        await contactPreferencePage.continueButton()
        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);
        await checkInSummaryPage.verifySummaryField('preferredCommunication', preferredCommsEmailUpdate)

        // // How do you want to take a Photo
        // await checkInSummaryPage.clickTakeAPhotoActionChangeLink()
        //
        // // Photo - uploaded
        // await checkInSummaryPage.clickPhotoActionChangeLink()

        // ****  Confirmation Page   ***
        // await checkInSummaryPage.submit()
        // await confirmationPage.checkPageHeader("pageHeading", "Online check ins added");
        // await confirmationPage.checkWhatHappensNextTextExists()
        // await confirmationPage.returnToPoPsOverviewButtonExist()
        // await confirmationPage.checkGoToAllCasesLinkExists()
        // // Click on Return to PoP's Overview button
        // await confirmationPage.submit()
        // //Overview Page - Verify Online check ins section is displayed. Verify Contact Preference
        // await confirmationPage.checkPageHeader("pageHeading", "Overview");
        // await overviewPage.checkOnlineCheckInsSectionExists()
        // await checkInSummaryPage.verifySummaryField('firstCheckIn', summaryFormat)
        // await checkInSummaryPage.verifySummaryField('frequency', updatedFrequencyForSummaryPage)
        // await checkInSummaryPage.verifySummaryField('preferredCommunication', preferredCommsEmail)

    })

    test('Select Contact Preference as EMAIL and proceed through the journey', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await setUpOnLineCheckinsPage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await dateFrequencyPage.checkElementExists()
        await expect(page.locator(dateFrequencyPage.datepickerQA)).toBeVisible()
        await dateFrequencyPage.useTomorrowsDate()
        await dateFrequencyPage.selectOption4Weeks()

        // Navigate to Contact preference page, verify page header and select Email Message option
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
        // If mobile number does not exist, click the change link and add the new mobile number. If it exists do nothing
        await contactPreferencePage.enterContactPreferenceIfDoesNotExists("Test@test.com", "email" )
        // Photo options page
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photoOptionsPage.selectUploadAPhoto()

        // Upload a Photo page
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.uploadPhoto()
        await uploadPhotoPage.submit();
        // Photo Meet the rules page
        await photoOptionsPage.checkPageHeader("pageHeading", "Does this photo meet the rules?");
        await photoMeetRulesPage.checkPhotoRulesDisplayed();
        await photoMeetRulesPage.submit()
        // Summary page
        await checkInSummaryPage.checkPageHeader("pageHeading", /Check your answers before adding .* to online check ins/i);

    })

    // BACK link Instructions page - How you can use online check ins
    test('Check Back link exists on Instructions Page - How can you use online check ins and navigates to the previous page Appointments', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await setUpOnLineCheckinsPage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.clickBackLink()
        await appointments.checkQA("appointments-header-label", "Appointments")
    })
    // CANCEL link Instructions page - How you can use online check ins
    test('Check Cancel button on Instructions Page and navigates to the previous page Appointments', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await setUpOnLineCheckinsPage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.clickLink('Cancel')
        await appointments.checkQA("appointments-header-label", "Appointments")
    })

    //SET UP Online Check Ins page
    // BACK link on Instructions page - How you can use online check ins
    test('Check Back link exists on Set Up Online Check Ins Page  and navigates to the previous page How you can use online check ins', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await setUpOnLineCheckinsPage.clickBackLink()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
    })

    //CONTACT Preferences page
    // BACK link on Contact Preferences page
    test('Check Back link exists on Contact Preference Page - and navigates to the previous page Set up online check ins', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await expect(page.locator(dateFrequencyPage.datepickerQA)).toBeVisible()
        await dateFrequencyPage.useTomorrowsDate()
        await dateFrequencyPage.selectOption4Weeks()
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
        await dateFrequencyPage.clickBackLink()
        await setUpOnLineCheckinsPage.checkPageHeader("pageHeading", "Set up online check ins")
    })

    // Take a Photo page
    // BACK link on Take a photo page
    test('Check Back link exists on Take a Photo Page - and navigates to the previous page Contact Preferences', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await expect(page.locator(dateFrequencyPage.datepickerQA)).toBeVisible()
        await dateFrequencyPage.useTomorrowsDate()
        await dateFrequencyPage.selectOption4Weeks()
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
        await contactPreferencePage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photoOptionsPage.clickBackLink()
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
    })

    // Upload a Photo page
    // BACK link on Upload a photo page
    test('Check Back link exists on Upload a Photo Page - and navigates to the previous page Take a Photo', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await expect(page.locator(dateFrequencyPage.datepickerQA)).toBeVisible()
        await dateFrequencyPage.useTomorrowsDate()
        await dateFrequencyPage.selectOption4Weeks()
        await contactPreferencePage.checkPageHeader("pageHeading", "Contact Preferences")
        await contactPreferencePage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photoOptionsPage.selectUploadAPhoto()
        await uploadPhotoPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.clickBackLink()
        await photoOptionsPage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
    })

    // Validation on Set up online check ins - Date Frequency page
    test('Check validation exists in Set up online check ins', async () => {
        await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setUpOnLineCheckinsPage.submit()
        await contactPreferencePage.checkPageHeader("pageHeading", /Set up\s+online check ins/i)
        await expect(page.locator(dateFrequencyPage.datepickerQA)).toBeVisible()
        await setUpOnLineCheckinsPage.submit()
    })



})