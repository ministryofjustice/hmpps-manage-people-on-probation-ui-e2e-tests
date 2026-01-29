import { Page } from "@playwright/test";
import CasePage from "../casepage";

export default abstract class ContactPage extends CasePage {
    readonly uuid?: string

    protected constructor(page: Page, title?: string, crn?: string, uuid?: string) {
        super(page, title)
        this.uuid = uuid
    }

    async returnToPoPsOverviewButtonExist(){
        await this.getQA("submit-btn").isVisible();
    }
    
    async selectPoPsOverviewButton() {
        await this.submit();
    }
}