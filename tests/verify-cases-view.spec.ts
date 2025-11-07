import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { loginMPoPAndGoToCases } from '../steps/mpop/personal-details/cases'
import { automatedTestUser1 } from '../steps/test-data'
import { mpopFormatDate, plus3Months } from '../steps/mpop/utils'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, mpopArrangeAppointment, mpopAttendee, mpopDateTime} from '../steps/mpop/appointments/create-appointment'
import { doUntil } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/refresh'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../steps/mpop/pages/appointments.page'
import caseUpcomingAppointmentsPage from '../steps/mpop/pages/appointments/upcoming-appointments.page'
import ActivityLogPage from '../steps/mpop/pages/activity-log.page.ts'


dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('Person Details Verification in Cases', () => {

  test.beforeAll(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    // Create an offender and Event in Delius
    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Verify Name, DOB, and Sentence of the person in Cases search results', async () => {
    // Login and navigate to Cases
    await loginMPoPAndGoToCases(page)

    // Search for the person by CRN
    await page.locator('#nameOrCrn').fill(crn)
    await page.getByRole('button', { name: 'Filter cases' }).click()

    // Verify that Name, DOB and Sentence are displayed correctly
    const fullName = `${person.lastName}, ${person.firstName}`
    await expect(page.locator('[data-qa="nameOrCrnValue1"]').first()).toContainText(fullName)
    await expect(page.locator('[data-qa="nameOrCrnValue1"]').first()).toContainText(crn)
    await expect(page.locator('[data-qa="dobValue1"]')).toContainText(mpopFormatDate(person.dob))
    await expect(page.locator('[data-qa="sentenceValue1"]')).toContainText(sentence.outcome)
  })


})

test.describe('Appointments', () => {
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

  test('Create Appointments', async () => {
    test.setTimeout(120_000)

    //navigate to start of arrange appointment pipeline
    await loginToManageMySupervision(page)

    const appointments = new AppointmentsPage(page)
    appointments.goTo(crn)
    appointments.checkOnPage()
    appointments.startArrangeAppointment()

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

  test('Appointments page', async() => {
    test.setTimeout(120_000)

    //navigate to appointments page
    await loginToManageMySupervision(page)
    const appointments = new AppointmentsPage(page)
    await appointments.goTo("X756510")
    await appointments.checkOnPage()

    //check link to upcoming appointments
    await appointments.viewUpcomingAppointments()
    const upcomingAppointments = new caseUpcomingAppointmentsPage(page)
    await upcomingAppointments.clickBackLink()

    //check link to past appointments
    await appointments.viewPastAppointments()
    const pastAppointments = new ActivityLogPage(page)
    await pastAppointments.checkOnPage()
  })
})

