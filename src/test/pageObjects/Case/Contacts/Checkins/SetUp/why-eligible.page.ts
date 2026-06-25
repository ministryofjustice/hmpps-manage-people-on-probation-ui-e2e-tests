import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";

export default class WhyEligiblePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /Why is [^\s]+ suitable to use online check ins?/, crn, uuid);
  }

  async checkOnPage(): Promise<boolean> {
    try {
      await this.checkQA("rationale-for-check-ins", this.title ?? "");
      return true;
    } catch {
      return false;
    }
  }

  async completePage() {
    await this.fillText("rationale-for-check-ins", "just is");
    await this.submit();
  }
}
