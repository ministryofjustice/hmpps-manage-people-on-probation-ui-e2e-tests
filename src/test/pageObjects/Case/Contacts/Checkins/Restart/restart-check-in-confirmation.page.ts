import { Page } from "@playwright/test";
import CheckInConfirmationPage from "../check-in-confirmation.page";

export default class RestartCheckInConfirmationPage extends CheckInConfirmationPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, true, crn, uuid);
  }
}
