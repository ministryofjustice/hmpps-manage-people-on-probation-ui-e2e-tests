import { Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class AddNotePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Add a note", crn, uuid);
  }

  async changePage(
    note?: string,
    sensitivity?: string,
    file?: string,
    sensitivitySet: boolean = false,
  ) {
    if (note) {
      await this.fillText("notes", note);
    }
    if (file) {
      console.log("not yet implemented"); //file
    }
    if (sensitivity != undefined && !sensitivitySet) {
      await this.clickRadioByName("sensitiveInformation", sensitivity);
    }
    await this.submit();
  }

  async completePage(
    note: string,
    sensitivity: string,
    file?: string,
    sensitivitySet: boolean = false,
  ) {
    await this.changePage(note, sensitivity, file, sensitivitySet);
  }
}
