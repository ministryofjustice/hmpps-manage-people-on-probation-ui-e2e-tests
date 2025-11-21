import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import { attendee, testCrn } from '../../../steps/test-data'
import { MpopArrangeAppointment, MpopDateTime, setupAppointmentMPop} from '../../../steps/mpop/navigation/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../../../steps/mpop/pages/case/appointments.page'
import CYAPage from '../../../steps/mpop/pages/appointments/CYA.page'
import SentencePage from '../../../steps/mpop/pages/appointments/sentence.page'
import TypeAttendancePage from '../../../steps/mpop/pages/appointments/type-attendance.page'
import LocationDateTimePage from '../../../steps/mpop/pages/appointments/location-datetime.page'
import { luxonString, plus3Months, tomorrow } from '../../../steps/mpop/utils'
import { navigateToAppointments } from '../../../steps/mpop/navigation/case-navigation'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string = testCrn
let isVisor: boolean = true
let browser: Browser
let context: BrowserContext
let page: Page

//navigate to CYA page - noVisor
const dateTime: MpopDateTime = {
  date: luxonString(plus3Months),
  startTime: "15:15",
  endTime: "16:15"
}
const appointment: MpopArrangeAppointment = {
  crn: crn,
  sentenceId: 0,
  typeId: 0,
  isVisor: isVisor,
  attendee: attendee,
  dateTime: dateTime,
  locationId: 0,
  note: "hello world",
  sensitivity: true
}

test.describe('CYA page', () => {
  test.beforeEach(async ({ browser: b }) => {
    test.setTimeout(360000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

    //navigate to start of arrange appointment pipeline
    const appointments : AppointmentsPage = await navigateToAppointments(page, testCrn)
    await appointments.checkOnPage()
    await appointments.startArrangeAppointment()

    await setupAppointmentMPop(page, appointment)
  })

  test.afterEach(async () => {
    await context.close()
  })

  test('Validate appointment details', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)

    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Appointment for"), "CJA - Community Order (6 Months)")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Appointment type"), "Planned office visit (NS)")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("VISOR report"), "Yes")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Attending"), "Andy Adamczak (NPS - Other) (OMU B, London)")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Location"), "208 Lewisham High Street")
    //await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Date and time"), /from (.*) to/)
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Supporting information"), "hello world")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Sensitivity"), "Yes")
  })

  test('Check CYA page links', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)
    
    //check each change link and return
    const total = isVisor != undefined ? 8 : 7
    for (let i=0; i< total; i+=1){
      const targetPage = await cyaPage.clickChangeLink(i, isVisor)
      await targetPage.clickBackLink()
    }
    await cyaPage.checkOnPage()
  })

  test('Update to person level contact', async() => {
    test.setTimeout(120_000)

    const cyaPage = new CYAPage(page)
    const sentencePage = await cyaPage.clickChangeLink(0) as SentencePage
    await sentencePage.completePage(6)
    //next page is type as previous value no longer valid
    const typeAttendancePage = new TypeAttendancePage(page)
    await typeAttendancePage.clickBackLink()

    //check for the missing change link    
    expect(await cyaPage.getSummaryRowByKey("Location")).toBeUndefined()

    //fill in missing values
    await cyaPage.clickChangeLink(1)
    await typeAttendancePage.completePage(0)
    const locationDateTimePage = new LocationDateTimePage(page)
    await locationDateTimePage.completePage(undefined, 0)
    await cyaPage.checkOnPage()

    //check results
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Appointment for"), "James")
    await cyaPage.checkSummaryRowValue(await cyaPage.getSummaryRowByKey("Appointment type"), "Planned doorstep contact (NS)")
  })
})
