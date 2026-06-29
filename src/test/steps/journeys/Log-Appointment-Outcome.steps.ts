import { expect } from "@playwright/test";
import { createBdd, DataTable } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import LogOutcomesPage from "../../pageObjects/Case/log-outcomes.page";
import AddNotePage from "../../pageObjects/Case/Contacts/Appointments/add-note.page";
import { NewAttendedCompliedPage } from "../../pageObjects/Case/Contacts/Appointments/attended-complied.page";
import {
  LogAppointmentOutcomePage,
  UnacceptableAbsencePage,
  FailedToAttendPage,
  InitiateARecallPage,
  SendALetterPage,
  AcceptableAbsencePage,
  InitiateABreachPage,
} from "../../pageObjects/Case/Contacts/Appointments/log-appointment-outcome.page";
import NextAppointmentPage, {
  NextAction,
} from "../../pageObjects/Case/Contacts/Appointments/next-appointment.page";
import CheckYourAnswersPage from "../../pageObjects/Case/Contacts/Appointments/logoutcome-CYA.page";

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
  async ({ ctx }, dataTable: DataTable) => {
    const expectedOptions = dataTable.rows().map((row) => row[0]);
    await new LogOutcomesPage(ctx.base.page).verifyOptions(expectedOptions);
  },
);

Then(
  "I am on the what was the outcome of this appointment? page",
  async ({ ctx }) => {
    const newAttendedCompliedPage = new NewAttendedCompliedPage(ctx.base.page);
    await newAttendedCompliedPage.assertOnPage();
  },
);

When(
  "I select the option {string} and continue",
  async ({ ctx }, option: string) => {
    const page = ctx.base.page;
    const newAttendedCompliedPage = new NewAttendedCompliedPage(page);
    await newAttendedCompliedPage.selectRadioOption(option);
  },
);

When(
  "I select the enforcement action {string} and continue",
  async ({ ctx }, enforcementAction: string) => {
    const page = ctx.base.page;
    if (!enforcementAction) return;
    switch (enforcementAction) {
      case "Initiate a breach": {
        const attendedFailedToComplyPage = new LogAppointmentOutcomePage(page);
        await attendedFailedToComplyPage.selectRadioOption("Initiate a breach");
        break;
      }
      case "Send a letter": {
        const failedToAttendPage = new FailedToAttendPage(page);
        await failedToAttendPage.selectRadioOption("Send a letter");
        break;
      }
      case "Initiate a recall": {
        const initiateARecallPage = new LogAppointmentOutcomePage(page);
        await initiateARecallPage.selectRadioOption("Initiate a recall");
        break;
      }
      default:
        throw new Error(`Unknown enforcement action: ${enforcementAction}`);
    }
  },
);

Then(
  "I am navigated to the {string} page",
  async ({ ctx }, nextPage: string) => {
    const page = ctx.base.page;

    if (!nextPage) return;

    const getPageType = (page: string) => {
      if (/unacceptable absence/i.test(page)) return "unacceptable absence";
      if (/failure to comply/i.test(page)) return "failure to comply";
      if (/absence/i.test(page)) return "absence";
      if (/initiate a recall/i.test(page)) return "initiate a recall";
      if (/send a letter/i.test(page)) return "send a letter";
      if (/initiate a breach/i.test(page)) return "initiate a breach";
      return page;
    };

    switch (getPageType(nextPage)) {
      case "failure to comply": {
        const attendedFailedToComplyPage = new LogAppointmentOutcomePage(page);
        await attendedFailedToComplyPage.assertOnPage();
        break;
      }
      case "unacceptable absence": {
        const unacceptableAbsencePage = new UnacceptableAbsencePage(page);
        await unacceptableAbsencePage.assertOnPage();
        break;
      }
      case "absence": {
        const failedToAttendPage = new FailedToAttendPage(page);
        await failedToAttendPage.assertOnPage();
        break;
      }
      case "initiate a recall": {
        const initiateARecallPage = new InitiateARecallPage(page);
        await initiateARecallPage.assertOnPage();
        // await initiateARecallPage.completePage();

        break;
      }
      case "send a letter": {
        const sendALetterPage = new SendALetterPage(page);
        await sendALetterPage.assertOnPage();
        // await sendALetterPage.completePage();
        break;
      }
      case "initiate a breach": {
        const initiateABreachPage = new InitiateABreachPage(page);
        await initiateABreachPage.assertOnPage();
        // await initiateABreachPage.completePage();
        break;
      }
      default:
        throw new Error(`Unknown page: ${nextPage}`);
    }
  },
);
Then(
  "I am navigated to the {string} page and I select the radio option {string}",
  async ({ ctx }, nextPage: string, whoWillSend: string) => {
    const page = ctx.base.page;

    if (!nextPage) return;

    const getPageType = (page: string) => {
      if (/unacceptable absence/i.test(page)) return "unacceptable absence";
      if (/failure to comply/i.test(page)) return "failure to comply";
      if (/absence/i.test(page)) return "absence";
      if (/initiate a recall/i.test(page)) return "initiate a recall";
      if (/send a letter/i.test(page)) return "send a letter";
      if (/initiate a breach/i.test(page)) return "initiate a breach";
      return page;
    };

    switch (getPageType(nextPage)) {
      case "failure to comply": {
        const attendedFailedToComplyPage = new LogAppointmentOutcomePage(page);
        await attendedFailedToComplyPage.assertOnPage();
        break;
      }
      case "unacceptable absence": {
        const unacceptableAbsencePage = new UnacceptableAbsencePage(page);
        await unacceptableAbsencePage.assertOnPage();
        break;
      }
      case "absence": {
        const failedToAttendPage = new FailedToAttendPage(page);
        await failedToAttendPage.assertOnPage();
        break;
      }
      case "initiate a recall": {
        const initiateARecallPage = new InitiateARecallPage(page);
        await initiateARecallPage.assertOnPage();
        await initiateARecallPage.completePage(whoWillSend);
        break;
      }
      case "send a letter": {
        const sendALetterPage = new SendALetterPage(page);
        await sendALetterPage.assertOnPage();
        await sendALetterPage.completePage();
        break;
      }
      case "initiate a breach": {
        const initiateABreachPage = new InitiateABreachPage(page);
        await initiateABreachPage.assertOnPage();
        await initiateABreachPage.completePage(whoWillSend);
        break;
      }
      default:
        throw new Error(`Unknown page: ${nextPage}`);
    }
  },
);

When(
  "I complete the acceptable absence reason page if applicable {string}",
  async ({ ctx }, outcomeType: string) => {
    if (outcomeType !== "Acceptable absence") return;
    const page = ctx.base.page;
    const acceptableAbsencePage = new AcceptableAbsencePage(page);
    await acceptableAbsencePage.assertOnPage();
    await acceptableAbsencePage.completePage();
  },
);

When("I complete the add a note page", async ({ ctx }) => {
  const page = ctx.base.page;
  const addNotePage = new AddNotePage(page);
  await addNotePage.assertOnPage();
  await addNotePage.completePage("test", "no");
  if (ctx.appointments.length > 0) {
    ctx.appointments[ctx.appointments.length - 1].note = "test";
    ctx.appointments[ctx.appointments.length - 1].sensitivity = "No";
  } else {
    ctx.manage.note = "test";
  }
});

// When("I complete the next appointment page", async ({ ctx }) => {
//   const page = ctx.base.page;
//   const nextAppointmentPage = new NextAppointmentPage(page);
//   await nextAppointmentPage.assertOnPage();
//   await nextAppointmentPage.completePage(NextAction.No);
// });
When("I complete the next appointment page", async ({ ctx }) => {
  const page = ctx.base.page;
  const nextAppointmentPage = new NextAppointmentPage(page);
  const url = page.url();
  if (url.includes("next-appointment")) {
    await nextAppointmentPage.completePage(NextAction.No);
  }
});
Then("I am on the check your answers page", async ({ ctx }) => {
  const page = ctx.base.page;
  const checkYourAnswersPage = new CheckYourAnswersPage(page);
  await checkYourAnswersPage.assertOnPage();
});

Then("I confirm the appointment outcome", async ({ ctx }) => {
  const page = ctx.base.page;
  const checkYourAnswersPage = new CheckYourAnswersPage(page);
  await checkYourAnswersPage.completePage();
});

Then("I am on the confirmation page", async ({ ctx }) => {
  const page = ctx.base.page;
  const heading = page.locator('[data-qa="pageHeading"]');
  try {
    await expect(heading).toContainText("Past appointment arranged");
  } catch {
    await expect(heading).toContainText(
      "You\u2019ve already arranged this appointment",
    );
  }
});
