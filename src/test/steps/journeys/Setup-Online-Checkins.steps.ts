import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import ConfirmationPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/confirmation.page";
import CheckInSummaryPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page";
import { createBdd, DataTable } from "playwright-bdd";
import {
  dateTimeMapping,
  dueDateString,
  lastWeek,
  luxonString,
  today,
} from "../../util/DateTime";
import { testContext } from "../../features/Fixtures";
import {
  createEsupervisionCheckin,
  getClientToken,
  getProbationPractitioner,
  postEsupervisionVideo,
  submitEsupervisionCheckin,
  verifyEsupervisionVideo,
} from "../../util/API";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import {
  getCasesWithCheckInsSetup,
  getCrnsWithCheckInsSetup,
  Review,
  reviewCheckinMpop,
  reviewDataTable,
  ReviewType,
  SurveyResponse,
  YesNoCheck,
} from "../../util/ReviewCheckins";
import ReviewedSubmittedPage from "../../pageObjects/Case/Contacts/Checkins/Review/reviewed-submitted.page";
import ReviewedExpiredPage from "../../pageObjects/Case/Contacts/Checkins/Review/reviewed-expired.page";
import ManageCheckInsPage from "../../pageObjects/Case/Contacts/Checkins/manage.page";
import StopCheckInsPage from "../../pageObjects/Case/Contacts/Checkins/stop.page";
import ReviewExpiredPage from "../../pageObjects/Case/Contacts/Checkins/Review/review-expired.page";
import { expect } from "@playwright/test";
import EligibilityPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/eligibility-check.page";
import PartiallyEligiblePage from "../../pageObjects/Case/Contacts/Checkins/SetUp/partially-eligible.page";
import DateFrequencyPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page";
import EligiblePage from "../../pageObjects/Case/Contacts/Checkins/SetUp/eligible.page";
import IneligiblePage from "../../pageObjects/Case/Contacts/Checkins/SetUp/ineligible.page";
import SPOApprovalPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/spo-approval.page";
import ContactPreferencePage from "../../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page";
import PhotoOptionsPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/photo-options.page";
import UploadPhotoPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/upload-photo.page";
import TakePhotoPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/take-photo.page";
import PhotoMeetRulesPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/photo-meet-rules.page";
import ContactDetailsPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/update-contact-details.page";
const { Given, When, Then } = createBdd(testContext);

Given("I have navigated to new offender", async ({ ctx }) => {
  const setUpOnLineCheckinsPage = new AppointmentsPage(
    ctx.base.page,
    ctx.case.crn,
  );
  await setUpOnLineCheckinsPage.navigateTo();
});

When("I click to set up online checkIns", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const appointments: AppointmentsPage = new AppointmentsPage(page, crn);
  await appointments.clickSetupOnlineCheckInsBtn();
  await page.waitForLoadState("networkidle");
});

When(
  "I complete the eligibility check page with criteria",
  async ({ ctx }, criteria: DataTable) => {
    const page = ctx.base.page;
    const eligibilityPage = new EligibilityPage(page);
    await eligibilityPage.assertOnPage();
    await eligibilityPage.completePage(criteria);
  },
);

When("I complete the eligibile page", async ({ ctx }) => {
  const page = ctx.base.page;
  const eligiblePage = new EligiblePage(page);
  await eligiblePage.assertOnPage();
  await eligiblePage.completePage();
});

When(
  "I complete the eligibile page with use {string}",
  async ({ ctx }, use: string) => {
    const page = ctx.base.page;
    const eligiblePage = new EligiblePage(page);
    await eligiblePage.assertOnPage();
    await eligiblePage.completePage(use);
  },
);

When("I complete the SPO approval page", async ({ ctx }) => {
  const page = ctx.base.page;
  const spoApprovalPage = new SPOApprovalPage(page);
  await spoApprovalPage.assertOnPage();
  await spoApprovalPage.completePage();
});

When(
  "I complete the date frequency page with date {string} and frequency {string}",
  async ({ ctx }, date: string, frequency: string) => {
    const page = ctx.base.page;
    const dateFrequencyPage = new DateFrequencyPage(page);
    await dateFrequencyPage.assertOnPage();
    await dateFrequencyPage.completePage(
      luxonString(dateTimeMapping[date]),
      frequency,
    );
  },
);

When(
  "I navigate to update contact details via {string} link from checkins journey",
  async ({ ctx }, changeLink: string) => {
    const page = ctx.base.page;
    const contactPreferencePage = new ContactPreferencePage(page);
    await contactPreferencePage.assertOnPage();
    await page.waitForLoadState("networkidle");
    await contactPreferencePage.navigateToUpdateContactDetails(changeLink);
    const contactDetailsPage = new ContactDetailsPage(page);
    await contactDetailsPage.assertOnPage();
  },
);

When(
  "I complete the contact preference page with preference {string}",
  async ({ ctx }, preference: string) => {
    const page = ctx.base.page;
    const contactPreferencePage = new ContactPreferencePage(page);
    await contactPreferencePage.assertOnPage();
    await contactPreferencePage.completePage(preference);
  },
);

When(
  "I complete the photo options page with option {string}",
  async ({ ctx }, option: string) => {
    const page = ctx.base.page;
    const photoOptionsPage = new PhotoOptionsPage(page);
    await photoOptionsPage.assertOnPage();
    await photoOptionsPage.completePage(option);
  },
);

When("I complete the upload photo page", async ({ ctx }) => {
  const page = ctx.base.page;
  const uploadPhotoPage = new UploadPhotoPage(page);
  await uploadPhotoPage.assertOnPage();
  await uploadPhotoPage.completePage();
});

When("I complete the take a photo page", async ({ ctx }) => {
  const page = ctx.base.page;
  const takePhotoPage = new TakePhotoPage(page);
  await takePhotoPage.assertOnPage();
  await takePhotoPage.completePage();
});

When("I complete the photo meet the rules page", async ({ ctx }) => {
  const page = ctx.base.page;
  // // Photo Meet the rules page
  const photoMeetRulesPage = new PhotoMeetRulesPage(page);
  await photoMeetRulesPage.assertOnPage();
  await photoMeetRulesPage.completePage();
});

Then("I can see the checkIn summary page", async ({ ctx }) => {
  const page = ctx.base.page;
  const checkInSummaryPage = new CheckInSummaryPage(page);
  await checkInSummaryPage.assertOnPage();
});

// When("I make the following changes", async ({ ctx }, data: DataTable) => {
//   const page = ctx.base.page;
//   const changes: MpopSetupChanges = setupDataTable(data);
//   await makeChangesSetupCheckins(page, changes);
//   const checkInSummaryPage = new CheckInSummaryPage(page);
//   await checkInSummaryPage.assertOnPage();
//   await checkInSummaryPage.submit();
//   await new Promise((resolve) => setTimeout(resolve, 4000));
//   ctx.checkIns.changes = changes;
// });

When("I submit the checkin", async ({ ctx }) => {
  const page = ctx.base.page;
  const checkInSummaryPage = new CheckInSummaryPage(page);
  // await checkInSummaryPage.assertOnPage();
  await checkInSummaryPage.submit();
});

Then("I can see the confirmation page", async ({ ctx }) => {
  const page = ctx.base.page;
  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.assertOnPage();
  await confirmationPage.checkWhatHappensNextTextExists();
  await confirmationPage.checkGoToAllCasesLinkExists();
  await confirmationPage.returnToPoPsOverviewButtonExist();
  await confirmationPage.selectPoPsOverviewButton();
});

When(
  "I mock the completion of a completed checkin",
  async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page;
    const crn = ctx.case.crn;
    const token = await getClientToken();
    const practitioner = await getProbationPractitioner(crn, token);
    const uuid = await createEsupervisionCheckin(
      practitioner,
      crn,
      dueDateString(today),
      token,
    );
    await postEsupervisionVideo(page, uuid, token);
    await verifyEsupervisionVideo(uuid, token);
    const surveyResponse = reviewDataTable(data) as SurveyResponse;
    await submitEsupervisionCheckin(uuid, token, surveyResponse);
  },
);

Then("I can access the new checkIn in the contact log", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  await page.waitForTimeout(10000);
  const contactLog = new ActivityLogPage(page, crn);
  await contactLog.navigateTo();
  await contactLog.assertOnPage();
  await contactLog.getQA("esup-manage-link").first().click();
});

When("I review the completed checkIn", async ({ ctx }) => {
  const review: Review = {
    type: ReviewType.SUBMITTED,
    review: {
      identity: YesNoCheck.YES,
      sensitivity: "Yes",
    },
  };
  await reviewCheckinMpop(ctx.base.page, review);
});

Then("I can view the reviewed checkIn", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const contactLog = new ActivityLogPage(page, crn);
  await page.waitForLoadState("networkidle");
  await contactLog.assertOnPage();
  await contactLog.getQA("esup-manage-link").first().click();
  const reviewedSubmittedPage = new ReviewedSubmittedPage(page, crn);
  await reviewedSubmittedPage.assertOnPage();
});

When("I find a number of valid CRNs", async ({ ctx }) => {
  const page = ctx.base.page;
  const startCrn = "X983000";
  await getCrnsWithCheckInsSetup(page, startCrn);
});

When("I find a number of valid cases", async ({ ctx }) => {
  const page = ctx.base.page;
  await getCasesWithCheckInsSetup(page);
});

When("I mock the completion of an expired checkin", async ({ ctx }) => {
  const expiredCrn = ctx.checkIns.expiredCrn;
  const token = await getClientToken();
  const practitioner = await getProbationPractitioner(expiredCrn, token);
  await createEsupervisionCheckin(
    practitioner,
    expiredCrn,
    dueDateString(today.minus({ days: 7 })),
    token,
  );
});

When("I review the missed checkIn", async ({ ctx }) => {
  const review: Review = {
    type: ReviewType.EXPIRED,
    review: {
      comment: "note",
      sensitivity: "Yes",
    },
  };
  await reviewCheckinMpop(ctx.base.page, review);
});

Then("I can view the expired and reviewed checkIn", async ({ ctx }) => {
  const page = ctx.base.page;
  const expiredCrn = ctx.checkIns.expiredCrn;
  const contactLog = new ActivityLogPage(page, expiredCrn);
  await contactLog.assertOnPage();
  await contactLog.getQA("esup-manage-link").first().click();
  const reviewedExpiredPage = new ReviewedExpiredPage(page, expiredCrn);
  await reviewedExpiredPage.assertOnPage();
});

When("I navigate to checkIn details", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const managePage = new ManageCheckInsPage(page, crn);
  await managePage.navigateTo();
  await managePage.assertOnPage();
});

When("I select {string} link", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const managePage = new ManageCheckInsPage(page, crn);
  await managePage.clickChangeQuestions();
});

When(
  "I stop checkIns with {string} and sensitivity {string}",
  async ({ ctx }, reason) => {
    const page = ctx.base.page;
    const managePage = new ManageCheckInsPage(page);
    await managePage.assertOnPage();
    await managePage.clickStopCheckIns();
    const stopPage = new StopCheckInsPage(page);
    await stopPage.completePage("No", reason);
  },
);

Then("checkIns are labelled as stopped", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageCheckInsPage(page);
  await managePage.assertOnPage();
  await managePage.clickBackLink();
  const overview = new OverviewPage(page);
  await overview.assertOnPage();
  await overview.checkSummaryRowValue(
    await overview.getSummaryRowByKey("Next check in due"),
    "Check ins stopped",
  );
});

When("I go to manage checkIns page", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const overview = new OverviewPage(page, crn);
  await overview.assertOnPage();
  await overview.checkOnlineCheckInsLink(false);
  const managePage = new ManageCheckInsPage(page, crn);
  await managePage.assertOnPage();
});

When("I click to restart checkIns", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageCheckInsPage(page);
  await managePage.assertOnPage();
  await managePage.clickRestartCheckIns();
});

When(
  "I complete the restart date frequency page with date {string} and frequency {string}",
  async ({ ctx }, date: string, frequency: string) => {
    const page = ctx.base.page;
    const dateFrequencyPage = new DateFrequencyPage(page, true);
    await dateFrequencyPage.assertOnPage();
    await dateFrequencyPage.completePage(
      luxonString(dateTimeMapping[date]),
      frequency,
    );
  },
);

When(
  "I complete the restart contact preference page with preference {string}",
  async ({ ctx }, preference: string) => {
    const page = ctx.base.page;
    const contactPreferencePage = new ContactPreferencePage(page, true);
    await contactPreferencePage.assertOnPage();
    await contactPreferencePage.completePage(preference);
  },
);

Then("I can see the checkIn summary page for restart", async ({ ctx }) => {
  const summaryPage = new CheckInSummaryPage(ctx.base.page, true);
  await summaryPage.assertOnPage();
});

Then("I can see the confirmation page for restart", async ({ ctx }) => {
  const confirmationPage = new ConfirmationPage(ctx.base.page, true);
  await confirmationPage.assertOnPage();
  // await confirmationPage.checkWhatHappensNextTextExists();
  // await confirmationPage.checkGoToAllCasesLinkExists();
  // await confirmationPage.returnToPoPsOverviewButtonExist();
  // await confirmationPage.selectPoPsOverviewButton();
});

// Then("Checkins should be setup", async ({ ctx }) => {
//   const restart = ctx.checkIns.restart;
//   let details: MPoPCheckinDetails;
//   if (restart) {
//     details = {
//       date: restart.date,
//       frequency: restart.frequency,
//       preference: restart.preference,
//     };
//   } else {
//     const setup = ctx.checkIns.setup;
//     const changes = ctx.checkIns.changes;
//     details = {
//       date: changes.date ?? setup.date,
//       frequency: changes.frequency ?? setup.frequency,
//       preference: changes.preference ?? setup.preference,
//     };
//   }
//   //Overview Page - Verify Online check ins section is displayed. Verify Contact Preference
//   const overviewPage = new OverviewPage(ctx.base.page);
//   await overviewPage.assertOnPage();
//   // await overviewPage.verifyCheckinDetails(details);
// });

Then(
  "I mock the completion of an expired checkin for {string}",
  //eslint-disable-next-line no-empty-pattern
  async ({}, cases) => {
    const caseList = cases.split(",");
    for (let i = 0; i < caseList.length; i++) {
      const crn = caseList[i];
      console.log(crn);
      const token = await getClientToken();
      const practitioner = await getProbationPractitioner(crn, token);
      await createEsupervisionCheckin(
        practitioner,
        crn,
        dueDateString(lastWeek),
        token,
        true,
      );
    }
  },
);

When("I find valid case from {string}", async ({ ctx }, cases) => {
  const page = ctx.base.page;
  const caseList = cases.split(",");
  for (let i = 0; i < caseList.length; i++) {
    const crn = caseList[i];
    console.log(crn);
    const contactPage = new ActivityLogPage(page, crn);
    await contactPage.navigateTo();
    await contactPage.assertOnPage();
    try {
      await contactPage
        .getQA("esup-manage-link")
        .first()
        .click({ timeout: 3000 });
    } catch {
      console.log("no checkins");
      continue;
    }
    const review = new ReviewExpiredPage(page);
    try {
      await expect(review.getQA("pageHeading")).toHaveText(review.title!, {
        timeout: 3000,
      });
      ctx.checkIns.expiredCrn = crn;
      return;
    } catch {
      console.log("completed or reviewed");
    }
  }
  console.log("No valid cases left");
});

When(
  "I fill eligibility values with {string}",
  async ({ ctx }, ids: string) => {
    const page = ctx.base.page;
    const numbers = ids.split(",").map((i) => Number(i));
    const setUpOnLineCheckinsPage = new AppointmentsPage(page);
    await setUpOnLineCheckinsPage.clickSetupOnlineCheckInsBtn();
    const eligibilityPage = new EligibilityPage(page);
    await eligibilityPage.assertOnPage();
    await eligibilityPage.completePageWithIDs(numbers);
  },
);

Then("I {string} use checkIns", async ({ ctx }, can: string) => {
  const page = ctx.base.page;
  if (can === "can, alongside face-to-face contact,") {
    const partialPage = new PartiallyEligiblePage(page);
    await partialPage.assertOnPage();
    await partialPage.completePage();
    const dateFrequencyPage = new DateFrequencyPage(page);
    await dateFrequencyPage.assertOnPage();
  } else if (can === "can") {
    const eligiblePage = new EligiblePage(page);
    await eligiblePage.assertOnPage();
    await eligiblePage.completePage("As well as existing face-to-face contact");
    const dateFrequencyPage = new DateFrequencyPage(page);
    await dateFrequencyPage.assertOnPage();
  } else if (can === "cannot") {
    const ineligiblePage = new IneligiblePage(page);
    await ineligiblePage.assertOnPage();
    await ineligiblePage.completePage();
    const overview = new OverviewPage(page);
    await overview.assertOnPage();
  }
});

Then(
  "I see {string} link on how to write questions page",
  async ({ ctx }, linkName: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertCancelAndGoToOverviewLink(linkName);
  },
);

When(
  "I select {string} button on how to write questions page",
  async ({ ctx }) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.selectAddQuestionsToOnlineCheckInsButton();
  },
);

Then(
  "I see text {string} on add questions page",
  async ({ ctx }, expectedText: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertTextOnAddQuestionPage(expectedText);
  },
);

Then(
  "I see default questions with preview links:",
  async ({ ctx }, data: DataTable) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertQuestionsText(data);
    await managePage.assertPreviewLinks();
  },
);

When(
  "I select the {string} link on add questions page",
  async ({ ctx }, link: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);

    if (link == "preview-feeling") {
      await managePage.selectPreviewFeelingLink();
    } else {
      await managePage.selectPreviewSupportLink();
    }
  },
);

Then(
  "I see these radio buttons on the feeling preview page",
  async ({ ctx }, data: DataTable) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertRadioButtonsOnFeelingPreviewPage(data);
  },
);

Then(
  "I see these text areas on the feeling preview page",
  async ({ ctx }, data: DataTable) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertTextAreaOnFeelingPreviewPage(data);
  },
);

Then(
  "I see these check-boxes on the support preview page",
  async ({ ctx }, data: DataTable) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertCheckBoxesOnSupportPreviewPage(data);
  },
);

Then(
  "I see these text areas on the support preview page",
  async ({ ctx }, data: DataTable) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertTextAreaOnSupportPreviewPage(data);
  },
);

Then(
  "I select Back-to-questions button on the preview page",
  async ({ ctx }) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.selectBackToQuestionsButton();
  },
);

Then(
  "I see {string} button on add questions page",
  async ({ ctx }, expectedButton: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);

    if (expectedButton == "Add question") {
      await managePage.assertAddQuestionButton(expectedButton);
    } else {
      await managePage.assertSaveQuestionsButton(expectedButton);
    }
  },
);

Then(
  "I see {string} link on add questions page",
  async ({ ctx }, expectedLink: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertCancelAndGoBackLink(expectedLink);
  },
);

When("I select {string} link on add questions page", async ({ ctx }) => {
  const managePage = new ManageCheckInsPage(ctx.base.page);
  await managePage.selectCancelAndGoBackLink();
});

Then(
  "I am directed to {string} page",
  async ({ ctx }, expectedText: string) => {
    const managePage = new ManageCheckInsPage(ctx.base.page);
    await managePage.assertTextOnAddQuestionPage(expectedText);
  },
);
