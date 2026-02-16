import { expect, Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd';
import { attendee } from '../../util/Data'
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { luxonString, MpopDateTime, plus3Months, plus6Months, tomorrow } from '../../util/DateTime'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopArrangeAppointment } from '../../util/ArrangeAppointment'
import { testContext } from '../../features/Fixtures';

const { Given, When, Then } = createBdd(testContext);

When('I create an appointment', async ({ ctx }) => {
    const page = ctx.base.page
    const crn = ctx.case.crn
    const appointments: AppointmentsPage = new AppointmentsPage(page, crn)
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
      text: false,
      note: "hello world",
      sensitivity: true
    }
    await createAppointmentMPop(page, appointment)
});

When('I create a similar appointment', async ({ ctx }) => {
    const dateTime_similar: MpopDateTime = {
        date: luxonString(plus3Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(ctx.base.page, dateTime_similar, false, false)
});

When('I create another appointment', async ({ ctx }) => {
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
        text: false,
        note: "hello world",
        sensitivity: false
    }
    await createAnotherAppointmentMPop(ctx.base.page, appointmentNoAttendee)
});

Then('the appointment should be created successfully', async ({ ctx }) => {
    await expect(ctx.base.page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")
});