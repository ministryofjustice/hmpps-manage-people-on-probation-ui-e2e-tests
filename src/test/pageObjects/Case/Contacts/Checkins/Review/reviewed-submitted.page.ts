import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class ReviewedSubmittedPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check in submitted and reviewed", crn, uuid);
    }
}

