import { Page } from "@playwright/test";
import CheckInSummaryPage from "../check-in-summary.page";

export default class RestartCheckInSummaryPage extends CheckInSummaryPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, true, crn, uuid);
  }
}
