import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { loginMPoPAndGoToCases } from '../steps/mpop/personal-details/cases'
import { automatedTestUser1 } from '../steps/test-data'
import { mpopFormatDate, plus3Months } from '../steps/mpop/utils'
import { Attendee, createAppointmentMPop, mpopDateTime} from '../steps/mpop/appointments/create-appointment'

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

test.describe('Create an appointment', () => {
    test.beforeAll(async ({ browser: b }) => {
    test.setTimeout(120000)
    browser = b
    context = await browser.newContext()
    page = await context.newPage()

     ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Create an Appointment', async () => {
    test.setTimeout(120_000)
    const dateTime: mpopDateTime = {
      date: "12/11/2025",
      startTime: "15:15",
      endTime: "16:15"
    }
    const dateTime_another: mpopDateTime = {
      date: "13/11/2025",
      startTime: "15:15",
      endTime: "16:15"
    }
    const attendee: Attendee = {
      team: "N07T02",
      user: "AndyAdamczak1"
    }
    await createAppointmentMPop(page, crn, 0, 0, dateTime, 0, "hello world", true, 0, dateTime_another, "hello world 2", false, attendee)
  })
})

