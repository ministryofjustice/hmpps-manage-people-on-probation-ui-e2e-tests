import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class AddNotePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Add a note", crn, uuid);
  }

  async changePage(sensitivity?: boolean, note?: string, file?: string) {
    if (note) {
      await this.fillText("notes", note);
    }
    if (file) {
      console.log("not yet implemented"); //file
    }
    if (sensitivity != undefined) {
      await this.clickRadio("sensitiveInformation", sensitivity ? 0 : 1);
    }
    await this.submit();
  }

  async completePage(sensitivity: boolean, note?: string, file?: string) {
    await this.changePage(sensitivity, note, file);
  }
}
