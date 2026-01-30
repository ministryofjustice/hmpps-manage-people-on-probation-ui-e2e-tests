import { expect, Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class NotePage extends ContactPage {
    readonly noteId?: string

    constructor(page: Page, crn?: string, uuid?: string, noteId?: string) {
        super(page, "", crn, uuid)
        this.noteId = noteId
    }

    async checkOnPage(){
        expect(this.getQA("appointmentType")).toBeDefined()
        expect(this.getQA("appointmentTitle")).toBeDefined()
    }
}