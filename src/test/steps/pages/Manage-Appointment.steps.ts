import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { testCrn } from "../../util/Data";
import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import { testContext } from "../../features/Fixtures";
import ManageAppointmentsPage from "../../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import AddNotePage from "../../pageObjects/Case/Contacts/Appointments/add-note.page";
import HomePage from "../../pageObjects/home.page";
import LogOutcomesPage from "../../pageObjects/Case/log-outcomes.page";
import AttendedCompliedPage from "../../pageObjects/Case/Contacts/Appointments/attended-complied.page";
import UpcomingAppiointmentsPage from "../../pageObjects/upcoming.page";

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
  const home = new HomePage(page);
  await home.assertOnPage();
  await home.viewUpcoming();
  const upcomingAppointments = new UpcomingAppiointmentsPage(page);
  await upcomingAppointments.assertOnPage();
  await upcomingAppointments.selectOfficeVisit(); //office visits only until person level bug fixed
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
});

When("I navigate to first sensitive upcoming appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const home = new HomePage(page);
  await home.assertOnPage();
  await home.viewUpcoming();
  const upcomingAppointments = new UpcomingAppiointmentsPage(page);
  let id = 0;
  while (true) {
    await upcomingAppointments.assertOnPage();
    try {
      await upcomingAppointments.selectOfficeVisit(id); //office visits only until person level bug fixed
    } catch {
      await upcomingAppointments.pagination("Next");
      id = 0;
      continue;
    }
    const managePage = new ManageAppointmentsPage(page);
    await managePage.assertOnPage();
    try {
      await expect(managePage.getQA("sensitiveTag")).toBeVisible();
      break;
    } catch {
      await managePage.clickBackLink();
      id += 1;
    }
  }
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  await expect(managePage.getQA("sensitiveTag")).toBeVisible();
});

When(
  "I navigate to first non sensitive upcoming appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const home = new HomePage(page);
    await home.assertOnPage();
    await home.viewUpcoming();
    const upcomingAppointments = new UpcomingAppiointmentsPage(page);
    let id = 0;
    while (true) {
      await upcomingAppointments.assertOnPage();
      try {
        await upcomingAppointments.selectOfficeVisit(id); //office visits only until person level bug fixed
      } catch {
        await upcomingAppointments.pagination("Next");
        id = 0;
        continue;
      }
      const managePage = new ManageAppointmentsPage(page);
      await managePage.assertOnPage();
      try {
        await expect(managePage.getQA("sensitiveTag")).toHaveCount(0);
        break;
      } catch {
        await managePage.clickBackLink();
        id += 1;
      }
    }
    const managePage = new ManageAppointmentsPage(page);
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
    const home = new HomePage(page);
    await home.assertOnPage();
    await home.logMoreOutcomes();
    const logPage = new LogOutcomesPage(page);
    await logPage.assertOnPage();
    const managePage = new ManageAppointmentsPage(page);
    let id = 0;
    while (true) {
      try {
        await logPage.selectFirst(id);
      } catch {
        await logPage.pagination("Next");
        id = 0;
        continue;
      }
      await managePage.assertOnPage(); //will backLink if restricted
      const restricted = await logPage.checkOnPage();
      if (!restricted) {
        try {
          await expect(managePage.getQA("sensitiveTag")).toHaveCount(0);
          break;
        } catch {
          await managePage.clickBackLink();
          id += 1;
        }
      }
      id += 1;
    }
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
