import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class ReviewedExpiredPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check in missed and reviewed", crn, uuid);
    }
}

