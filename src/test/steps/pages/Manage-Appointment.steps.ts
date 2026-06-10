import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { testCrn } from "../../util/Data";
import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import { testContext } from "../../features/Fixtures";
import ManageAppointmentsPage from "../../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import AddNotePage from "../../pageObjects/Case/Contacts/Appointments/add-note.page";
import HomePage from "../../pageObjects/home.page";
import LogOutcomesPage from "../../pageObjects/log-outcomes.page";
import AttendedCompliedPage from "../../pageObjects/Case/Contacts/Appointments/attended-complied.page";
import UpcomingAppointmentsPage from "../../pageObjects/upcoming.page";
import { searchForAppointment } from "../../util/Appointments";

const { When, Then } = createBdd(testContext);

When("I navigate to latest past appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const appointments: AppointmentsPage = new AppointmentsPage(page, testCrn);
  await appointments.navigateTo();
  await appointments.assertOnPage();
  await appointments.selectPastAppointment(1);
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
});

When("I navigate to first upcoming appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const upcomingAppointments = new UpcomingAppointmentsPage(page);
  const managePage = new ManageAppointmentsPage(page);
  await searchForAppointment(
    upcomingAppointments,
    managePage,
    "Planned office",
  );
  await managePage.assertOnPage();
});

When("I navigate to last upcoming appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const upcomingAppointments = new UpcomingAppointmentsPage(page);
  const managePage = new ManageAppointmentsPage(page);
  await upcomingAppointments.page
    .getByRole("button", { name: "Date and time" })
    .click();
  await searchForAppointment(
    upcomingAppointments,
    managePage,
    "Planned office",
  );
  await managePage.assertOnPage();
});

When("I navigate to the upcoming appointments page", async ({ ctx }) => {
  const page = ctx.base.page;
  const home = new HomePage(page);
  await home.assertOnPage();
  await home.viewUpcoming();
  const upcomingAppointments = new UpcomingAppointmentsPage(page);
  await upcomingAppointments.assertOnPage();
});

When("I navigate to the log outcomes page", async ({ ctx }) => {
  const page = ctx.base.page;
  const home = new HomePage(page);
  await home.assertOnPage();
  await home.logMoreOutcomes();
  const logPage = new LogOutcomesPage(page);
  await logPage.assertOnPage();
});

When("I navigate to first sensitive upcoming appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const upcomingAppointments = new UpcomingAppointmentsPage(page);
  const managePage = new ManageAppointmentsPage(page);
  await searchForAppointment(
    upcomingAppointments,
    managePage,
    "Planned office",
    true,
  );
  await managePage.assertOnPage();
  await expect(managePage.getQA("sensitiveTag")).toBeVisible();
});

When(
  "I navigate to first non sensitive upcoming appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const upcomingAppointments = new UpcomingAppointmentsPage(page);
    const managePage = new ManageAppointmentsPage(page);
    await searchForAppointment(
      upcomingAppointments,
      managePage,
      "Planned office",
      false,
    );
    await managePage.assertOnPage();
    await expect(managePage.getQA("sensitiveTag")).toHaveCount(0);
  },
);

When("I note the current number of notes", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  const noteCount = await managePage.getNoteCount();
  ctx.manage.noteCount = noteCount;
});

When("I navigate to the add a note page", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.clickAddNotesLink();
  const addNotePage = new AddNotePage(page);
  await addNotePage.assertOnPage();
});

Then("I can see the appointment marked as sensitive", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  await expect(managePage.getQA("sensitiveTag")).toBeVisible();
});

Then("I can see the new note on the appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  expect(await managePage.getNoteCount()).toBe(ctx.manage.noteCount + 1);
  await expect((await managePage.getAppointmentNotes()).first()).toContainText(
    ctx.manage.note.substring(0, 100), //just check the start of the note as it can be truncated on the UI
  );
});

When(
  "I navigate to latest non sensitive appointment requiring an outcome",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const logPage = new LogOutcomesPage(page);
    const managePage = new ManageAppointmentsPage(page);
    await searchForAppointment(logPage, managePage, /^Manage$/, false);
    await expect(managePage.getQA("appointmentAlert")).toContainText(
      "You must log an outcome",
    );
  },
);

When("I navigate to the appointment outcome page", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.clickAttendedAndCompliedLink();
  const attendedCompliedPage = new AttendedCompliedPage(page);
  await attendedCompliedPage.assertOnPage();
});

Then("I can see the attended and complied status", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  await expect(
    managePage.getByID("appointment-actions-1-status"),
  ).toContainText("Complied");
});
