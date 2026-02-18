import { expect, Page } from "@playwright/test";
import TypeAttendancePage from "./type-attendance.page";
import ContactPage from "../contactpage";
import { MpopDateTime, updateDateTime } from "../../../../util/DateTime.ts"

export default class LocationDateTimePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Appointment date, time and location", crn, uuid)
    }

    async checkOnPage() {
        await expect(this.page.locator('[data-qa="pageHeading"]').first()).toContainText(this.title!)
    }

    async findLocationId(typeId: number, location: number | "not needed" | "not in list") {
      if (location !== 'not needed' && location !== 'not in list'){
        return location
      } else {
         const locationNotNeeded = typeId === 1 || typeId === 5
         const locations = await this.countRadioOptions('locationCode')
         if (locationNotNeeded){
            if (location === 'not needed'){
                return locations-1
            } else if (location === 'not in list'){
                return locations-2
            }
         } else {
            if (location === 'not needed'){
                console.log('location needed so can`t select')
                return locations-1
            } else if (location === 'not in list'){
                return locations-1
            }
         }
      }
    }

    async completePage(dateTime?: MpopDateTime, locationId?: number, validation: boolean= true) {
        if (dateTime != undefined){
            await this.getClass("moj-datepicker").locator('[type="text"]').fill(dateTime.date)
            await this.fillText("startTime", dateTime.startTime)
            await this.fillText("endTime", dateTime.endTime)
        }
        console.log(locationId)
        if (locationId !== undefined){
            await this.clickRadio("locationCode", locationId as number)
        }
        await this.submit()
        if (validation){
            await this.validateDateTime(dateTime!, locationId)
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