import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class ReschedulePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Reschedule an appointment", crn, uuid);
  }

  async completePage(
    who: number,
    note: string,
    sensitivity: string,
    sensitivitySet: boolean = false,
  ) {
    await this.clickRadioById("whoNeedsToReschedule", who);
    await this.fillText("reason", note);
    if (!sensitivitySet) {
      await this.clickRadioByName("sensitiveInformation", sensitivity);
    }
    await this.submit();
  }
}
