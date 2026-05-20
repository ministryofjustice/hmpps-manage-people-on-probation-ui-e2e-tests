import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";

export default class EligiblePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /[^\s]+ is eligible to use online check ins/, crn, uuid);
  }

  async completePage(use?: string) {
    if (use) await this.clickRadioByName("eligibility-options", use);
    await this.submit();
  }
}
