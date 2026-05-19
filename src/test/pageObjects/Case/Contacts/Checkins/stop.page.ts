import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class StopCheckInsPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(
      page,
      "Are you sure you want to stop online check ins for",
      crn,
      uuid,
    );
  }

  async completePage(sensitivity: string, reason?: string) {
    await this.fillText("stop-checkin-reason", reason!);
    await this.clickRadioByName("sensitiveContact", sensitivity);
    await this.submit();
  }
}
