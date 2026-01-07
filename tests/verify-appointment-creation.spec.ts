import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { attendee, automatedTestUser1 } from '../steps/test-data'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, MpopArrangeAppointment, MpopAttendee, MpopDateTime} from '../steps/mpop/navigation/create-appointment'
import AppointmentsPage from '../steps/mpop/pages/case/appointments.page'
import { luxonString, plus3Months, plus6Months, today, tomorrow } from '../steps/mpop/utils'
import { navigateToAppointments } from '../steps/mpop/navigation/case-navigation'
import {login} from "../steps/mpop/login";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let browser: Browser
let context: BrowserContext
let page: Page
let person: Person
let sentence: CreatedEvent

test.describe.configure({ mode: 'serial' });
test.describe('Create Appointments Full', { tag: ['@smoke', '@appointments'] }, () => {
  test.beforeAll(async ({browser: b}) => {
      browser = b
      context = await browser.newContext()
      page = await context.newPage()

      await login(page)
      ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
      sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

  })

  test.afterEach(async () => {
    await context.close()
  })

  test('Appointment + SimilarNextAppointment + FullNextAppointment', async () => {

    //navigate to start of arrange appointment pipeline
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

    //arrange another similar
    const dateTime_similar: MpopDateTime = {
        date: luxonString(plus3Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(page, dateTime_similar, false)

    //arrange another
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

    await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  
  })

  //CURRENTLY BROKEN - can't create appointments with no location
  // test('Appointment - NoLocation', async () => {
  //   test.setTimeout(120_000)

  //   //navigate to start of arrange appointment pipeline
  //   await loginToManageMySupervision(page)
  //   const appointments = new AppointmentsPage(page)
  //   await appointments.goTo(crn)
  //   await appointments.checkOnPage()
  //   await appointments.startArrangeAppointment()

  //   //arrange appointment
  //   const dateTime: MpopDateTime = {
  //     date: "13/11/2030",
  //     startTime: "15:15",
  //     endTime: "16:15"
  //   }
  //   const appointmentNoLocation: MpopArrangeAppointment = {
  //     crn: crn,
  //     sentenceId: 0,
  //     typeId: 1,
  //     dateTime: dateTime,
  //     locationId: 2,
  //     note: "hello world",
  //     sensitivity: true
  //   }
  //   await createAppointmentMPop(page, appointmentNoLocation)
  // })
})