import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export default class TextConfirmationPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Text message confirmation", crn, uuid);
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

  async confirmPreview(date: string, startTime: string) {
    // Format date and time for SMS validation
    const formattedDate = date ? this.formatDateForSMS(date) : undefined;
    const formattedStartTime = startTime
      ? this.formatTimeForSMS(startTime)
      : undefined;
    const smsPreview = await this.page
      .locator("div.sms-message-wrapper")
      .innerText();
    expect(smsPreview).toContain(formattedDate);
    expect(smsPreview).toContain(formattedStartTime);
  }

  async completePage(option: string) {
    await this.clickRadioByName("smsOptIn", option);
    await this.submit();
  }
}
