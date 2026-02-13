import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { YesNoCheck } from "../../../../../util/ReviewCheckins";

export default class ReviewNotesPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check in submitted", crn, uuid);
    }

    async completePage(note?: string, id?: YesNoCheck) {
        if (note){
            await this.fillText('notes', note)
        }
        if (id) {
            await this.clickRadio("riskManagement", id)
        }        
        await this.submit()
    }
}