import { expect, Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";

export default class SPOApprovalPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Check you've got approval before you sign", crn, uuid);
  }

  async completePage() {
    await this.page.getByRole("checkbox").check();
    await this.submit();
  }
}
