import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class SentencePage extends MPopPage {
    constructor(page: Page) {
        super(page, 'What is this appointment for?')
    }

    async completePage(id: number) {
      await this.clickRadio("sentences", id)
      await this.submit()
    }

    async testBacklink(previousPage: string) {
        await this.clickBackLink()
        if (previousPage === "Next"){
            //setNextPage 
        } else {
            //createAppointmentsPage and click link page to here
        }
        await this.checkOnPage()
    }
}