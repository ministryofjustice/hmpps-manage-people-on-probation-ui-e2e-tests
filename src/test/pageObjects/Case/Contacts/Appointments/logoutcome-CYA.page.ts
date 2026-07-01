import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class CheckYourAnswersPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Check your answers then confirm the appointment", crn, uuid);
  }

  async completePage() {
    //await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(3000);
    await this.getQA("submit-btn").click();
  }
}
