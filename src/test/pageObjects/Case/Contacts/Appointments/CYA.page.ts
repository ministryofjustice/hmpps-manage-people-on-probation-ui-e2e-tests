import { Page } from "@playwright/test";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopAppointmentChanges } from "../../../../util/ArrangeAppointment";
import AttendedCompliedPage from "./attended-complied.page";
import AddNotePage from "./add-note.page";
import TextConfirmationPage from "./text-confirmation-page";

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
        "Text message confirmation",
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
            await sentencePage.assertOnPage()
            await sentencePage.completePage(changes.sentenceId)
            const returned = await this.checkOnPage(true)
            if (!returned){
                const typeAttendancePage = new TypeAttendancePage(this.page)
                await typeAttendancePage.assertOnPage()
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
            await typeAttendancePage.assertOnPage()
            await typeAttendancePage.changePage(changes.typeId, changes.attendee, changes.isVisor)
            const returned = await this.checkOnPage(true)
            if (!returned){
                const locationDateTimePage = new LocationDateTimePage(this.page)
                await locationDateTimePage.assertOnPage()
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
            await locationDateTimePage.assertOnPage()
            let locationId = undefined
            if (changes.locationId){
                locationId = await locationDateTimePage.findLocationId(typeId, changes.locationId)
            }
            await locationDateTimePage.completePage(changes.dateTime, locationId)
            const returned = await this.checkOnPage(true)
            if (!returned){
                if (newPast){
                    const attendedCompliedPage = new AttendedCompliedPage(this.page)
                    await attendedCompliedPage.assertOnPage()
                } else {
                    const textConfirmationPage = new TextConfirmationPage(this.page)
                    await textConfirmationPage.assertOnPage()
                }
                autoRedirected = true
            }
        }
        if (changes.text){
            if (!autoRedirected){
                await this.clickSummaryAction(rows.indexOf("Text message confirmation"))
            } else {
                autoRedirected = false
            }
            const textConfirmationPage = new TextConfirmationPage(this.page)
            await textConfirmationPage.assertOnPage()
            await textConfirmationPage.completePage(changes.text, changes.mobile, changes.dateTime.date, changes.dateTime.startTime, changes.locationId)
            const returned = await this.checkOnPage()
            if (!returned){
                if (newPast){
                    const supportingInformationPage = new SupportingInformationPage(this.page)
                    await supportingInformationPage.assertOnPage()
                } else {
                    const addNotePage = new AddNotePage(this.page)
                    await addNotePage.assertOnPage()
                }
                autoRedirected = true
            }
        } else if (!currentPast && newPast && autoRedirected){
            const attendedCompliedPage = new AttendedCompliedPage(this.page)
            await attendedCompliedPage.assertOnPage()
            await attendedCompliedPage.completePage()
            autoRedirected = true
        }
        if (changes.note || changes.sensitivity){
            if (!autoRedirected){
                if (changes.note){
                    await this.clickSummaryAction(rows.indexOf("Supporting information"))
                }
                else if (changes.sensitivity){
                    await this.clickSummaryAction(rows.indexOf("Sensitivity"))
                }
            }
            if (newPast){
                const addNotePage = new AddNotePage(this.page)
                await addNotePage.assertOnPage()
                await addNotePage.changePage(changes.sensitivity, changes.note)
            } else {
                const supportingInformationPage = new SupportingInformationPage(this.page)
                await supportingInformationPage.assertOnPage()
                await supportingInformationPage.changePage(changes.sensitivity, changes.note)
            }
        }

    }
}