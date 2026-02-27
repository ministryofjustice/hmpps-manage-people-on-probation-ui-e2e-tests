import { Page } from "@playwright/test";
import CasePage from "../../casepage";
import ContactPage from "../contactpage";

export default class RiskFlagPage extends ContactPage {
    constructor(page: Page, flag?: string, crn?: string, uuid?: string) {
        super(page, flag, crn, uuid);
    }
}