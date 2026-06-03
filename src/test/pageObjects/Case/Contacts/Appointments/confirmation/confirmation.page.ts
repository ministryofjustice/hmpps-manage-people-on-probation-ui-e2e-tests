import { Page } from "@playwright/test";
import NextAppointmentPage from "../next-appointment.page";
import ContactPage from "../../Contacts/contact.page";

export default class ConfirmationPage extends ContactPage {
  constructor(page: Page, title?: string, crn?: string, uuid?: string) {
    super(page, title, crn, uuid);
  }

  async completePage(option: string) {
    if (option === "createAnother") {
      await this.clickLink("arrange another appointment");
      return new NextAppointmentPage(this.page);
    } else if (option === "returnToAll") {
      await this.clickLink("Return to all cases");
    } else if (option === "overview") {
      await this.submit();
    }
  }
}
