import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";
import { DataTable } from "playwright-bdd";

export default class EligibilityPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(
      page,
      /Check if [^\s]+ is eligible to use online check ins/,
      crn,
      uuid,
    );
  }

  async completePage(data: DataTable) {
    for (const row of data.rows()) {
      const text = row[0];
      await this.page.getByRole("checkbox", { name: text }).check();
    }
    await this.submit();
  }

  async completePageWithIDs(ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      await this.page.getByRole("checkbox").nth(id).check();
    }
    await this.submit();
  }
}
