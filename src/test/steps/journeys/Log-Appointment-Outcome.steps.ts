import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import { testContext } from "../../features/Fixtures";
import LocationNotInListPage from "../../pageObjects/Case/Contacts/Appointments/location-not-in-list.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import ManageAppointmentsPage from "../../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import LogOutcomesPage from "../../pageObjects/Case/log-outcomes.page";

const { Given, When, Then } = createBdd(testContext);

Given("I navigate to appointment page", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.useSubNavigation("appointmentsTab");
  const logOutcomePage = new LogOutcomesPage(ctx.base.page);
  await logOutcomePage.assertOnPage();
});

Then(
  "I can see the following outcome options:",
  async ({ ctx }, dataTable: string[][]) => {
    const expectedOptions = dataTable.map((row) => row[0]);
    await new LogOutcomesPage(ctx.base.page).verifyOptions(expectedOptions);
  },
);

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
//
// Then("I am navigated to the {string} page", async function (nextPage: string) {
//   const pageMap: Record<string, () => Promise<void>> = {
//     "Add a note": async () => {
//       await this.addNotePage.assertOnPage();
//     },
//     "Enforcement action": async () => {
//       await this.enforcementActionPage.assertOnPage();
//     },
//     "Unacceptable absence": async () => {
//       await this.unacceptableAbsencePage.assertOnPage();
//     },
//     "Failed to attend": async () => {
//       await this.failedToAttendPage.assertOnPage();
//     },
//   };
//   const handler = pageMap[nextPage];
//   if (!handler) {
//     throw new Error(`Unknown next page: ${nextPage}`);
//   }
//   await handler();
// });
