import {Browser, BrowserContext, expect, Page, test} from '@playwright/test'
import * as dotenv from 'dotenv'
import AppointmentsPage from "../../../../steps/mpop/pages/case/appointments.page";
import { testCrn } from '../../../../steps/test-data.ts'
import { navigateToAppointments } from '../../../../steps/mpop/navigation/case-navigation.ts'
import SetupOnlineCheckinsPage from "../../../../steps/mpop/pages/setup-online-checkins/setup-online-checkins-page";
import DateFrequencyPagePage from "../../../../steps/mpop/pages/setup-online-checkins/date-frequency.page";
import ContactPreferencePage from "../../../../steps/mpop/pages/setup-online-checkins/contact-preference.page";
import PhotoOptionsPage from "../../../../steps/mpop/pages/setup-online-checkins/photo-options.page";
import UploadPhotoPage from "../../../../steps/mpop/pages/setup-online-checkins/upload-photo.page";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page
let appointments: AppointmentsPage
let setuponlinecheckinspage: SetupOnlineCheckinsPage
let datefrequencypage: DateFrequencyPagePage
let contactpreferencepage: ContactPreferencePage
let photooptionspage: PhotoOptionsPage
let uploadPhotoPage: UploadPhotoPage

test.describe('Set up online checkins page', () => {

    test.beforeEach(async ({ browser: b }) => {
        test.setTimeout(120000)
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        appointments = await navigateToAppointments(page, testCrn)
        //await appointments.checkOnPage()

        setuponlinecheckinspage = new SetupOnlineCheckinsPage(page)
        await setuponlinecheckinspage.checkOnPage()

        datefrequencypage = new DateFrequencyPagePage(page)
        contactpreferencepage = new ContactPreferencePage(page)
        photooptionspage = new PhotoOptionsPage(page)
        uploadPhotoPage = new UploadPhotoPage(page)

    })
    test.afterEach(async () => {
        await context.close()
    })

    test('Render the page', async() => {
        await appointments.checkOnPage()
        await setuponlinecheckinspage.checkOnPage()
    })

    test('Select the Contact Preference as TEXT MESSAGE and proceed through the journey', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await datefrequencypage.checkPageHeader("pageHeading", "Set up online check ins")
        // Asserting the Date Picker element exists in Dom and is visible
        await datefrequencypage.expectElementVisible(datefrequencypage.datepickerQA)

        await datefrequencypage.useTomorrowsDate()
        await datefrequencypage.selectOption8Weeks()

        // Navigate to Contact preference page, verify page header
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
        // If mobile number does not exist, click the change link and add the new mobile number. If it exists do nothing
        await contactpreferencepage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )

        // Photo options page
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photooptionspage.selectUploadAPhoto()

        // Upload a Photo page
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.uploadPhoto()
        await uploadPhotoPage.submit();
        // Next page
        await photooptionspage.checkPageHeader("pageHeading", "Does this photo meet the rules?");


    })

    test('Select Contact Preference as EMAIL and proceed through the journey', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await datefrequencypage.checkPageHeader("pageHeading", "Set up online check ins")
        await datefrequencypage.checkElementExists()
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        await datefrequencypage.useTomorrowsDate()
        await datefrequencypage.selectOption4Weeks()

        // Navigate to Contact preference page, verify page header
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
        // If mobile number does not exist, click the change link and add the new mobile number. If it exists do nothing
        await contactpreferencepage.enterContactPreferenceIfDoesNotExists("Test@test.com", "email" )
        // Photo options page
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photooptionspage.selectUploadAPhoto()

        // Upload a Photo page
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.uploadPhoto()
        await uploadPhotoPage.submit();
        // Next page
        await photooptionspage.checkPageHeader("pageHeading", "Does this photo meet the rules?");
     })

    // BACK link Instructions page - How you can use online check ins
    test('Check Back link exists on Instructions Page - How can you use online check ins and navigates to the previous page Appointments', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.clickBackLink()
        await appointments.checkQA("appointments-header-label", "Appointments")
    })
    // CANCEL link Instructions page - How you can use online check ins
    test('Check Cancel button on Instructions Page and navigates to the previous page Appointments', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.clickLink('Cancel')
        await appointments.checkQA("appointments-header-label", "Appointments")
    })

    //SET UP Online Check Ins page
    // BACK link on Instructions page - How you can use online check ins
    test('Check Back link exists on Set Up Online Check Ins Page  and navigates to the previous page How you can use online check ins', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
        await setuponlinecheckinspage.clickBackLink()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
    })

    //CONTACT Preferences page
    // BACK link on Contact Preferences page
    test('Check Back link exists on Contact Preference Page - and navigates to the previous page Set up online check ins', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        await datefrequencypage.useTomorrowsDate()
        await datefrequencypage.selectOption4Weeks()
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
        await datefrequencypage.clickBackLink()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
    })

    // Take a Photo page
    // BACK link on Take a photo page
    test('Check Back link exists on Take a Photo Page - and navigates to the previous page Contact Preferences', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        await datefrequencypage.useTomorrowsDate()
        await datefrequencypage.selectOption4Weeks()
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
        await contactpreferencepage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photooptionspage.clickBackLink()
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
    })

    // Upload a Photo page
    // BACK link on Upload a photo page
    test('Check Back link exists on Upload a Photo Page - and navigates to the previous page Take a Photo', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        await datefrequencypage.useTomorrowsDate()
        await datefrequencypage.selectOption4Weeks()
        await contactpreferencepage.checkPageHeader("pageHeading", "Contact Preferences")
        await contactpreferencepage.enterContactPreferenceIfDoesNotExists("07771 900 900", "text" )
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
        await photooptionspage.selectUploadAPhoto()
        await uploadPhotoPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.clickBackLink()
        await photooptionspage.checkPageHeaderPhoto("pageHeading", "Take a photo of")
    })

    // Validation on Set up online check ins - Date Frequency page
    test('Check validation exists in Set up online check ins', async () => {
        await setuponlinecheckinspage.clickSetupOnlineCheckInsBtn()
        await appointments.checkPageHeader("pageHeading", "How you can use online check ins")
        await setuponlinecheckinspage.submit()
        await setuponlinecheckinspage.checkPageHeader("pageHeading", "Set up online check ins")
        await expect(page.locator(datefrequencypage.datepickerQA)).toBeVisible()
        setuponlinecheckinspage.submit()
    })

})