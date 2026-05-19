import { expect, Page } from "@playwright/test";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../Contacts/contact.page";
import { MpopArrangeAppointment } from "../../../../util/ArrangeAppointment";
import TextConfirmationPage from "./text-confirmation-page";

export default class CYAPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Check your answers then confirm the appointment", crn, uuid);
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

  async checkPageFuture(
    details: MpopArrangeAppointment,
    multipleSentences: boolean = false,
  ) {
    if (multipleSentences) {
      await this.checkSentenceType(details.sentence);
    }
    await this.checkType(details.type);
    if (details.isVisor) {
      await this.checkVisor(details.isVisor);
    }
    //this.checkAttending(details.attendee)
    await this.checkLocation(details.location);
    //this.checkDateTIme(details.dateTime)
    await this.checkMessage(details.text, details.mobile);
    await this.checkNotes(details.note);
    await this.checkSensitivity(details.sensitivity);
  }

  async checkPagePast(
    details: MpopArrangeAppointment,
    multipleSentences: boolean = false,
  ) {
    if (multipleSentences) {
      await this.checkSentenceType(details.sentence);
    }
    await this.checkType(details.type);
    if (details.isVisor) {
      await this.checkVisor(details.isVisor);
    }
    //this.checkAttending(details.attendee)
    await this.checkLocation(details.location);
    //this.checkDateTIme(details.dateTime)
    await this.checkNotes(details.note);
    await this.checkSensitivity(details.sensitivity);
  }

  async completePage(isVisor: boolean = false, past: boolean = false) {
    const rows = [
      "Appointment for",
      "Appointment type",
      ...(isVisor ? ["VISOR report"] : []),
      "Attending",
      "Location",
      "Date and time",
      ...(past ? ["Attended and complied"] : ["Text message confirmation"]),
      "Supporting information",
      "Sensitivity",
    ];
    for (let i = 0; i < rows.length; i += 1) {
      await this.checkSummaryRowKey(await this.getSummaryRowByID(i), rows[i]);
    }
    await this.submit();
  }

  async clickChangeLink(id: number, isVisor?: boolean) {
    await this.clickSummaryAction(id);
    const pages = [
      SentencePage,
      TypeAttendancePage,
      ...(isVisor != undefined ? [TypeAttendancePage] : []),
      AttendancePage,
      LocationDateTimePage,
      LocationDateTimePage,
      TextConfirmationPage,
      SupportingInformationPage,
      SupportingInformationPage,
    ];
    const page = new pages[id](this.page);
    return page;
  }
}
