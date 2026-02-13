import { expect, Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd';
import { attendee } from '../../utilities/Data'
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { luxonString, MpopDateTime, plus3Months, plus6Months, tomorrow } from '../../utilities/DateTime'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopArrangeAppointment } from '../../utilities/ArrangeAppointment'

const { Given, When, Then } = createBdd();

let crn: string
let page: Page

When('I create an appointment', async () => {
    const appointments: AppointmentsPage = new AppointmentsPage(page!, crn!)
    await appointments.navigateTo()
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    //arrange appointment
    const dateTime: MpopDateTime = {
      date: luxonString(tomorrow),
      startTime: "15:15",
      endTime: "16:15"
    }
    const appointment: MpopArrangeAppointment = {
      sentenceId: 0,
      typeId: 0,
      attendee: attendee,
      dateTime: dateTime,
      locationId: 0,
      note: "hello world",
      sensitivity: true
    }
    await createAppointmentMPop(page!, appointment)
});

When('a similar appointment', async () => {
    const dateTime_similar: MpopDateTime = {
        date: luxonString(plus3Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(page!, dateTime_similar, false)
});

When('another appointment', async () => {
    const dateTime_another: MpopDateTime = {
        date: luxonString(plus6Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    const appointmentNoAttendee: MpopArrangeAppointment = {
        sentenceId: 0,
        typeId: 0,
        dateTime: dateTime_another,
        locationId: 0,
        note: "hello world",
        sensitivity: false
    }
    await createAnotherAppointmentMPop(page!, appointmentNoAttendee)
});

Then('the appointment should be created successfully', async () => {
    await expect(page!.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")
});