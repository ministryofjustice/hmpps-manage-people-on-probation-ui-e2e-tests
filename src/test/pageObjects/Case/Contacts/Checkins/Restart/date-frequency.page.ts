import { Page } from "@playwright/test";
import DateFrequencyPage from "../date-frequency.page";

export default class RestartDateFrequencyPage extends DateFrequencyPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, true, crn, uuid);
  }
}
