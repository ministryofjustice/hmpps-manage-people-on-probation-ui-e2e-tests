import { createBdd } from "playwright-bdd";
import HomePage from "../pageObjects/home.page";
import { testContext } from "../features/Fixtures";
import AlertsPage from "../pageObjects/alerts";
import CasesPage from "../pageObjects/cases.page";
import SearchPage from "../pageObjects/search.page";
import RecentCasesPage from "../pageObjects/recent-cases.page";
import UpcomingAppointmentsPage from "../pageObjects/upcoming.page";
import LogOutcomesPage from "../pageObjects/Case/log-outcomes.page";
import RemindersPage from "../pageObjects/Reminders/reminders";
import ActivityLogPage from "../pageObjects/Case/activity-log.page";
import AppointmentsPage from "../pageObjects/Case/appointments.page";
import OverviewPage from "../pageObjects/Case/overview.page";
import CompliancePage from "../pageObjects/Case/compliance.page";
import DocumentsPage from "../pageObjects/Case/documents.page";
import PersonalDetailsPage from "../pageObjects/Case/personal-details.page";
import RemovedRiskFlagsPage from "../pageObjects/Case/removed-risk-flags.page";
import RiskAndPlanPage from "../pageObjects/Case/risk-and-plan.page";
import RiskPage from "../pageObjects/Case/risk.page";
import SentencePage from "../pageObjects/Case/sentence.page";
import TierPage from "../pageObjects/Case/tier.page";
import CaseUpcomingAppointmentsPage from "../pageObjects/Case/upcoming-appointments.page";
import AddContactPage from "../pageObjects/Case/Contacts/Contacts/add-contact.page";
import ManageCheckInsPage from "../pageObjects/Case/Contacts/Checkins/manage.page";
import RiskFlagPage from "../pageObjects/Case/Contacts/risk-flag.page";
import StopCheckInsPage from "../pageObjects/Case/Contacts/Checkins/stop.page";
import UpdateAddressPage from "../pageObjects/Case/Contacts/update-address.page";
import ManageAppointmentsPage from "../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import AddNotePage from "../pageObjects/Case/Contacts/Appointments/add-note.page";
import NextAppointmentPage from "../pageObjects/Case/Contacts/Appointments/next-appointment.page";
import NotePage from "../pageObjects/Case/Contacts/Appointments/note.page";
import ArrangeAnotherPage from "../pageObjects/Case/Contacts/Appointments/arrange-another.page";
import AttendancePage from "../pageObjects/Case/Contacts/Appointments/attendance.page";
import CYAPage from "../pageObjects/Case/Contacts/Appointments/CYA.page";
import AttendedCompliedPage from "../pageObjects/Case/Contacts/Appointments/attended-complied.page";
import LocationDateTimePage from "../pageObjects/Case/Contacts/Appointments/location-datetime.page";
import LocationNotInListPage from "../pageObjects/Case/Contacts/Appointments/location-not-in-list.page";
import TypeAttendancePage from "../pageObjects/Case/Contacts/Appointments/type-attendance.page";
import SupportingInformationPage from "../pageObjects/Case/Contacts/Appointments/supporting-information.page";
import TextConfirmationPage from "../pageObjects/Case/Contacts/Appointments/text-confirmation-page";
import ReschedulePage from "../pageObjects/Case/Contacts/Appointments/reschedule.page";
import RescheduleDetailsPage from "../pageObjects/Case/Contacts/Appointments/reschedule-details";
import ReviewExpiredPage from "../pageObjects/Case/Contacts/Checkins/Review/review-expired.page";
import ReviewIdentityPage from "../pageObjects/Case/Contacts/Checkins/Review/review-identity.page";
import ReviewNotesPage from "../pageObjects/Case/Contacts/Checkins/Review/review-notes.page";
import ReviewedExpiredPage from "../pageObjects/Case/Contacts/Checkins/Review/reviewed-expired.page";
import ReviewedSubmittedPage from "../pageObjects/Case/Contacts/Checkins/Review/reviewed-submitted.page";
import EligiblePage from "../pageObjects/Case/Contacts/Checkins/SetUp/eligible.page";
import EligibilityPage from "../pageObjects/Case/Contacts/Checkins/SetUp/eligibility-check.page";
import IneligiblePage from "../pageObjects/Case/Contacts/Checkins/SetUp/ineligible.page";
import SPOApprovalPage from "../pageObjects/Case/Contacts/Checkins/SetUp/spo-approval.page";
import PartiallyEligiblePage from "../pageObjects/Case/Contacts/Checkins/SetUp/partially-eligible.page";
import PhotoOptionsPage from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-options.page";
import UploadPhotoPage from "../pageObjects/Case/Contacts/Checkins/SetUp/upload-photo.page";
import TakePhotoPage from "../pageObjects/Case/Contacts/Checkins/SetUp/take-photo.page";
import PhotoMeetRulesPage from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-meet-rules.page";
import ContactDetailsPage from "../pageObjects/Case/Contacts/update-contact-details.page";
import AppointmentConfirmationPage from "../pageObjects/Case/Contacts/Appointments/confirmation/appointment-confirmation.page";
import PastAppointmentConfirmationPage from "../pageObjects/Case/Contacts/Appointments/confirmation/past-appointment-confirmation.page";
import RescheduleAppointmentConfirmationPage from "../pageObjects/Case/Contacts/Appointments/confirmation/reschedule-appointment-confirmation.page";
import SetupCheckInSummaryPage from "../pageObjects/Case/Contacts/Checkins/SetUp/setup-check-in-summary.page";
import RestartCheckInSummaryPage from "../pageObjects/Case/Contacts/Checkins/Restart/restart-check-in-summary.page";
import RestartCheckInConfirmationPage from "../pageObjects/Case/Contacts/Checkins/Restart/restart-check-in-confirmation.page";
import SetupCheckInConfirmationPage from "../pageObjects/Case/Contacts/Checkins/SetUp/setup-check-in-confirmation.page";
import RestartContactPreferencePage from "../pageObjects/Case/Contacts/Checkins/Restart/contact-preference.page";
import RestartDateFrequencyPage from "../pageObjects/Case/Contacts/Checkins/Restart/date-frequency.page";
import SetupContactPreferencePage from "../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page";
import SetupDateFrequencyPage from "../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page";
import MPopPage from "../pageObjects/page";
import CasePage from "../pageObjects/Case/casepage";

const { When, Then } = createBdd(testContext);

const pageMap: { [key: string]: typeof MPopPage } = {
  Home: HomePage,
  Alerts: AlertsPage,
  Cases: CasesPage,
  Search: SearchPage,
  "Recent Cases": RecentCasesPage,
  "Upcoming Appointments": UpcomingAppointmentsPage,
  "Outcomes to log": LogOutcomesPage,
  Reminders: RemindersPage,
  "Contact Log": ActivityLogPage,
  Appointments: AppointmentsPage,
  Overview: OverviewPage,
  Compliance: CompliancePage,
  Documents: DocumentsPage,
  "Personal Details": PersonalDetailsPage,
  "Removed Risk Flags": RemovedRiskFlagsPage,
  "Risk and Plan": RiskAndPlanPage,
  Risk: RiskPage,
  Sentence: SentencePage,
  Tier: TierPage,
  "Case Upcoming Appointments": CaseUpcomingAppointmentsPage,
  "Add Contact page": AddContactPage,
  "Manage Check-Ins page": ManageCheckInsPage,
  "Risk Flag page": RiskFlagPage,
  "Stop Check-Ins page": StopCheckInsPage,
  "Update Address page": UpdateAddressPage,
  "Update Contact Details page": ContactDetailsPage,
  "Manage Appointment page": ManageAppointmentsPage,
  "Appointment Add Note page": AddNotePage,
  "Next Appointment page": NextAppointmentPage,
  "Note page": NotePage,
  "Arrange Appointment Arrange Another page": ArrangeAnotherPage,
  "Arrange Appointment Attendance page": AttendancePage,
  "Arrange Appointment Confirmation page": AppointmentConfirmationPage,
  "Arrange Past Appointment Confirmation page": PastAppointmentConfirmationPage,
  "Reschedule Appointment Confirmation page":
    RescheduleAppointmentConfirmationPage,
  "Arrange Appointment Check Your Answers page": CYAPage,
  "Appointment Attended Complied page": AttendedCompliedPage,
  "Arrange Appointment Location DateTime page": LocationDateTimePage,
  "Arrange Appointment Location Not In List page": LocationNotInListPage,
  "Arrange Appointment Type Attendence page": TypeAttendancePage,
  "Arrange Appointment Supporting Information page": SupportingInformationPage,
  "Arrange Appointment Sentence page": SentencePage,
  "Arrange Appointment Text Confirmation page": TextConfirmationPage,
  "Appointment Reschedule page": ReschedulePage,
  "Appointment Reschedule Check Your Answers page": RescheduleDetailsPage,
  "CheckIn Review Expired page": ReviewExpiredPage,
  "CheckIn Review Identity page": ReviewIdentityPage,
  "CheckIn Review Notes page": ReviewNotesPage,
  "CheckIn View Expired and Reviewed page": ReviewedExpiredPage,
  "CheckIn View Submitted and Reviewed page": ReviewedSubmittedPage,
  "Setup CheckIn Check Your Answers page": SetupCheckInSummaryPage,
  "Restart CheckIn Check Your Answers page": RestartCheckInSummaryPage,
  "Setup CheckIn Confirmation page": SetupCheckInConfirmationPage,
  "Restart CheckIn Confirmation page": RestartCheckInConfirmationPage,
  "Setup CheckIn Contact Preference page": SetupContactPreferencePage,
  "Restart CheckIn Contact Preference page": RestartContactPreferencePage,
  "Setup CheckIn Date Frequency page": SetupDateFrequencyPage,
  "Restart CheckIn Date Frequency page": RestartDateFrequencyPage,
  "Setup CheckIn Eligibility page": EligibilityPage,
  "Setup CheckIn Eligible page": EligiblePage,
  "Setup CheckIn Partially Eligible page": PartiallyEligiblePage,
  "Setup CheckIn Ineligible page": IneligiblePage,
  "Setup CheckIn SPO Approval page": SPOApprovalPage,
  "Setup CheckIn Photo Options page": PhotoOptionsPage,
  "Setup CheckIn Upload Photo page": UploadPhotoPage,
  "Setup CheckIn Take Photo page": TakePhotoPage,
  "Setup CheckIn Photo Meet Rules page": PhotoMeetRulesPage,
};

Then("I am on the {string} page", async ({ ctx }, pageName: string) => {
  const page = new pageMap[pageName](ctx.base.page);
  await page.assertOnPage();
  ctx.base.currentPage = page;
});

Then(
  "I am on the {string} page with crn {string}",
  async ({ ctx }, pageName: string, crn: string) => {
    const page = new pageMap[pageName](ctx.base.page, crn);
    await page.assertOnPage();
    ctx.base.currentPage = page;
  },
);

When("I click on the {string} link", async ({ ctx }, linkText: string) => {
  await ctx.base.page.getByRole("link", { name: linkText }).click();
});

When("I click on the {string} button", async ({ ctx }, buttonText: string) => {
  await ctx.base.page.getByRole("button", { name: buttonText }).click();
});

When("I submit the page", async ({ ctx }) => {
  if (ctx.base.currentPage) {
    await ctx.base.currentPage.submit();
  } else {
    const MpopPage = new MPopPage(ctx.base.page);
    await MpopPage.submit();
  }
});

When(
  "I select the {string} in case navigation",
  async ({ ctx }, tabQA: string) => {
    if (ctx.base.currentPage instanceof CasePage) {
      await ctx.base.currentPage.useSubNavigation(tabQA);
    } else {
      const casePage = new CasePage(ctx.base.page);
      await casePage.useSubNavigation(tabQA);
    }
  },
);

When(
  "I click on the {string} radio option in {string} section",
  async ({ ctx }, radioText: string, section: string) => {
    await ctx.base.currentPage!.clickRadioByName(section, radioText);
  },
);

When(
  "I click on the {string} radio option",
  async ({ ctx }, radioText: string) => {
    await ctx.base.page.getByRole("radio", { name: radioText }).click();
  },
);
