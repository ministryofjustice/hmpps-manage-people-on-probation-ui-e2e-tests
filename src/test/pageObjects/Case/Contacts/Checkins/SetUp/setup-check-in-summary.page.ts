import { Page } from "@playwright/test";
import CheckInSummaryPage from "../check-in-summary.page";

export default class SetupCheckInSummaryPage extends CheckInSummaryPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, false, crn, uuid);
  }
}
