import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";

export default class ContactPreferencePage extends ContactPage {
  constructor(
    page: Page,
    restart: boolean = false,
    crn?: string,
    uuid?: string,
  ) {
    super(page, restart ? "Contact details" : "Contact preferences", crn, uuid);
  }

  async completePage(preference: string) {
    await this.clickRadioByName("checkInPreferredComs", preference);
    await this.getQA("submitBtn").click();
  }

  async navigateToUpdateContactDetails(type: string) {
    const row = await this.getSummaryRowByKey(type);
    const link = row.getByRole("button", { name: "Change" });
    await link.click();
  }
}
