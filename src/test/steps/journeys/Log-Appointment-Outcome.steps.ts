import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";

import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import LogOutcomesPage from "../../pageObjects/Case/log-outcomes.page";

import { testContext } from "../../features/Fixtures";

const { Given, When, Then } = createBdd(testContext);

Then('I am on the "Outcome" page', async ({ ctx }) => {
  const outcomePage = new LogOutcomesPage(ctx.base.page);

  await outcomePage.assertOnPage();

  // validates all radios exist
  await outcomePage.outcomeRadioButtonsExist();
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
