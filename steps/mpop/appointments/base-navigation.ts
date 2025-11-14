import { Page } from "@playwright/test"
import CasesPage from "../pages/cases.page"
import OverviewPage from "../pages/overview.page"
import AppointmentsPage from "../pages/appointments.page"
import { loginMPoPAndGoToCases } from "../personal-details/cases"
import SearchPage from "../pages/search.page"
import ActivityLogPage from "../pages/activity-log.page"

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

export const navigateToCase = async(page: Page, crn: string): Promise<OverviewPage> => {
    await loginMPoPAndGoToCases(page)
    const casesPage = new CasesPage(page)
    await casesPage.usePrimaryNavigation("Search")
    const searchPage = new SearchPage(page)
    await searchPage.searchCases(crn)
    await searchPage.selectCaseByID(1)
    return new OverviewPage(page)
}

