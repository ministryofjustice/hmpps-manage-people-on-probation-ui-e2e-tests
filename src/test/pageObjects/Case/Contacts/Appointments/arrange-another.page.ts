import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";
import { MpopArrangeAppointment } from "../../../../util/ArrangeAppointment";

export default class ArrangeAnotherPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Arrange another appointment", crn, uuid);
  }

  async checkSentenceType(sentence: string) {
    await this.checkRow("Appointment for", sentence);
  }
  async checkType(type: string) {
    await this.checkRow("Appointment type", type);
  }
  async checkVisor(visor: string) {
    await this.checkRow("VISOR report", visor);
  }
  async checkLocation(location: string) {
    if (location === "I do not need to pick a location") {
      location = "Not required";
    }
    await this.checkRow("Location", location);
  }
  async checkMessage(message: string, mobile?: string) {
    await this.checkRow("Text message confirmation", message);
    if (mobile) {
      await this.checkRow("Text message confirmation", mobile);
    }
  }
  async checkNotes(note?: string) {
    await this.checkRow("Supporting information", note ?? "Not entered");
  }
  async checkSensitivity(sensitivity: string) {
    await this.checkRow("Sensitivity", sensitivity);
  }

  async checkRow(row: string, value: string, link: boolean = true) {
    if (link) {
      expect(
        (await this.getSummaryRowByKey(row)).getByRole("link"),
      ).toBeVisible();
    }
    expect(await this.getSummaryRowByKey(row)).toContainText(value);
  }

  async checkPageFuture(details: MpopArrangeAppointment) {
    await this.checkLocation(details.location);
    //this.checkDateTIme(details.dateTime)
    await this.checkMessage(details.text, details.mobile);
    await this.checkNotes(details.note);
    await this.checkSensitivity(details.sensitivity);
  }
}
