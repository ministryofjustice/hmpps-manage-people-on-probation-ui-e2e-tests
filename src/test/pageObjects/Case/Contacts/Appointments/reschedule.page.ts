import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export default class ReschedulePage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, 'Reschedule an appointment', crn, uuid)
    }

    async completePage(who: number, note: string, sensitivity: boolean) {
        await this.clickRadio("whoNeedsToReschedule", who)
        await this.fillText("reason", note)
        await this.clickRadio("sensitiveInformation", sensitivity ? 0 : 1)
        await this.submit()
    }
}