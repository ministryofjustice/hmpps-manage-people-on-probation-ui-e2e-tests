import { Page } from "@playwright/test"
import OverviewPage from "../pages/case/overview.page"
import AppointmentsPage from "../pages/case/appointments.page"
import ActivityLogPage from "../pages/case/activity-log.page"
import { navigateToSearch } from "./base-navigation"
import PersonalDetailsPage from "../pages/case/personal-details.page"

export const navigateToAppointments = async (page: Page, crn: string) : Promise<AppointmentsPage> => {
    const overviewPage = await navigateToCase(page, crn)
    await overviewPage.useSubNavigation("appointmentsTab")
    return new AppointmentsPage(page)
}

export const navigateToActivityLog = async (page: Page, crn: string) : Promise<ActivityLogPage> => {
    const overviewPage = await navigateToCase(page, crn)
    await overviewPage.useSubNavigation("activityLogTab")
    return new ActivityLogPage(page)
}

export const navigateToPersonalDetails = async (page: Page, crn: string) : Promise<PersonalDetailsPage> => {
    const overviewPage = await navigateToCase(page, crn)
    await overviewPage.useSubNavigation("personalDetailsTab")
    return new PersonalDetailsPage(page)
}

export const navigateToCase = async(page: Page, crn: string): Promise<OverviewPage> => {
    const searchPage = await navigateToSearch(page)
    await searchPage.searchCases(crn)
    await searchPage.selectCaseByID(1)
    return new OverviewPage(page)
}

