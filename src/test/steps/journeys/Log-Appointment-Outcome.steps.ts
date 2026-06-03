import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import {
  appointmentDataTable,
  createAnotherAppointmentMPop,
  createAppointmentMPop,
  createSimilarAppointmentMPop,
  fullDetailsFromChanges,
  MpopAppointmentChanges,
  MpopArrangeAppointment,
  rescheduleAppointmentMPop,
  rescheduleDataTable,
  RescheduleDetails,
  setupAppointmentMPop,
} from "../../util/ArrangeAppointment";
import OverviewPage from "../../pageObjects/Case/overview.page";
import LogOutcomesPage from "../../pageObjects/Case/log-outcomes.page";

import { testContext } from "../../features/Fixtures";
import LocationNotInListPage from "../../pageObjects/Case/Contacts/Appointments/location-not-in-list.page";
import ConfirmationPage from "../../pageObjects/Case/Contacts/Appointments/confirmation.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import ManageAppointmentsPage from "../../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import { getClientToken } from "../../util/API";
import { DateTime } from "luxon";
import { today } from "../../util/DateTime";
import { checkOutlook } from "../../util/Outlook";
import CYAPage from "../../pageObjects/Case/Contacts/Appointments/CYA.page";
import RemindersPage from "../../pageObjects/Reminders/reminders";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import LogOutcomesPage from "../../pageObjects/log-outcomes.page";

const { Given, When, Then } = createBdd(testContext);

Given("I navigate to appointment page", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.useSubNavigation("appointmentsTab");
  const logOutcomePage = new LogOutcomesPage(ctx.base.page);
  await logOutcomePage.assertOnPage();
});

When(
  "I select the option {string} and continue",
  async ({ ctx }, option: string) => {
    const outcomePage = new LogOutcomesPage(ctx.base.page);

    switch (option) {
      case "Attended - complied":
        await outcomePage.selectAttendedComplied();
        break;

      case "Attended - failed to comply":
        await outcomePage.selectAttendedFailedToComply();
        break;

      case "Unacceptable absence":
        await outcomePage.selectUnacceptableAbsence();
        break;

      case "Failed to attend":
        await outcomePage.selectFailedToAttend();
        break;

      default:
        throw new Error(`Unknown outcome option: ${option}`);
    }

    await outcomePage.submit();
  },
);
