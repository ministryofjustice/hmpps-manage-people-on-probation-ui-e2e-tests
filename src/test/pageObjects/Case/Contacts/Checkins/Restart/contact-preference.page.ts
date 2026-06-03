import { Page } from "@playwright/test";
import ContactPreferencePage from "../contact-preference.page";

export default class RestartContactPreferencePage extends ContactPreferencePage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, true, crn, uuid);
  }
}
