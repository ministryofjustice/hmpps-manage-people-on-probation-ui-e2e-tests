import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { YesNoCheck } from "../../../../../utilities/ReviewCheckins";

export default class ReviewIdentityPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check in submitted", crn, uuid);
    }

    async completePage(id: YesNoCheck) {
        await this.clickRadio("confirmIdentity", id)
        await this.submit()
    }
}