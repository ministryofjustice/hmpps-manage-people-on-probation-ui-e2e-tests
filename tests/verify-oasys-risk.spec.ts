import { Browser, BrowserContext, expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.js'
import loginDeliusAndCreateOffender from '../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1 } from '../steps/test-data'
import { login as mpopLogin } from '../steps/mpop/login'
import {
  mpopLongMonthFormat, mpopShortMonthFormat,
  plus3Months,
  plus6Months,
  today,
} from '../steps/mpop/utils'
import { login as oasysLogin } from '../steps/oasys/login'
import { createLayer3CompleteAssessment } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { signAndlock } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/oasys/layer3-assessment/sign-and-lock'
import createNSI from '../steps/delius/nsi/createNSI'
import { createRegistration } from '../steps/delius/nsi/createRegistration'

dotenv.config({ path: '.env' })

let crn: string
let person: Person
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('MPoP Risk Page - View OASys assessments', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(360000)
    context = await browser.newContext()
    page = await context.newPage()

    // Create a Person and Event
    ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
    awaitcreateCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

    // Create a Mappa registration & NSI
    await createRegistration(page, crn, 'MAPPA', 'Automated Allocation Team', 'AutomatedTestUser, AutomatedTestUser (PS - PSO)', 'MAPPA Cat 4', 'MAPPA Level 3')
    await createNSI(page, crn, 'NPS North West', 'OPD Community Pathway', 'OPD Community Pathway', 'Pending Consultation')

    // Create a layer 3 assessment in OASys
    await oasysLogin(page)
    await createLayer3CompleteAssessment(page, crn, person, 'Yes', undefined, true)
    await signAndlock(page)
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('Verify Risk details of a Person on Probation are as per NDelius and OASys', async () => {
    test.setTimeout(50000)

    // Login to MPoP and navigate to Risk Page
    await mpopLogin(page)
    await page.getByRole('link', { name: 'Cases', exact: true }).click()
    await page.getByRole('textbox', { name: 'Name or CRN' }).fill(crn)
    await page.getByRole('button', { name: 'Filter cases' }).click();
    await page.locator(`[href$="${crn}"]`).click()
    await page.getByRole('link', { name: 'Risk', exact: true }).click();
    await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Risk")

    // Verify the Criminogenic needs
    const highNeeds = ['Thinking and Behaviour']
    const lowNeeds = ['Lifestyle and Associates', 'Drug Misuse']
    const noScoreNeeds = ['Accommodation', 'Education, Training and Employability', 'Relationships', 'Alcohol Misuse', 'Attitudes']
    for (const need of highNeeds) await expect(page.locator('[data-qa="highScoringNeedsValue"]')).toContainText(need)
    for (const need of lowNeeds) await expect(page.locator('[data-qa="lowScoringNeedsValue"]')).toContainText(need)
    for (const need of noScoreNeeds) await expect(page.locator('[data-qa="noScoreNeedsValue"]')).toContainText(need)

    // Verify the Risk flags
    const riskFlags = [
      {
        desc: 'MAPPA',
        level: 'High',
        notes: 'Please Note - Category 3 offenders',
        date: today.toJSDate(),
        review: plus3Months.toJSDate(),
      },
      {
        desc: 'Risk to Children',
        level: 'High',
        notes: 'The OASys assessment of Start custody',
        date: today.toJSDate(),
        review: plus3Months.toJSDate(),
      },
      {
        desc: 'Risk to Staff',
        level: 'High',
        notes: 'The OASys assessment of Start custody',
        date: today.toJSDate(),
        review: plus6Months.toJSDate(), // removed minus({ days: 1 })
      },
      {
        desc: 'Very High RoSH',
        level: 'High',
        notes: 'No notes',
        date: today.toJSDate(),
        review: plus6Months.toJSDate(),
      },
      {
        desc: 'Risk to Known Adult',
        level: 'Medium',
        notes: 'The OASys assessment of Start custody',
        date: today.toJSDate(),
        review: plus6Months.toJSDate(),
      },
      {
        desc: 'Risk to Public',
        level: 'Medium',
        notes: 'The OASys assessment of Start custody',
        date: today.toJSDate(),
        review: plus6Months.toJSDate(),
      },
    ]

    for (let i = 0; i < riskFlags.length; i++) {
      const idx = i + 1
      const { level, desc, notes, date, review } = riskFlags[i]
      await expect(page.locator(`[data-qa="risk${idx}LevelValue"]`)).toContainText(level)
      await expect(page.locator(`[data-qa="risk${idx}DescriptionValue"]`)).toContainText(desc)
      await expect(page.locator(`[data-qa="risk${idx}NotesValue"]`)).toContainText(notes)
      await expect(page.locator(`[data-qa="risk${idx}DateAddedValue"]`)).toContainText(mpopLongMonthFormat(date))
      await expect(page.locator(`[data-qa="risk${idx}NextReviewDateValue"]`)).toHaveText(mpopLongMonthFormat(review), { useInnerText: true })
    }

    //  Verify the OPD eligibility
    await expect(page.locator('[data-qa="ogp-missing"]')).toContainText("Eligible")

    //  Verify the RoSH Scores
    const expectedRoSH = {
      'Staff': 'Medium',
      'Known adult': 'High',
      'Public': 'Medium',
      'Children': 'Very high',
    }

    const rows = page.locator('[data-qa^="riskToLabelValue"]')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      const label = await page.locator(`[data-qa="riskToLabelValue${i + 1}"]`).textContent()
      const value = await page.locator(`[data-qa="riskToCommunityValue${i + 1}"]`).textContent()
      const cleanLabel = label?.trim()
      const cleanValue = value?.trim()
      expect(cleanValue).toBe(expectedRoSH[cleanLabel as keyof typeof expectedRoSH])
    }

    // Verify the MAPPA Widget
    await expect(page.locator('.mappa-widget')).toContainText("Cat 4/Level 3 MAPPA")
    await expect(page.locator('.mappa-widget')).toContainText("Multi-agency public protection arrangements")
    console.log('Formatted date:', mpopShortMonthFormat(today.toJSDate()))
    await expect(page.locator('.mappa-widget [class$="govuk-hint"]')).toContainText(
        `Last updated (NDelius): ${mpopShortMonthFormat(today.toJSDate())}`
    )
  })
})
