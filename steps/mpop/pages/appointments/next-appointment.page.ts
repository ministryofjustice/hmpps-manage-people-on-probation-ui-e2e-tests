import { expect, Page } from "@playwright/test";
import MPopPage from "../page";

export default class NextAppointmentPage extends MPopPage {
    constructor(page: Page) {
        super(page, 'Do you want to arrange the next appointment with')
    }

    async completePage(id: number) {
      await this.clickRadio("option", id)
      await this.submit()
    }
}