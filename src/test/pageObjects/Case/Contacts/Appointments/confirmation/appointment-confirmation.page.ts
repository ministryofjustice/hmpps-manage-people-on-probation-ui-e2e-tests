import { Page } from "@playwright/test";
import ConfirmationPage from "./confirmation.page";

export default class AppointmentConfirmationPage extends ConfirmationPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Appointment arranged", crn, uuid);
  }
}
