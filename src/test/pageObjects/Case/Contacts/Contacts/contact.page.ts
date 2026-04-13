import {expect, Locator, Page} from "@playwright/test";
import CasePage from "../../casepage";
import {AddContactDetails} from "./add-contact.page";

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


    private get createContactButton(): Locator {
        return this.getQA("create-contact-button")
    }

    async contactDetails(): Promise<void> {
        await expect(this.createContactButton).toBeVisible({ timeout: 10000 });
        await expect(this.createContactButton).toBeEnabled();
    }

    async saveContactDetails(): Promise<void> {
        await expect(this.createContactButton).toBeVisible({ timeout: 10000 });
        await expect(this.createContactButton).toBeEnabled();
        await this.createContactButton.scrollIntoViewIfNeeded();
        await this.createContactButton.click();
        if(await this.createContactButton.isVisible()){
            await this.createContactButton.click();
        }
    }
    // async contactDetails(): Promise<void> {
    //     await this.page.waitForLoadState('networkidle');
    //     const createContact = this.getQA("create-contact-button")
    //     await this.page.waitForSelector('button[data-qa="create-contact-button"]');
    //
    //     await expect(createContact).toBeVisible();
    //     await expect(createContact).toBeEnabled();
    // }
    //
    // async saveContactDetails(): Promise<void> {
    //     await this.page.waitForLoadState('networkidle');
    //     const createContact = this.page.getByRole('button', {name: /^\s*Create contact\s*$/});
    //     await createContact.click();
    // }

}
