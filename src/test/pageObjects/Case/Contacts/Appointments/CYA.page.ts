import { Page } from "@playwright/test";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";
import TextConfirmationPage from "./text-confirmation-page"
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopAppointmentChanges } from "../../../../util/ArrangeAppointment";
import TextConfirmationPage from "./text-confirmation-page";
import AttendedCompliedPage from "./attended-complied.page";

export default class CYAPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Check your answers then confirm the appointment", crn, uuid)
    }

    async completePage(isVisor: boolean = false, past: boolean = false) {
        const rows = [
        "Appointment for",
        "Appointment type",
        ...(isVisor ? ["VISOR report"] : []),
        "Attending",
        "Location",
        "Date and time",
        ...(past ? ["Attended and complied"] : ["Text message confirmation"]),
        "Supporting information",
        "Sensitivity",
        ]
        for (let i=0; i<rows.length; i+=1) {
            await this.checkSummaryRowKey(await this.getSummaryRowByID(i), rows[i])
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
            TextConfirmationPage,
            SupportingInformationPage,
            SupportingInformationPage
        ]
        const page = new pages[id](this.page)
        return page
    }

    async makeChanges(changes: MpopAppointmentChanges, typeId: number, currentPast: boolean, newPast: boolean, isVisor?: boolean){
        const rows = [
        "Appointment for",
        "Appointment type",
        ...(isVisor ? ["VISOR report"] : []),
        "Attending",
        "Location",
        "Date and time",
        ...(currentPast ? ["Attended and complied"] : ["Text message confirmation"]),
        "Supporting information",
        "Sensitivity",
        ]
        let autoRedirected = false
        if (changes.sentenceId){
            await this.clickSummaryAction(rows.indexOf("Appointment for"))
            const sentencePage = new SentencePage(this.page)
            await sentencePage.checkOnPage()
            await sentencePage.completePage(changes.sentenceId)
            try {
                this.checkOnPage()
            } catch {
                const typeAttendancePage = new TypeAttendancePage(this.page)
                await typeAttendancePage.checkOnPage()
                autoRedirected = true
            }
        }
        if (changes.typeId || changes.attendee || changes.isVisor){
            if (!autoRedirected){
                if (changes.typeId){
                    await this.clickSummaryAction(rows.indexOf("Appointment for"))
                }
                else if (changes.isVisor){
                    await this.clickSummaryAction(rows.indexOf("VISOR report"))
                }
                else if (changes.attendee){
                    await this.clickSummaryAction(rows.indexOf("Attending"))
                }
            } else {
                autoRedirected = false
            }
            const typeAttendancePage = new TypeAttendancePage(this.page)
            await typeAttendancePage.checkOnPage()
            await typeAttendancePage.changePage(changes.typeId, changes.attendee, changes.isVisor)
            try {
                this.checkOnPage()
            } catch {
                const locationDateTimePage = new LocationDateTimePage(this.page)
                await locationDateTimePage.checkOnPage()
                autoRedirected = true
            }
        }
        if (changes.locationId || changes.dateTime){
            if (!autoRedirected){
                if (changes.locationId){
                    await this.clickSummaryAction(rows.indexOf("Location"))
                }
                else if (changes.dateTime){
                    await this.clickSummaryAction(rows.indexOf("Date and time"))
                }
            } else {
                autoRedirected = false
            }
            const locationDateTimePage = new LocationDateTimePage(this.page)
            await locationDateTimePage.checkOnPage()
            let locationId = undefined
            if (changes.locationId){
                locationId = await locationDateTimePage.findLocationId(typeId, changes.locationId)
            }
            await locationDateTimePage.completePage(changes.dateTime, locationId)
            try {
                this.checkOnPage()
            } catch {
                if (currentPast){
                    const textConfirmationPage = new TextConfirmationPage(this.page)
                    await textConfirmationPage.checkOnPage()
                } else {
                    const attendedCompliedPage = new AttendedCompliedPage(this.page)
                    await attendedCompliedPage.checkOnPage()
                }
                autoRedirected = true
            }
        }
        //rest of journeys
    }
}