import { expect, Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class ManageCheckInsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Online check ins", crn, uuid);
    }
}