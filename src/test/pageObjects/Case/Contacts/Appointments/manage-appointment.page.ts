import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";
import { MPOP_URL } from "../../../../util/Data";
import { MpopDateTime } from "../../../../util/DateTime";
import { DateTime } from "luxon";

export enum ManageAction {
  AttendedComplied = 0,
  Notes = 1,
  Next = 2,
}

export class ManageAppointmentsPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Manage", crn, uuid);
  }

  async goTo(crn?: string, contactId?: string) {
    await this.page.goto(
      `${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/appointment/${(contactId ?? this.uuid)!}/manage`,
    );
  }

  async clickNdeliusLink() {
    await this.clickLink(
      "use NDelius to log non-attendance or non-compliance (opens in new tab)",
    );
  }

  async clickLogAppointmentOutcomeLink() {
    await this.clickLink("Log appointment outcome");
  }

  async clickNewAttendedAndCompliedLink() {
    await this.clickLink("Log appointment outcome");
  }

  async clickAttendedAndCompliedLink() {
    await this.clickLink("Log attended and complied appointment");
  }

  async clickAddNotesLink() {
    await this.clickLink("Add appointment notes");
  }

  async clickNextAppointmentLink() {
    await this.clickLink("Arrange next appointment");
  }

  async checkActionLink(id: ManageAction, value: string) {
    await expect(
      this.getQA("appointmentActions")
        .getByRole("listitem")
        .nth(id)
        .getByRole("link"),
    ).toHaveText(value);
  }

  async getAppointmentNotes() {
    return this.getClass(
      "app-note",
      await this.getSummaryRowValue(
        await this.getSummaryRowByKey("Appointment notes"),
      ),
    );
  }

  async getDateTimeOfAppointment(): Promise<MpopDateTime> {
    const text = await this.page
      .locator("dt", { hasText: "Date and time" })
      .locator("xpath=following-sibling::dd[1]")
      .textContent();

    if (!text) throw new Error("Date and time not found");

    const match = text.trim().match(/(.+?) at (.+?) to (.+)/);

    if (!match) throw new Error(`Unexpected format: ${text}`);

    const [, datePart, startPart, endPart] = match;

    const dateTime: MpopDateTime = {
      date: DateTime.fromFormat(datePart, "d MMMM yyyy").toFormat("d/M/yyyy"),
      startTime: DateTime.fromFormat(startPart.toUpperCase(), "h:mma").toFormat(
        "HH:mm",
      ),
      endTime: DateTime.fromFormat(endPart.toUpperCase(), "h:mma").toFormat(
        "HH:mm",
      ),
    };

    return dateTime;
  }

  async checkSensitive(sensitve: boolean) {
    if (sensitve) {
      await expect(this.getQA("sensitiveTag")).toHaveCount(1);
    } else {
      await expect(this.getQA("sensitiveTag")).toHaveCount(0);
    }
  }

  async getNoteCount() {
    return await (await this.getAppointmentNotes()).count();
  }

  async getContactId(): Promise<string> {
    return this.page.url().split("/appointment/")[1].split("/")[0];
  }

  async getAppointmentType(): Promise<string> {
    const heading = await this.page
      .locator('[data-qa="pageHeading"]')
      .textContent();

    if (!heading) {
      throw new Error("Page heading not found");
    }

    const appointmentType = heading
      .replace(/^Manage\s+/i, "")
      .replace(/\s+with\s+.*$/i, "")
      .replace(/^./, (c) => c.toUpperCase());

    return appointmentType;
  }
}
