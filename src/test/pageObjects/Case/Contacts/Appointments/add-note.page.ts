import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../contactpage";
import { MpopDateTime } from "../../../../util/DateTime";
import TextConfirmationPage from "./text-confirmation-page";

export default class AddNotePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Add a note", crn, uuid)
    }

    async completePage(sensitivity: boolean, note?: string, file?: string) {
        if (note){
            await this.fillText("notes", note)
        }
        //file
        await this.clickRadio("sensitiveInformation", sensitivity ? 0 : 1)
        await this.submit()
    }
}