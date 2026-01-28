import { Page } from "@playwright/test";
import MPopPage from "../Page";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string

    protected constructor(page: Page, title?: string, crn?: string) {
        super(page, title)
        this.crn = crn
    }
}