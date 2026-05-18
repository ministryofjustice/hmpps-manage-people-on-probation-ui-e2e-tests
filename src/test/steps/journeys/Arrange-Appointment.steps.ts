import { createBdd } from "playwright-bdd";
import AppointmentsPage from "../../pageObjects/Case/appointments.page";
import {
  MpopArrangeAppointment,
  MpopAttendee,
} from "../../util/ArrangeAppointment";
import { testContext } from "../../features/Fixtures";
import LocationNotInListPage from "../../pageObjects/Case/Contacts/Appointments/location-not-in-list.page";
import ConfirmationPage from "../../pageObjects/Case/Contacts/Appointments/confirmation.page";
import ManageAppointmentsPage from "../../pageObjects/Case/Contacts/Appointments/manage-appointment.page";
import { getClientToken } from "../../util/API";
import { DateTime } from "luxon";
import {
  dateTimeMapping,
  luxonString,
  MpopDateTime,
  today,
} from "../../util/DateTime";
import { checkOutlook } from "../../util/Outlook";
import CYAPage from "../../pageObjects/Case/Contacts/Appointments/CYA.page";
import RemindersPage from "../../pageObjects/Reminders/reminders";
import TypeAttendancePage from "../../pageObjects/Case/Contacts/Appointments/type-attendance.page";
import AttendancePage from "../../pageObjects/Case/Contacts/Appointments/attendance.page";
import LocationDateTimePage from "../../pageObjects/Case/Contacts/Appointments/location-datetime.page";
import SupportingInformationPage from "../../pageObjects/Case/Contacts/Appointments/supporting-information.page";
import TextConfirmationPage from "../../pageObjects/Case/Contacts/Appointments/text-confirmation-page";
import ContactDetailsPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/update-contact-details.page";
import SentencePage from "../../pageObjects/Case/Contacts/Appointments/sentence.page";
import AttendedCompliedPage from "../../pageObjects/Case/Contacts/Appointments/attended-complied.page";
import AddNotePage from "../../pageObjects/Case/Contacts/Appointments/add-note.page";
import NextAppointmentPage from "../../pageObjects/Case/Contacts/Appointments/next-appointment.page";
import ArrangeAnotherPage from "../../pageObjects/Case/Contacts/Appointments/arrange-another.page";
import ReschedulePage from "../../pageObjects/Case/Contacts/Appointments/reschedule.page";
import RescheduleDetailsPage from "../../pageObjects/Case/Contacts/Appointments/reschedule-details";
import * as fs from "fs";

const { When, Then } = createBdd(testContext);

When("I navigate to the appointments page", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const appointments: AppointmentsPage = new AppointmentsPage(page, crn);
  await appointments.navigateTo();
  await appointments.assertOnPage();
});

When("I click to arrange an appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const appointments: AppointmentsPage = new AppointmentsPage(page, crn);
  await appointments.startArrangeAppointment();
  ctx.appointments.push({} as MpopArrangeAppointment);
  await page.waitForLoadState("networkidle");
});

When(
  "I complete the sentence page with sentence {string}",
  async ({ ctx }, sentence: string) => {
    const page = ctx.base.page;
    const sentencePage = new SentencePage(page);
    await sentencePage.assertOnPage();
    await sentencePage.completePage(sentence);
    ctx.appointments[ctx.appointments.length - 1].sentence = sentence;
  },
);

When(
  "I complete the type attendance page with type {string} and default attendee",
  async ({ ctx }, type: string) => {
    const page = ctx.base.page;
    const typeAttendancePage = new TypeAttendancePage(page);
    await typeAttendancePage.assertOnPage();
    await typeAttendancePage.completePage(type);
    ctx.appointments[ctx.appointments.length - 1].type = type;
  },
);

When(
  "I navigate from type attendance page to change attendee page",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const typeAttendancePage = new TypeAttendancePage(page);
    await typeAttendancePage.assertOnPage();
    await typeAttendancePage.clickLink("Change");
  },
);

When(
  "I complete attendee page with provider {string} and team {string} and user {string}",
  async ({ ctx }, provider, team, user) => {
    const page = ctx.base.page;
    const attendee: MpopAttendee = {
      provider,
      team,
      user,
    };
    const attendancePage = new AttendancePage(page);
    await attendancePage.assertOnPage();
    await attendancePage.completePage(attendee);
    ctx.appointments[ctx.appointments.length - 1].attendee = attendee;
  },
);

When(
  "I complete the location and datetime page with date {string}, startTime {string}, endTime {string} and location {string}",
  async (
    { ctx },
    date: string,
    startTime: string,
    endTime: string,
    location: string,
  ) => {
    const page = ctx.base.page;
    const dateTime: MpopDateTime = {
      date: luxonString(dateTimeMapping[date]),
      startTime,
      endTime,
    };
    const locationDateTimePage = new LocationDateTimePage(page);
    await locationDateTimePage.assertOnPage();
    await locationDateTimePage.completePage(dateTime, location);
    ctx.appointments[ctx.appointments.length - 1].location = location;
    ctx.appointments[ctx.appointments.length - 1].dateTime = dateTime;
  },
);

When(
  "I complete the location and datetime page with date {string}, startTime {string}, endTime {string} and locationID {int}",
  async (
    { ctx },
    date: string,
    startTime: string,
    endTime: string,
    locationId: number,
  ) => {
    const page = ctx.base.page;
    const dateTime: MpopDateTime = {
      date: luxonString(dateTimeMapping[date]),
      startTime,
      endTime,
    };
    const locationDateTimePage = new LocationDateTimePage(page);
    await locationDateTimePage.assertOnPage();
    const location = await locationDateTimePage.completePageWithId(
      dateTime,
      locationId,
    );
    ctx.appointments[ctx.appointments.length - 1].location = location;
    ctx.appointments[ctx.appointments.length - 1].dateTime = dateTime;
  },
);

Then("I confirm the text message preview", async ({ ctx }) => {
  const page = ctx.base.page;
  const textConfirmationPage = new TextConfirmationPage(page);
  await textConfirmationPage.assertOnPage();
  const date = ctx.appointments[ctx.appointments.length - 1].dateTime.date;
  const startTime =
    ctx.appointments[ctx.appointments.length - 1].dateTime.startTime;
  await textConfirmationPage.confirmPreview(date, startTime);
});

When(
  "I complete the text message confirmation page with option {string}",
  async ({ ctx }, option) => {
    const page = ctx.base.page;
    const textConfirmationPage = new TextConfirmationPage(page);
    await textConfirmationPage.assertOnPage();
    await textConfirmationPage.completePage(option);
    ctx.appointments[ctx.appointments.length - 1].text = option.includes("Yes")
      ? "Yes"
      : "No";
  },
);

When("I set the mobile number to {string}", async ({ ctx }, mobile) => {
  const page = ctx.base.page;
  const contactDetailsPage = new ContactDetailsPage(page);
  await contactDetailsPage.assertOnPage();
  await contactDetailsPage.completePageForAppointment(mobile);
});

When(
  "I complete the supporting information page with note {string} and sensitivity {string}",
  async ({ ctx }, note: string, sensitivity: string) => {
    const page = ctx.base.page;
    const supportingInfoPage = new SupportingInformationPage(page);
    await supportingInfoPage.assertOnPage();
    await supportingInfoPage.completePage(sensitivity, note);
    ctx.appointments[ctx.appointments.length - 1].note = note;
    ctx.appointments[ctx.appointments.length - 1].sensitivity = sensitivity;
  },
);

When(
  "I complete the supporting information page with note {string}",
  async ({ ctx }, note: string) => {
    const page = ctx.base.page;
    const supportingInfoPage = new SupportingInformationPage(page);
    await supportingInfoPage.assertOnPage();
    await supportingInfoPage.completePage("", note, true);
    ctx.appointments[ctx.appointments.length - 1].note = note;
    ctx.appointments[ctx.appointments.length - 1].sensitivity = "Yes";
    ctx.appointments[ctx.appointments.length - 1].sensitivityLocked = true;
  },
);

When("I complete the attended complied page", async ({ ctx }) => {
  const page = ctx.base.page;
  const attendedCompliedPage = new AttendedCompliedPage(page);
  await attendedCompliedPage.assertOnPage();
  await attendedCompliedPage.completePage();
});

When(
  "I complete the add note page with note {string} and sensitivity {string}",
  async ({ ctx }, note, sensitivity) => {
    const page = ctx.base.page;
    const attendedCompliedPage = new AddNotePage(page);
    await attendedCompliedPage.assertOnPage();
    await attendedCompliedPage.completePage(note, sensitivity);
    if (ctx.appointments.length > 0) {
      ctx.appointments[ctx.appointments.length - 1].note = note;
      ctx.appointments[ctx.appointments.length - 1].sensitivity = sensitivity;
    } else {
      ctx.manage.note = note;
    }
  },
);

When(
  "I complete the add note page with note {string}",
  async ({ ctx }, note) => {
    const page = ctx.base.page;
    const attendedCompliedPage = new AddNotePage(page);
    await attendedCompliedPage.assertOnPage();
    await attendedCompliedPage.completePage(note, "", undefined, true);
    if (ctx.appointments.length > 0) {
      ctx.appointments[ctx.appointments.length - 1].note = note;
      ctx.appointments[ctx.appointments.length - 1].sensitivity = "Yes";
      ctx.appointments[ctx.appointments.length - 1].sensitivityLocked = true;
    } else {
      ctx.manage.note = note;
    }
  },
);

When(
  "I complete the add note page with large note and sensitivity {string}",
  async ({ ctx }, sensitivity) => {
    const page = ctx.base.page;
    const attendedCompliedPage = new AddNotePage(page);
    await attendedCompliedPage.assertOnPage();
    const file = fs.readFileSync("src/test/fixtures/note.txt", "utf8");
    await attendedCompliedPage.completePage(file.toString(), sensitivity);
    if (ctx.appointments.length > 0) {
      ctx.appointments[ctx.appointments.length - 1].note = file.toString();
      ctx.appointments[ctx.appointments.length - 1].sensitivity = sensitivity;
    } else {
      ctx.manage.note = file.toString();
    }
  },
);

Then(
  "I can see the correct information on the CYA page for a future appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const cyaPage = new CYAPage(page);
    await cyaPage.assertOnPage();
    await cyaPage.checkPageFuture(
      ctx.appointments[ctx.appointments.length - 1],
    );
  },
);

Then(
  "I can see the correct information on the CYA page for a past appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const cyaPage = new CYAPage(page);
    await cyaPage.assertOnPage();
    await cyaPage.checkPagePast(ctx.appointments[ctx.appointments.length - 1]);
  },
);

When("I submit the appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const cyaPage = new CYAPage(page);
  await cyaPage.assertOnPage();
  await cyaPage.submit();
  await page.waitForLoadState("networkidle");
});

Then(
  "I can see the Confirmation page for {string} appointment",
  async ({ ctx }, type: string) => {
    const page = ctx.base.page;
    let confirmationPage: ConfirmationPage;
    if (type === "past") {
      confirmationPage = new ConfirmationPage(
        page,
        "Past appointment arranged",
      );
    } else if (type === "future") {
      confirmationPage = new ConfirmationPage(page);
    } else if (type === "rescheduled") {
      confirmationPage = new ConfirmationPage(page, "Appointment rescheduled");
    } else {
      console.log("ERROR");
    }
    await confirmationPage!.assertOnPage();
  },
);

Then("I can see the outlook event was created succesfully", async ({ ctx }) => {
  const page = ctx.base.page;
  const token = await getClientToken();
  const appointment: MpopArrangeAppointment =
    ctx.appointments[ctx.appointments.length - 1];
  const past =
    DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy") < today;
  await checkOutlook(page, ctx.case, token, past, appointment.dateTime);
});

Then("I can see no outlook event was created", async ({ ctx }) => {
  const page = ctx.base.page;
  const token = await getClientToken();
  const appointment: MpopArrangeAppointment =
    ctx.appointments[ctx.appointments.length - 1];
  const past =
    DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy") < today;
  await checkOutlook(page, ctx.case, token, past, appointment.dateTime);
});

When("I access the created appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const appointment: MpopArrangeAppointment =
    ctx.appointments[ctx.appointments.length - 1];
  const appointmentsPage = new AppointmentsPage(page);
  await appointmentsPage.assertOnPage();
  await appointmentsPage.manageAppointment(appointment);
});

Then("I can see the Manage page", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
});

When("I navigate to the reminders service", async ({ ctx }) => {
  const page = ctx.base.page;
  const remindersPage = new RemindersPage(page);
  await remindersPage.goTo();
  await remindersPage.checkOnPage();
});

Then("I can see the appointment text message details", async ({ ctx }) => {
  const remindersPage = new RemindersPage(ctx.base.page);
  const appointment = ctx.appointments[ctx.appointments.length - 1];
  await remindersPage.checkForMessage(appointment, ctx.case.person);
});

Then("I end up on the location-not-in-list page", async ({ ctx }) => {
  const locationNotInListPage = new LocationNotInListPage(ctx.base.page);
  await locationNotInListPage.assertOnPage();
});

When("I go to the newest appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const appointmentsPage = new AppointmentsPage(page);
  await appointmentsPage.assertOnPage();
  await appointmentsPage.getNewestAppointment();
});

When("I select to arrange next appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  await managePage.clickLink("Arrange next appointment");
});

When("I select similar appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const nextPage = new NextAppointmentPage(page);
  await nextPage.assertOnPage();
  await nextPage.completePage(0);
  ctx.appointments.push({} as MpopArrangeAppointment);
  await page.waitForLoadState("networkidle");
});

When(
  "I select the {string} link on the Arrange Another page",
  async ({ ctx }, link: string) => {
    const page = ctx.base.page;
    const anotherPage = new ArrangeAnotherPage(page);
    await anotherPage.assertOnPage();
    await anotherPage.clickLink(link);
  },
);

Then(
  "I can see the correct information on the Arrange Another page for a future appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const anotherPage = new ArrangeAnotherPage(page);
    await anotherPage.assertOnPage();
    await anotherPage.checkPageFuture(
      ctx.appointments[ctx.appointments.length - 1],
    );
  },
);

When("I submit the similar appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const anotherPage = new ArrangeAnotherPage(page);
  await anotherPage.assertOnPage();
  await anotherPage.submit();
});

Then("I select the Reschedule link", async ({ ctx }) => {
  const page = ctx.base.page;
  const managePage = new ManageAppointmentsPage(page);
  await managePage.assertOnPage();
  await managePage.clickLink("Reschedule");
});

Then(
  "I complete the reschedule page with userId {int}, reason {string} and sensitivity {string}",
  async ({ ctx }, userId, reason, sensitivity) => {
    const page = ctx.base.page;
    const reschedulePage = new ReschedulePage(page);
    await reschedulePage.completePage(userId, reason, sensitivity);
    ctx.appointments.push({} as MpopArrangeAppointment);
    await page.waitForLoadState("networkidle");
    if (sensitivity === "Yes") {
      ctx.appointments[ctx.appointments.length - 1].sensitivity = "Yes";
      ctx.appointments[ctx.appointments.length - 1].sensitivityLocked = true;
    }
  },
);

Then(
  "I complete the reschedule page with userId {int}, reason {string}",
  async ({ ctx }, userId, reason) => {
    const page = ctx.base.page;
    const reschedulePage = new ReschedulePage(page);
    await reschedulePage.completePage(userId, reason, "", true);
    ctx.appointments.push({} as MpopArrangeAppointment);
    await page.waitForLoadState("networkidle");
    ctx.appointments[ctx.appointments.length - 1].sensitivity = "Yes";
    ctx.appointments[ctx.appointments.length - 1].sensitivityLocked = true;
  },
);

When(
  "I select the {string} link on the Reschedule Details page",
  async ({ ctx }, link: string) => {
    const page = ctx.base.page;
    const rescheduleDetailsPage = new RescheduleDetailsPage(page);
    await rescheduleDetailsPage.assertOnPage();
    await rescheduleDetailsPage.clickLink(link);
  },
);

When("I submit the rescheduled appointment", async ({ ctx }) => {
  const page = ctx.base.page;
  const rescheduleDetailsPage = new RescheduleDetailsPage(page);
  await rescheduleDetailsPage.assertOnPage();
  await rescheduleDetailsPage.submit();
});

Then(
  "I can see the correct information on the Reschedule Details page for a future appointment",
  async ({ ctx }) => {
    const page = ctx.base.page;
    const rescheduleDetailsPage = new RescheduleDetailsPage(page);
    await rescheduleDetailsPage.assertOnPage();
    await rescheduleDetailsPage.checkPageFuture(
      ctx.appointments[ctx.appointments.length - 1],
    );
  },
);

// When("I create another appointment", async ({ ctx }, data: DataTable) => {
//   const appointment: MpopArrangeAppointment = appointmentDataTable(
//     data,
//     true,
//   ) as MpopArrangeAppointment;
//   ctx.appointments.push(appointment);
//   await createAnotherAppointmentMPop(ctx.base.page, appointment);
// });

// Then(
//   "the sms text message confirmation and appointment added to your calendar text is displayed",
//   async ({ ctx }) => {
//     await expect(
//       ctx.base.page
//         .locator("p") // selects all <p> elements
//         .filter({
//           hasText:
//             "will receive a confirmation text message with the appointment details. This will also be logged as a contact on NDelius.",
//         }), // narrows down to the one containing your text
//     ).toBeVisible();
//     await expect(
//       ctx.base.page.locator('ul[data-qa="outlook-msg"] li'),
//     ).toContainText([
//       "your calendar",
//       "the NDelius contact log and officer diary, along with any supporting information",
//     ]);
//   },
// );

// Then(
//   "give the appointment details and your calendar text is displayed",
//   async ({ ctx }) => {
//     await expect(
//       ctx.base.page
//         .locator("p") // selects all <p> elements
//         .filter({ hasText: "You need to give" }), // narrows down to the one containing your text
//     ).toBeVisible();
//     await expect(
//       ctx.base.page.locator('ul[data-qa="outlook-msg"] li'),
//     ).toContainText([
//       "your calendar",
//       "the NDelius contact log and officer diary, along with any supporting information",
//     ]);
//   },
// );

// When(
//   "I make the following changes to appointment",
//   async ({ ctx }, data: DataTable) => {
//     const page = ctx.base.page;
//     const changes: MpopAppointmentChanges = appointmentDataTable(
//       data,
//       false,
//       true,
//     );
//     let appointment = ctx.appointments[ctx.appointments.length - 1];
//     const currentPast =
//       DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy") < today;
//     appointment = fullDetailsFromChanges(changes, appointment);
//     ctx.appointments[ctx.appointments.length - 1] = appointment;
//     const cyaPage = new CYAPage(page);
//     await cyaPage.assertOnPage();
//     const newPast =
//       DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy") < today;
//     await cyaPage.makeChanges(
//       changes,
//       appointment.typeId,
//       currentPast,
//       newPast,
//     );
//   },
// );
