import { Page } from "@playwright/test";
import LocationDateTimePage from "./location-datetime.page";
import ContactPage from "../Contacts/contact.page";

export default class SupportingInformationPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Add supporting information (optional)", crn, uuid);
  }

  async changePage(
    sensitivity?: string,
    note?: string,
    sensitvitySet: boolean = false,
  ) {
    if (note != undefined) {
      await this.fillText("notes", note);
    }
    if (sensitivity != undefined && !sensitvitySet) {
      await this.clickRadioByName("visorReport", sensitivity);
    }
    await this.submit();
  }

  async completePage(
    sensitivity?: string,
    note?: string,
    sensitvitySet: boolean = false,
  ) {
    await this.changePage(sensitivity, note, sensitvitySet);
  }

  async testBacklink(change: boolean) {
    await this.clickBackLink();
    if (change) {
      //change case
    } else {
      const locationDateTimePage = new LocationDateTimePage(this.page);
      locationDateTimePage.submit();
    }
    await this.assertOnPage();
  }
}
