import { expect, Page } from "@playwright/test";
import AttendancePage from "./attendance.page";
import SentencePage from "./sentence.page";
import TypeAttendancePage from "./type-attendance.page";
import LocationDateTimePage from "./location-datetime.page";
import SupportingInformationPage from "./supporting-information.page";
import ContactPage from "../Contacts/contact.page";
import { MpopArrangeAppointment } from "../../../../util/ArrangeAppointment";
import TextConfirmationPage from "./text-confirmation-page";

export default class CYAPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Check your answers then confirm the appointment", crn, uuid);
  }

  async checkSentenceType(sentence: string) {
    await this.checkRow("Appointment for", sentence);
  }
  async checkType(type: string) {
    await this.checkRow("Appointment type", type);
  }
  async checkVisor(visor: string) {
    await this.checkRow("VISOR report", visor);
  }
  async checkLocation(location: string) {
    if (location === "I do not need to pick a location") {
      location = "Not required";
    }
    await this.checkRow("Location", location);
  }
  async checkMessage(message: string, mobile?: string) {
    await this.checkRow("Text message confirmation", message);
    if (mobile) {
      await this.checkRow("Text message confirmation", mobile);
    }
  }
  async checkNotes(note?: string) {
    await this.checkRow("Supporting information", note ?? "Not entered");
  }
  async checkSensitivity(sensitivity: string) {
    await this.checkRow("Sensitivity", sensitivity);
  }

  async checkRow(row: string, value: string, link: boolean = true) {
    if (link) {
      expect(
        (await this.getSummaryRowByKey(row)).getByRole("link"),
      ).toBeVisible();
    }
    expect(await this.getSummaryRowByKey(row)).toContainText(value);
  }

  async checkPageFuture(
    details: MpopArrangeAppointment,
    multipleSentences: boolean = false,
  ) {
    if (multipleSentences) {
      await this.checkSentenceType(details.sentence);
    }
    await this.checkType(details.type);
    if (details.isVisor) {
      await this.checkVisor(details.isVisor);
    }
    //this.checkAttending(details.attendee)
    await this.checkLocation(details.location);
    //this.checkDateTIme(details.dateTime)
    await this.checkMessage(details.text, details.mobile);
    await this.checkNotes(details.note);
    await this.checkSensitivity(details.sensitivity);
  }

  async checkPagePast(
    details: MpopArrangeAppointment,
    multipleSentences: boolean = false,
  ) {
    if (multipleSentences) {
      await this.checkSentenceType(details.sentence);
    }
    await this.checkType(details.type);
    if (details.isVisor) {
      await this.checkVisor(details.isVisor);
    }
    //this.checkAttending(details.attendee)
    await this.checkLocation(details.location);
    //this.checkDateTIme(details.dateTime)
    await this.checkNotes(details.note);
    await this.checkSensitivity(details.sensitivity);
  }

  async completePage(isVisor: boolean = false, past: boolean = false) {
    const rows = [
      "Appointment for",
      "Appointment type",
      ...(isVisor ? ["VISOR report"] : []),
      "Attending",
      "Location",
      "Date and time",
      ...(past ? ["Attended and complied"] : ["Text message confirmation"]),
      "Supporting information",
      "Sensitivity",
    ];
    for (let i = 0; i < rows.length; i += 1) {
      await this.checkSummaryRowKey(await this.getSummaryRowByID(i), rows[i]);
    }
    await this.submit();
  }

  async clickChangeLink(id: number, isVisor?: boolean) {
    await this.clickSummaryAction(id);
    const pages = [
      SentencePage,
      TypeAttendancePage,
      ...(isVisor != undefined ? [TypeAttendancePage] : []),
      AttendancePage,
      LocationDateTimePage,
      LocationDateTimePage,
      TextConfirmationPage,
      SupportingInformationPage,
      SupportingInformationPage,
    ];
    const page = new pages[id](this.page);
    return page;
  }

  // async makeChanges(
  //   changes: MpopAppointmentChanges,
  //   typeId: number,
  //   currentPast: boolean,
  //   newPast: boolean,
  //   isVisor?: boolean,
  // ) {
  //   const rows = [
  //     "Appointment for",
  //     "Appointment type",
  //     ...(isVisor ? ["VISOR report"] : []),
  //     "Attending",
  //     "Location",
  //     "Date and time",
  //     ...(currentPast
  //       ? ["Attended and complied"]
  //       : ["Text message confirmation"]),
  //     "Supporting information",
  //     "Sensitivity",
  //   ];
  //   let autoRedirected = false;
  //   if (changes.sentenceId) {
  //     await this.clickSummaryAction(rows.indexOf("Appointment for"));
  //     const sentencePage = new SentencePage(this.page);
  //     await sentencePage.assertOnPage();
  //     await sentencePage.completePage(changes.sentenceId);
  //     const returned = await this.checkOnPage();
  //     if (!returned) {
  //       const typeAttendancePage = new TypeAttendancePage(this.page);
  //       await typeAttendancePage.assertOnPage();
  //       autoRedirected = true;
  //     }
  //   }
  //   if (changes.typeId || changes.attendee || changes.isVisor) {
  //     if (!autoRedirected) {
  //       if (changes.typeId) {
  //         await this.clickSummaryAction(rows.indexOf("Appointment for"));
  //       } else if (changes.isVisor) {
  //         await this.clickSummaryAction(rows.indexOf("VISOR report"));
  //       } else if (changes.attendee) {
  //         await this.clickSummaryAction(rows.indexOf("Attending"));
  //       }
  //     } else {
  //       autoRedirected = false;
  //     }
  //     const typeAttendancePage = new TypeAttendancePage(this.page);
  //     await typeAttendancePage.assertOnPage();
  //     await typeAttendancePage.changePage(
  //       changes.typeId,
  //       changes.attendee,
  //       changes.isVisor,
  //     );
  //     const returned = await this.checkOnPage();
  //     if (!returned) {
  //       const locationDateTimePage = new LocationDateTimePage(this.page);
  //       await locationDateTimePage.assertOnPage();
  //       autoRedirected = true;
  //     }
  //   }
  //   if (changes.locationId || changes.dateTime) {
  //     if (!autoRedirected) {
  //       if (changes.locationId) {
  //         await this.clickSummaryAction(rows.indexOf("Location"));
  //       } else if (changes.dateTime) {
  //         await this.clickSummaryAction(rows.indexOf("Date and time"));
  //       }
  //     } else {
  //       autoRedirected = false;
  //     }
  //     const locationDateTimePage = new LocationDateTimePage(this.page);
  //     await locationDateTimePage.assertOnPage();
  //     let locationId = undefined;
  //     if (changes.locationId) {
  //       locationId = await locationDateTimePage.findLocationId(
  //         typeId,
  //         changes.locationId,
  //       );
  //     }
  //     await locationDateTimePage.completePage(changes.dateTime, locationId);
  //     const returned = await this.checkOnPage();
  //     if (!returned) {
  //       if (newPast) {
  //         const attendedCompliedPage = new AttendedCompliedPage(this.page);
  //         await attendedCompliedPage.assertOnPage();
  //       } else {
  //         const textConfirmationPage = new TextConfirmationPage(this.page);
  //         await textConfirmationPage.assertOnPage();
  //       }
  //       autoRedirected = true;
  //     }
  //   }
  //   if (changes.text) {
  //     if (!autoRedirected) {
  //       await this.clickSummaryAction(
  //         rows.indexOf("Text message confirmation"),
  //       );
  //     } else {
  //       autoRedirected = false;
  //     }
  //     const textConfirmationPage = new TextConfirmationPage(this.page);
  //     await textConfirmationPage.assertOnPage();
  //     await textConfirmationPage.completePage(
  //       changes.text,
  //       changes.mobile!,
  //       changes.dateTime!.date,
  //       changes.dateTime!.startTime,
  //     );
  //     const returned = await this.checkOnPage();
  //     if (!returned) {
  //       if (newPast) {
  //         const supportingInformationPage = new SupportingInformationPage(
  //           this.page,
  //         );
  //         await supportingInformationPage.assertOnPage();
  //       } else {
  //         const addNotePage = new AddNotePage(this.page);
  //         await addNotePage.assertOnPage();
  //       }
  //       autoRedirected = true;
  //     }
  //   } else if (!currentPast && newPast && autoRedirected) {
  //     const attendedCompliedPage = new AttendedCompliedPage(this.page);
  //     await attendedCompliedPage.assertOnPage();
  //     await attendedCompliedPage.completePage();
  //     autoRedirected = true;
  //   }
  //   if (changes.note || changes.sensitivity) {
  //     if (!autoRedirected) {
  //       if (changes.note) {
  //         await this.clickSummaryAction(rows.indexOf("Supporting information"));
  //       } else if (changes.sensitivity) {
  //         await this.clickSummaryAction(rows.indexOf("Sensitivity"));
  //       }
  //     }
  //     if (newPast) {
  //       const addNotePage = new AddNotePage(this.page);
  //       await addNotePage.assertOnPage();
  //       await addNotePage.changePage(changes.sensitivity, changes.note);
  //     } else {
  //       const supportingInformationPage = new SupportingInformationPage(
  //         this.page,
  //       );
  //       await supportingInformationPage.assertOnPage();
  //       await supportingInformationPage.changePage(
  //         changes.sensitivity,
  //         changes.note,
  //       );
  //     }
  //   }
  // }
}
