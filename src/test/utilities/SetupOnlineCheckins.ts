import { Page } from "@playwright/test"
import DateFrequencyPage, { FrequencyOptions } from "../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page"
import ContactPreferencePage, { contactMethod } from "../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page"
import PhotoOptionsPage, { PhotoOptions } from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-options.page"
import InstructionsPage from "../pageObjects/Case/Contacts/Checkins/SetUp/instructions.page"
import UploadPhotoPage from "../pageObjects/Case/Contacts/Checkins/SetUp/upload-photo.page"
import PhotoMeetRulesPage from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-meet-rules.page"
import CheckInSummaryPage from "../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page"

export interface MpopSetupCheckin {
    date: string
    frequency: FrequencyOptions
    contact: string
    preference: contactMethod
    photo: PhotoOptions
}

export const setupCheckinsMPop = async(page: Page, setup: MpopSetupCheckin) => {
    const instructionPage = new InstructionsPage(page)
    await instructionPage.checkOnPage()
    await instructionPage.completePage()

     // Navigate to Date frequency page, verify page header and complete the page
    const dateFrequencyPage = new DateFrequencyPage(page)
    await dateFrequencyPage.checkOnPage()
    await dateFrequencyPage.completePage(setup.date, setup.frequency)

    // Navigate to Contact preference page, verify page header and select TEXT Message option
    const contactPreferencePage = new ContactPreferencePage(page) 
    await contactPreferencePage.checkOnPage()
    await contactPreferencePage.enterContactPreferenceIfDoesNotExists(setup.contact, setup.preference )
    
    // Photo options page
    const photoOptionsPage = new PhotoOptionsPage(page) 
    await photoOptionsPage.checkOnPage()
    await photoOptionsPage.completePage(setup.photo)

    // Upload a Photo page
    const uploadPhotoPage = new UploadPhotoPage(page)
    await uploadPhotoPage.checkOnPage()
    // await uploadPhotoPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
    await uploadPhotoPage.completePage()

    // Photo Meet the rules page
    const photoMeetRulesPage = new PhotoMeetRulesPage(page)
    await photoMeetRulesPage.checkOnPage()
    await photoMeetRulesPage.completePage()

    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
}