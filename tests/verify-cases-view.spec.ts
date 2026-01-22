import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { testUser } from '../steps/test-data'
import { mpopFormatDate } from '../steps/mpop/utils'
import { navigateToCases } from '../steps/mpop/navigation/base-navigation'
import {login} from "../steps/mpop/login";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('Person Details Verification in Cases', () => {

  test.beforeAll(async ({ browser: b }) => {
    browser = b
    context = await browser.newContext()
    page = await context.newPage()
    await login(page)
    // Create an offender and Event in Delius
    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', testUser, data.teams.allocationsTestTeam)
    sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Verify Name, DOB, and Sentence of the person in Cases search results', async () => {
    // Login and navigate to Cases
    await navigateToCases(page)

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
