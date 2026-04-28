import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import { REMINDERS_URL } from "../../util/Data";
import { MpopArrangeAppointment } from "../../util/ArrangeAppointment";
import { Person } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";

export default class RemindersPage extends MPopPage {
  constructor(page: Page) {
    super(page, "Manage people on probation");
  }

  private formatDateForSMS(dateStr: string): string {
    const [day, month, year] = dateStr.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  private formatTimeForSMS(time24: string): string {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = Number(hourStr);
    const minute = minuteStr.padStart(2, "0"); // ensure 2 digits

    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    if (hour === 0) hour = 12; // midnight or noon

    return `${hour}:${minute}${ampm}`;
  }

  async checkOnPage(): Promise<boolean> {
    return await this.page
      .getByRole("heading", { name: "Sent reminders" })
      .isVisible();
  }

  async goTo() {
    await this.page.goto(`${REMINDERS_URL}/`);
  }

  async checkForMessage(appointment: MpopArrangeAppointment, person: Person) {
    const message = `[DEV]Dear ${person.firstName}, You have an appointment at`;
    const message2 = `on ${this.formatDateForSMS(appointment.dateTime.date)} at ${this.formatTimeForSMS(appointment.dateTime.startTime)}. This is an automated message. Do not reply.`;
    await expect(this.getQA("reminders-table")).toContainText(message);
    await expect(this.getQA("reminders-table")).toContainText(message2);
  }
}
