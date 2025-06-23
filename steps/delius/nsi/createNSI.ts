import { Page, expect } from '@playwright/test'
import { selectOption } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs'
import { retryOnError } from '../utils/utils'
import { DateTime } from 'luxon';
import {
    DeliusDateFormatter
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/date-time'
import {
  findOffenderByCRN
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender'

export const createNSI = async (
    page: Page,
    crn: string,
    NsiProvider: string,
    NsiType: string,
    NsiSubType: string,
    Status: string
) => {
  return retryOnError(async innerPage => {
    await findOffenderByCRN(page, crn)
    await page.locator('#navigation-include\\:linkNavigation2OffenderIndex').click()
    await page.click('#navigation-include\\:linkNavigation3OffenderNsi')
    await expect(page).toHaveTitle(/Non Statutory Intervention List/)
    await innerPage.locator('[value="Add Non Statutory Intervention"]').click()
    await selectOption(page, '#NsiProvider\\:selectOneMenu', NsiProvider)
    await selectOption(page, '#NsiType\\:selectOneMenu', NsiType)
    await selectOption(page, '#NsiSubType\\:selectOneMenu', NsiSubType)
    const now = DateTime.now().minus({ minutes: 1 })
    const today = DeliusDateFormatter(now.toJSDate())
    const timeStr = now.toFormat('HH:mm')
    await page.locator('#ReferralDate\\:datePicker').fill(today)
    await selectOption(page, '#Status\\:selectOneMenu', Status)
    await page.locator('#StatusDate\\:datePicker').clear()
    await page.locator('#StatusDate\\:datePicker').fill(today)
    await page.locator('#StatusTime\\:timePicker').fill(timeStr)
    await innerPage.locator('[value="Save"]').click()
    await expect(innerPage).toHaveTitle('Non Statutory Intervention List')
  }, page)
}

export default createNSI
