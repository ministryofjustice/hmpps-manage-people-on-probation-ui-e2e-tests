import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class AttendedCompliedPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "attended and complied", crn, uuid);
  }

  async completePage() {
    await this.page.getByRole("checkbox").check();
    await this.submit();
  }
}

export class NewAttendedCompliedPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "What was the outcome of this appointment?", crn, uuid);
  }
  async completePage() {
    const radioButton = this.page.getByRole("radio", {
      name: "Attended - complied",
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }
}
