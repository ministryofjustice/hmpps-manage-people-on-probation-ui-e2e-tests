import {expect, Locator, Page} from "@playwright/test";
import CasePage from "../../casepage";

export default class ContactPage extends CasePage {
    readonly uuid?: string

    constructor(page: Page, title?: string | RegExp, crn?: string, uuid?: string) {
        super(page, title, crn)
        this.uuid = uuid
    }

    async returnToPoPsOverviewButtonExist(){
        await this.getQA("submit-btn").isVisible();
    }

    async selectPoPsOverviewButton() {
        await this.submit();
    }



    async contactDetails(): Promise<void> {
        await expect(this.createContactButton).toBeVisible({ timeout: 10000 });
        await expect(this.createContactButton).toBeEnabled();
    }


    private get createContactButton(): Locator {
        return this.page.getByRole("button", { name: /create contact/i });
    }
}
