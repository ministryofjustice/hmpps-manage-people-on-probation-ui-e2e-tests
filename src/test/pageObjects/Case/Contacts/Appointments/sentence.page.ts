import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class SentencePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, 'What is this appointment for?', crn, uuid)
    }

    async completePage(id: number | "person") {
        if (id === "person"){
            const options = await this.getQA("sentences").getByRole('radio').count()
            await this.clickRadio("sentences", options-1)
        } else {
            await this.clickRadio("sentences", id)
        }
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