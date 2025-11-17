import { Page } from "@playwright/test"
import OverviewPage from "../pages/case/overview.page"
import AppointmentsPage from "../pages/case/appointments.page"
import ActivityLogPage from "../pages/case/activity-log.page"
import { navigateToSearch } from "./base-navigation"
import ManageAppointmentsPage from "../pages/appointments/manage-appointment.page"
import { navigateToAppointments } from "./case-navigation"
import CaseUpcomingAppointmentsPage from "../pages/appointments/upcoming-appointments.page"


export const navigateToPastAppointment = async(page: Page, crn: string, id: number): Promise<ManageAppointmentsPage> => {
    const appointments : AppointmentsPage = await navigateToAppointments(page, crn)
    return appointments.selectPastAppointment(id)
}

export const navigateToLatestAppointment = async(page: Page, crn: string): Promise<ManageAppointmentsPage> => {
    const appointments : AppointmentsPage = await navigateToAppointments(page, crn)
    const upcomingAppointments : CaseUpcomingAppointmentsPage = await appointments.viewUpcomingAppointments()
    while (await upcomingAppointments.getNavigation("Next").count() != 0){
        await upcomingAppointments.pagination("next")
    }
    const length = await appointments.getTableLength("upcomingAppointments")
    return await appointments.selectFutureAppointment(length-1)
}
