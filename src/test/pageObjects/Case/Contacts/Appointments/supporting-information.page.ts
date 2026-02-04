import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import ContactPage from "../contactpage";

export default class SupportingInformationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Add supporting information (optional)", crn, uuid)
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
}