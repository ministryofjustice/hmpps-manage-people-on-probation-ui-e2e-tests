import { Page } from "@playwright/test";
import ConfirmationPage from "./confirmation.page";

export default class PastAppointmentConfirmationPage extends ConfirmationPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Past appointment arranged", crn, uuid);
  }
}
