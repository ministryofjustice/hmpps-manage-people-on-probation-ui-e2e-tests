import { Page } from "@playwright/test";
import ContactPage from "../../Contacts/contact.page";
import { MPOP_URL } from "../../../../../util/Data";

const DATEPICKER_QA = "input.moj-js-datepicker-input";

export default class DateFrequencyPage extends ContactPage {
  datepickerQA: string;
  constructor(
    page: Page,
    restart: boolean = false,
    crn?: string,
    uuid?: string,
  ) {
    super(
      page,
      restart ? "Online check in settings" : "Set up online check ins",
      crn,
      uuid,
    );
    this.datepickerQA = DATEPICKER_QA;
  }

  async goTo(crn?: string, uuid?: string) {
    await this.page.goto(
      `${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/date-frequency/`,
    );
  }

  async completePage(date: string, frequency: string) {
    await this.changePage(date, frequency);
  }

  async changePage(date?: string, frequency?: string) {
    if (date !== undefined) {
      await this.getClass("moj-datepicker").locator('[type="text"]').fill(date);
    }
    if (frequency !== undefined) {
      await this.clickRadioByName("checkInFrequency", frequency);
    }
    await this.submit();
  }

  async checkElementExists() {
    await this.checkQAExists(this.datepickerQA);
  }
}
