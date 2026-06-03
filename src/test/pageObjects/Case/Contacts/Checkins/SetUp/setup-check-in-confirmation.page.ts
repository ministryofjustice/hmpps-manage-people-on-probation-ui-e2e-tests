import { Page } from "@playwright/test";
import CheckInConfirmationPage from "../check-in-confirmation.page";

export default class SetupCheckInConfirmationPage extends CheckInConfirmationPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, false, crn, uuid);
  }
}
