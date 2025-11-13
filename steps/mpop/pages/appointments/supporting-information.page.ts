import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopDateTime } from "../../appointments/create-appointment";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";

export default class SupportingInformationPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Add supporting information (optional)")
    }

    async completePage(sensitivity: boolean, note?: string) {
        if (note != undefined){
            await this.fillText("notes", note)
        }
        await this.clickRadio("visorReport", sensitivity ? 0 : 1)
        await this.submit()
    }

    async testBacklink(change: boolean) {
        await this.clickBackLink()
        if (change){
            //change case
        }else{
            const locationDateTimePage = new LocationDateTimePage(this.page)
            locationDateTimePage.submit()
        }
        await this.checkOnPage()
    }

    async fillText(qa: string, note: string){
       await this.getQA(qa).getByRole('textbox').fill(note)
    }
}