import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class LocationNotInListPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Arrange an appointment in another location", crn, uuid)
    }
}