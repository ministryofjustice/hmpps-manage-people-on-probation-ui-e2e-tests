import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";

export default class EligibilityPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, /Check if [^\s]+ is eligible to use online check ins/, crn, uuid);
    }

    async completePage(ids: number[]) {
        for (let i=0; i<ids.length; i++){
            const id = ids[i]
            await this.page.getByRole('checkbox').nth(id).check()
        }
        await this.submit()
    }
}