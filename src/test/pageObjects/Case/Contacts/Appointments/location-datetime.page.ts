import { expect, Page } from "@playwright/test";
import TypeAttendancePage from "./type-attendance.page";
import ContactPage from "../Contacts/contact.page";
import { MpopDateTime } from "../../../../util/DateTime";

export default class LocationDateTimePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Appointment date, time and location", crn, uuid);
  }

  async checkOnPage(): Promise<boolean> {
    try {
      await expect(
        this.page.locator('[data-qa="pageHeading"]').first(),
      ).toContainText(this.title!);
      return true;
    } catch {
      return false;
    }
  }

  async findLocationId(
    typeId: number,
    location: number | "not needed" | "not in list",
  ) {
    if (location !== "not needed" && location !== "not in list") {
      return location;
    } else {
      const locationNotNeeded = typeId === 1 || typeId === 5;
      const locations = await this.countRadioOptions("locationCode");
      if (locationNotNeeded) {
        if (location === "not needed") {
          return locations - 1;
        } else if (location === "not in list") {
          return locations - 2;
        }
      } else {
        if (location === "not needed") {
          console.log("Location needed so can`t select");
          return locations - 1;
        } else if (location === "not in list") {
          return locations - 1;
        }
      }
    }
  }

  async completePage(
    dateTime?: MpopDateTime,
    location?: string,
    attempt: number = 0,
  ) {
    if (dateTime != undefined) {
      await this.getClass("moj-datepicker")
        .locator('[type="text"]')
        .fill(dateTime.date);
      await this.fillText("startTime", dateTime.startTime);
      await this.fillText("endTime", dateTime.endTime);
    }
    if (location !== undefined) {
      await this.clickRadioByName("locationCode", location);
    }
    await this.submit();
    const validationFailed = await this.checkOnPage();
    if (validationFailed && attempt == 0) {
      await this.completePage(dateTime, location, 1);
    }
  }

  async completePageWithId(
    dateTime?: MpopDateTime,
    locationId?: number,
    attempt: number = 0,
  ): Promise<string> {
    if (dateTime != undefined) {
      await this.getClass("moj-datepicker")
        .locator('[type="text"]')
        .fill(dateTime.date);
      await this.fillText("startTime", dateTime.startTime);
      await this.fillText("endTime", dateTime.endTime);
    }
    let locationName = "";
    if (locationId !== undefined) {
      await this.clickRadioById("locationCode", locationId);
      locationName = await this.getQA("locationCode")
        .getByRole("radio")
        .nth(locationId)
        .innerText();
    }
    await this.submit();
    const validationFailed = await this.checkOnPage();
    if (validationFailed && attempt == 0) {
      await this.completePageWithId(dateTime, locationId, 1);
    }
    return locationName;
  }

  async testBacklink(change: boolean) {
    await this.clickBackLink();
    if (change) {
      //change case
    } else {
      const typeAttendancePage = new TypeAttendancePage(this.page);
      typeAttendancePage.submit();
    }
    await this.assertOnPage();
  }

  async fillText(qa: string, text: string) {
    await this.getQA(qa).locator('[type="text"]').fill(text);
  }

  async selectDate(date: string) {
    await this.page
      .getByRole("button")
      .filter({ hasText: "Choose date" })
      .click();
    await this.page.getByTestId(date).click();
  }
}
