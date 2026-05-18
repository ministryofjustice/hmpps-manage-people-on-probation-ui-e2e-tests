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

  async completePage(stop: boolean = true, reason?: string) {
    await this.clickRadioById("stopCheckIn", stop ? 0 : 1);
    if (stop) {
      await this.fillText("stop-checkin-reason", reason!);
    }
    await this.submit();
  }
}
