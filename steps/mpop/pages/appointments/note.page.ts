import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class NotePage extends MPopPage {
    constructor(page: Page) {
        super(page, "")
    }

    async checkOnPage(){
        expect(this.getQA("appointmentType")).toBeDefined()
        expect(this.getQA("appointmentTitle")).toBeDefined()
    }
}