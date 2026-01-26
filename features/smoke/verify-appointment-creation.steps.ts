import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { attendee, testUser } from '../../steps/test-data'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopArrangeAppointment, MpopAttendee, MpopDateTime} from '../../steps/mpop/navigation/create-appointment'
import AppointmentsPage from '../../steps/mpop/pages/case/appointments.page'
import { luxonString, plus3Months, plus6Months, today, tomorrow } from '../../steps/mpop/utils'
import { navigateToAppointments } from '../../steps/mpop/navigation/case-navigation'
import {login} from "../../steps/mpop/login";
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let browser: Browser
let context: BrowserContext
let page: Page
let person: Person
let sentence: CreatedEvent

Given('I am logged in', async ({ browser: b }) => {
    browser = b
    context = process.env.LOCAL ? await browser.newContext({ recordVideo: { dir: 'videos/' } }) : await browser.newContext()
    page = await context.newPage()
    await login(page)
});

Given('a new offender has been created', async () => {
    [person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
});

When('I create an appointment', async () => {
    const appointments : AppointmentsPage = await navigateToAppointments(page, crn)
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
