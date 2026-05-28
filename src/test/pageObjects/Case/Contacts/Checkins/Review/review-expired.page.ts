import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";

export default class ReviewExpiredPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Online check in missed", crn, uuid);
  }

  async completePage(note: string, sensitivity: string) {
    await this.fillText("notes", note);
    await this.clickRadioByName("sensitiveContact", sensitivity);
    await this.submit();
  }
}
