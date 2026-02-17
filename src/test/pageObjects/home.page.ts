import { Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";

export default class HomePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage people on probation")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/`)
    }

    async logMoreOutcomes(){
        await this.getQA('homepage-outcomes').getByRole('link', {name: "Log more outcomes"}).click()
    }
    
}