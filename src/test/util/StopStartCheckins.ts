import { Page } from "@playwright/test"
import { MpopSetupRestart } from "./SetupOnlineCheckins"
import DateFrequencyPage from "../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page"
import ContactPreferencePage from "../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page"
import CheckInSummaryPage from "../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page"

export const restartCheckinsMPop = async(page: Page, setup: MpopSetupRestart) => {
     // Navigate to Date frequency page, verify page header and complete the page
    const dateFrequencyPage = new DateFrequencyPage(page, true)
    await dateFrequencyPage.assertOnPage()
    await dateFrequencyPage.completePage(setup.date, setup.frequency)

    // Navigate to Contact preference page, verify page header and select TEXT Message option
    const contactPreferencePage = new ContactPreferencePage(page, true) 
    await contactPreferencePage.assertOnPage()
    await contactPreferencePage.completePage(setup.contact, setup.preference )

    const checkInSummaryPage = new CheckInSummaryPage(page, true)
    await checkInSummaryPage.assertOnPage()
}