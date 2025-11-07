import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1 } from '../steps/test-data'
import { mpopArrangeAppointment, mpopAttendee, mpopDateTime, setupAppointmentMPop} from '../steps/mpop/appointments/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../steps/mpop/pages/appointments.page'
import CYAPage from '../steps/mpop/pages/appointments/CYA.page'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('CYA page', () => {
    test.beforeAll(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    await page.clock.setSystemTime(new Date('2030-11-11T10:00:00')) 
     ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
  
    //navigate to start of arrange appointment pipeline
    await loginToManageMySupervision(page)

    const appointments = new AppointmentsPage(page)
    await appointments.goTo(crn)
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    //navigate to CYA page - noVisor
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
    await setupAppointmentMPop(page, appointmentNoVisor)
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Check CYA page links', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)
    
    //check each change link and return
    for (let i=0; i<7; i+=1){
      const page = await cyaPage.clickChangeLink(i)
      await page.clickBackLink()
    }
    await cyaPage.checkOnPage()
  })
})
