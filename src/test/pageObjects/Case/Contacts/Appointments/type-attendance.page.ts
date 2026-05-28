import { Page } from "@playwright/test";
import SentencePage from "./sentence.page";
import ContactPage from "../Contacts/contact.page";

export default class TypeAttendancePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Appointment type and attendance", crn, uuid);
  }

  async completePage(type: string, isVisor?: string) {
    await this.changePage(type, isVisor);
  }
  async changePage(type?: string, isVisor?: string) {
    if (type != undefined) {
      await this.clickRadioByName("type", type);
    }
    if (isVisor != undefined) {
      await this.clickRadioByName("visorReport", isVisor);
    }
    await this.submit();
  }

  async testBacklink(change: boolean) {
    await this.clickBackLink();
    if (change) {
      //change case
    } else {
      const sentencePage = new SentencePage(this.page);
      sentencePage.submit();
    }
    await this.assertOnPage();
  }
}
