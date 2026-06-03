import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export enum NextAction {
  Similar = 0,
  New = 1,
  No = 2,
}

export default class NextAppointmentPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "next supervision appointment", crn, uuid);
  }

  async completePage(id: NextAction) {
    await this.clickRadioById("anotherAppointment", id);
    await this.submit();
  }
}
