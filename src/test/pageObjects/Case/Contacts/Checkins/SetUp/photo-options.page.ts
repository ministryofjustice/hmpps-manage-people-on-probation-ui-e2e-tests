import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";
import { MPOP_URL } from "../../../../../util/Data";

export default class PhotoOptionsPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Take a photo of", crn, uuid);
  }

  async goTo(crn?: string, uuid?: string) {
    await this.page.goto(
      `${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/photo-options/`,
    );
  }

  async completePage(option: string) {
    await this.clickRadioByName("uploadOptions", option);
    await this.submit();
  }
}
