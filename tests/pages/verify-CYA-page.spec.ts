import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1 } from '../../steps/test-data'
import { mpopArrangeAppointment, mpopAttendee, mpopDateTime, setupAppointmentMPop} from '../../steps/mpop/appointments/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../../steps/mpop/pages/appointments.page'
import CYAPage from '../../steps/mpop/pages/appointments/CYA.page'
import SentencePage from '../../steps/mpop/pages/appointments/sentence.page'
import TypeAttendancePage from '../../steps/mpop/pages/appointments/type-attendance.page'
import LocationDateTimePage from '../../steps/mpop/pages/appointments/location-datetime.page'

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

  test('Validate appointment details', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)

    await cyaPage.checkSummaryRowValue(0, "Adult Custody < 12m (6 Months)")
    await cyaPage.checkSummaryRowValue(1, "Planned office visit (NS)")
    await cyaPage.checkSummaryRowValue(2, "Andy Adamczak (NPS - Other) (OMU B, London)")
    await cyaPage.checkSummaryRowValue(3, "208 Lewisham High Street")
    await cyaPage.checkSummaryRowValue(4, "12 November 2030 from 15:15 to 16:15")
    await cyaPage.checkSummaryRowValue(5, "hello world")
    await cyaPage.checkSummaryRowValue(6, "Yes")
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

  test('Update to person level contact', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)
    const sentencePage = await cyaPage.clickChangeLink(0) as SentencePage
    await sentencePage.completePage(1)
    //next page is type as previous value no longer valid
    const typeAttendancePage = new TypeAttendancePage(page)
    await typeAttendancePage.clickBackLink()

    //check for the missing change link    
    await cyaPage.checkEmptySummaryRowAction(4)

    //fill in missing values
    await cyaPage.clickChangeLink(1)
    await typeAttendancePage.completePage(0)
    const locationDateTimePage = new LocationDateTimePage(page)
    await locationDateTimePage.completePage(undefined, 0)
    await cyaPage.checkOnPage()

    //check results
    await cyaPage.checkSummaryRowValue(0, person.firstName)
    await cyaPage.checkSummaryRowValue(1, "Planned doorstep contact (NS)")
  })
})
