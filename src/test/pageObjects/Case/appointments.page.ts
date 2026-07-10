import { expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import { caseNavigation } from "../../util/Navigation";
import CasePage from "./casepage";
import { MpopArrangeAppointment } from "../../util/ArrangeAppointment";
import { DateTime } from "luxon";
import { mpopTime } from "../../util/DateTime";
import UpcomingAppointmentsPage from "../upcoming.page";

dotenv.config({ path: ".env" });
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL;

export default class AppointmentsPage extends CasePage {
  constructor(page: Page, crn?: string) {
    super(page, "Appointments", crn);
  }

  async goTo(crn?: string) {
    await this.page.goto(
      `${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/`,
    );
  }

  async getNewestAppointment() {
    try {
      await this.clickLink("View all upcoming appointments.");
      const upcomingAppointment = new UpcomingAppointmentsPage(this.page);
      await upcomingAppointment.assertOnPage();
      //sort descending
      await upcomingAppointment.page
        .getByRole("button", { name: "Date" })
        .click();
      await upcomingAppointment.page
        .getByRole("button", { name: "Date" })
        .click();
      await this.getQA("upcomingAppointments")
        .getByRole("link", { name: /Manage/ })
        .first()
        .click();
    } catch {
      await this.getQA("upcomingAppointmentsSection")
        .getByRole("link", { name: /Manage/ })
        .last()
        .click();
    }
  }

  async checkOnPage(): Promise<boolean> {
    try {
      await this.checkQA("appointments-header-label", "Appointments");
      return true;
    } catch {
      return false;
    }
  }

  async startArrangeAppointment() {
    await this.getQA("arrange-appointment-btn").click();
  }

  async viewUpcomingAppointments() {
    await this.clickLink("View all upcoming appointments");
  }

  async viewPastAppointments() {
    await this.clickLink("View all past appointments in the contacts page");
  }

  async selectPastAppointment(id: number) {
    await this.selectAppointment(false, id, true);
  }

  async selectFutureAppointment(id: number) {
    await this.selectAppointment(true, id, true);
  }

  async selectAppointment(
    upcoming: boolean,
    id: number,
    byName: boolean = false,
  ) {
    const tableqa = upcoming
      ? "upcomingAppointmentsSection"
      : "pastAppointmentsSection";
    const table = upcoming ? "upcoming" : "past";
    const column = byName ? "Type" : "Action";
    const cellqa = `${table}Appointment${column}${id}`;
    await this.clickTableLink(tableqa, cellqa);
  }

  async navigateTo(crn?: string) {
    await caseNavigation(this.page, (crn ?? this.crn)!, "appointmentsTab");
  }

  async checkSetupCheckIns() {
    await this.checkQA("online-checkin-btn", "Set up online check ins");
  }

  async clickSetupOnlineCheckInsBtn() {
    const btn = this.getQA("online-checkin-btn");
    await expect(btn).toBeVisible(); // ensure visible
    await btn.click();
  }

  async clickManageOnlineCheckInsBtn() {
    const btn = this.getQA("online-manage-btn");
    await expect(btn).toBeVisible(); // ensure visible
    await btn.click();
  }

  async manageAppointment(appointment: MpopArrangeAppointment) {
    const dateTime = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy");
    const date = dateTime.toFormat("d MMMM yyyy");
    const time = mpopTime(
      appointment.dateTime.startTime,
      appointment.dateTime.endTime,
    );

    const row = this.getClass("govuk-table__row")
      .filter({ hasText: new RegExp(" " + date) })
      .filter({ hasText: new RegExp(" " + time) })
      .filter({ hasText: appointment.appointmentType });

    try {
      await row.getByRole("link", { name: "Manage" }).click();
    } catch {
      await row.getByRole("link", { name: "Manage" }).first().click();
      console.warn("Multiple matches found, clicked first");
    }
  }

  async waitForAppointmentInPastAppointments(
    appointment: MpopArrangeAppointment,
    timeout = 80_000,
    interval = 10_000,
  ) {
    const dateTime = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy");
    const date = dateTime.toFormat("d MMMM yyyy");
    const time = mpopTime(
      appointment.dateTime.startTime,
      appointment.dateTime.endTime,
    );

    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      await this.page.reload();

      const section = this.page.locator('[data-qa="pastAppointmentsSection"]');
      console.log(
        "Past appointment section before filter row count:",
        await section.count(),
      );

      const row = section
        .locator(".govuk-table__row")
        .filter({ hasText: new RegExp(` ${date}`) })
        .filter({ hasText: new RegExp(` ${time}`) })
        .filter({ hasText: appointment.appointmentType });

      console.log(
        "Past appointment section after filter row count::",
        await row.count(),
      );

      if (await row.getByRole("link", { name: "Manage" }).first().isVisible()) {
        return;
      }

      await this.page.waitForTimeout(interval);
    }

    throw new Error(
      `Appointment did not appear in Past appointments within ${timeout / 1000} seconds.`,
    );
  }
}
