import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

export enum NextAction {
  Similar = 0,
  New = 1,
  No = 2
}

export default class NextAppointmentPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, 'Do you want to arrange the next appointment with', crn, uuid)
    }

    async completePage(id: NextAction) {
      await this.clickRadio("option", id)
      await this.submit()
    }
}