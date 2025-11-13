import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopAttendee } from "../../appointments/create-appointment";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";

export default class CYAPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Check your answers then confirm the appointment")
    }

    async completePage(isVisor?: boolean) {
        const rows = [
        "Appointment for",
        "Appointment type",
        ...(isVisor != undefined ? ["VISOR report"] : []),
        "Attending",
        "Location",
        "Date and time",
        "Supporting information",
        "Sensitivity",
        ]
        for (let i=0; i<rows.length; i+=1) {
            await this.checkSummaryRowKey(i, rows[i])
        }
        await this.submit()
    }

    async clickChangeLink(id: number, isVisor?: boolean){
        await this.clickSummaryAction(id)
        const pages = [
            SentencePage,
            TypeAttendancePage,
            ...(isVisor != undefined ? [TypeAttendancePage] : []),
            AttendancePage,
            LocationDateTimePage,
            LocationDateTimePage,
            SupportingInformationPage,
            SupportingInformationPage
        ]
        const page = new pages[id](this.page)
        return page
    }
}