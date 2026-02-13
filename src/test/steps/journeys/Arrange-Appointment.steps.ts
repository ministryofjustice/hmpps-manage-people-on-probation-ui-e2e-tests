import { Browser, BrowserContext, expect, Page } from '@playwright/test'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { createBdd } from 'playwright-bdd';
import { attendee, testUser } from '../../util/Data'
import AppointmentsPage from '../../pageObjects/Case/appointments.page'
import { luxonString, MpopDateTime, plus3Months, plus6Months, tomorrow } from '../../util/DateTime'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopArrangeAppointment } from '../../util/ArrangeAppointment'
import { login } from '../../util/Login';
import loginDeliusAndCreateOffender from '../../util/Delius';
import { getBrowserContext } from '../../util/Common';

const { Given, When, Then } = createBdd();

let crn: string
let browser: Browser
let context: BrowserContext
let page: Page

Given('A new offender has been created', async ({ browser: b }) => {
    browser = b
    context = await browser.newContext(getBrowserContext('appointments'))
    page = await context.newPage()
    console.time("loginDeliusAndCreateOffender-appointments")
    crn = (await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam))[1]
    console.timeEnd("loginDeliusAndCreateOffender-appointments")
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
});

Given('I am logged in', async () => {
    await login(page)
});

When('I create an appointment', async () => {
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
      note: "hello world",
      sensitivity: true
    }
    await createAppointmentMPop(page, appointment)
});

When('a similar appointment', async () => {
    const dateTime_similar: MpopDateTime = {
        date: luxonString(plus3Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(page, dateTime_similar, false)
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
    await createAnotherAppointmentMPop(page, appointmentNoAttendee)
});

Then('the appointment should be created successfully', async () => {
    await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")
    await context.close()
});