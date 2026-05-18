import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class SentencePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "What is this appointment for?", crn, uuid);
  }

  async completePage(option: string) {
    await this.clickRadioByName("sentences", option);
    await this.submit();
  }

  async testBacklink(previousPage: string) {
    await this.clickBackLink();
    if (previousPage === "Next") {
      //setNextPage
    } else {
      //createAppointmentsPage and click link page to here
    }
    await this.assertOnPage();
  }
}
