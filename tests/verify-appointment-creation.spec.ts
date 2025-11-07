import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1 } from '../steps/test-data'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, mpopArrangeAppointment, mpopAttendee, mpopDateTime} from '../steps/mpop/appointments/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../steps/mpop/pages/appointments.page'


dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('Create Appointments Full', () => {
    test.beforeAll(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    await page.clock.setSystemTime(new Date('2030-11-11T10:00:00')) 
     ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Appointment - NoVisor + SimilarNextAppointment + FullNextAppointment', async () => {
    test.setTimeout(120_000)

    //navigate to start of arrange appointment pipeline
    await loginToManageMySupervision(page)
    const appointments = new AppointmentsPage(page)
    await appointments.goTo(crn)
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    //arrange appointment
    const dateTime: mpopDateTime = {
      date: "12/11/2030",
      startTime: "15:15",
      endTime: "16:15"
    }
    const attendee: mpopAttendee = {
      team: "N07T02",
      user: "AndyAdamczak1"
    }
    const appointmentNoVisor: mpopArrangeAppointment = {
      crn: crn,
      sentenceId: 0,
      typeId: 0,
      attendee: attendee,
      dateTime: dateTime,
      locationId: 0,
      note: "hello world",
      sensitivity: true
    }
    await createAppointmentMPop(page, appointmentNoVisor)

    //arrange another similar
    const dateTime_similar: mpopDateTime = {
        date: "13/11/2030",
        startTime: "15:15",
        endTime: "16:15"
    }
    await createSimilarAppointmentMPop(page, dateTime_similar, false)

    //arrange another
    const dateTime_another: mpopDateTime = {
        date: "14/11/2030",
        startTime: "15:15",
        endTime: "16:15"
    }
    const appointmentNoVisorNoAttendee: mpopArrangeAppointment = {
        crn: crn,
        sentenceId: 0,
        typeId: 0,
        dateTime: dateTime_another,
        locationId: 0,
        note: "hello world",
        sensitivity: false
    }
    await createAnotherAppointmentMPop(page, appointmentNoVisorNoAttendee)

    await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  
  })
})