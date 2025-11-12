import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1, testCrn } from '../steps/test-data'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, mpopArrangeAppointment, mpopAttendee, mpopDateTime} from '../steps/mpop/appointments/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../steps/mpop/pages/appointments.page'
import { luxonString, plus3Months, plus6Months, today, tomorrow } from '../steps/mpop/utils'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('Create Appointments Full', () => {
    test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterEach(async () => {
    await context.close()
  })

  test('Appointment + SimilarNextAppointment + FullNextAppointment', async () => {
    test.setTimeout(360_000)

    //navigate to start of arrange appointment pipeline
    await loginToManageMySupervision(page)
    const appointments = new AppointmentsPage(page)
    await appointments.goTo(crn)
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    //arrange appointment
    const dateTime: mpopDateTime = {
      date: luxonString(tomorrow),
      startTime: "15:15",
      endTime: "16:15"
    }
    const attendee: mpopAttendee = {
      team: "N07T02",
      user: "AndyAdamczak1"
    }
    const appointment: mpopArrangeAppointment = {
      crn: crn,
      sentenceId: 0,
      typeId: 0,
      isVisor: true,
      attendee: attendee,
      dateTime: dateTime,
      locationId: 0,
      note: "hello world",
      sensitivity: true
    }
    await createAppointmentMPop(page, appointment)

    //arrange another similar
    const dateTime_similar: mpopDateTime = {
        date: luxonString(plus3Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(page, dateTime_similar, false)

    //arrange another
    const dateTime_another: mpopDateTime = {
        date: luxonString(plus6Months),
        startTime: "15:15",
        endTime: "16:15"
    }
    const appointmentNoAttendee: mpopArrangeAppointment = {
        crn: crn,
        sentenceId: 0,
        typeId: 0,
        isVisor: true,
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
  //   const dateTime: mpopDateTime = {
  //     date: "13/11/2030",
  //     startTime: "15:15",
  //     endTime: "16:15"
  //   }
  //   const appointmentNoLocation: mpopArrangeAppointment = {
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