import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { MpopDateTime } from "../../appointments/create-appointment";
import TypeAttendancePage from "./type-attendance.page";
import { DateTime } from 'luxon'
import { updateDateTime } from "../../utils";

export default class LocationDateTimePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Appointment date, time and location")
    }

    async checkOnPage() {
        await expect(this.page.locator('[data-qa="pageHeading"]').first()).toContainText(this.title)
    }

    async completePage(dateTime?: MpopDateTime, locationId?: number, validation: boolean= true) {
        if (dateTime != undefined){
            await this.getClass("moj-datepicker").locator('[type="text"]').fill(dateTime.date)
            await this.fillText("startTime", dateTime.startTime)
            await this.fillText("endTime", dateTime.endTime)
        }
        if (locationId != undefined){
            await this.clickRadio("locationCode", locationId)
        }
        await this.submit()
        if (validation){
            await this.validateDateTime(dateTime, locationId)
        }
    }

    async validateDateTime(dateTime: MpopDateTime, locationId?: number){
        try {
            await this.checkOnPage()
            dateTime = updateDateTime(dateTime)
            await this.completePage(dateTime, locationId)
        } catch {
            return
        }
    }

    async testBacklink(change: boolean) {
        await this.clickBackLink()
        if (change){
            //change case
        }else{
            const typeAttendancePage = new TypeAttendancePage(this.page)
            typeAttendancePage.submit()
        }
        await this.checkOnPage()
    }

    async fillText(qa: string, text: string){
       await this.getQA(qa).locator('[type="text"]').fill(text)
    }

    async selectDate(date: string){
        await this.page.getByRole("button").filter({hasText: "Choose date"}).click()
        await this.page.getByTestId(date).click()
    }
}