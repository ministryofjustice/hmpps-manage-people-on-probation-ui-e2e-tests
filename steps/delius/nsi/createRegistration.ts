import { Page, expect } from '@playwright/test'
import { selectOption } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.mjs'
import {
  findOffenderByCRN
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender.mjs'
import { doUntil } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/refresh.mjs'

export const createRegistration = async (
    page: Page,
    crn: string,
    registerType: string,
    team: string,
    staff: string,
    category: string,
    level: string
): Promise<void> => {
  await findOffenderByCRN(page, crn)
  await page.locator('a', { hasText: 'Personal Details' }).click()
  await page.locator('a', { hasText: 'Registration Summary' }).click()
  await expect(page).toHaveTitle('Register Summary')
  await page.locator('input', { hasText: 'Add Registration' }).click()
  await expect(page).toHaveTitle('Add Registration')
  await selectOption(page, '#Trust\\:selectOneMenu', 'Wales') // Fixed as per current business rule
  await selectOption(page, '#RegisterType\\:selectOneMenu', registerType)
  await selectOption(page, '#Team\\:selectOneMenu', team)
  await selectOption(page, '#Staff\\:selectOneMenu', staff)
  await selectOption(page, '#Category\\:selectOneMenu', category)
  await selectOption(page, '#Level\\:selectOneMenu', level)
  const saveBtn = page.locator('input', { hasText: 'Save' })
  await doUntil(
      () => saveBtn.click(),
      () => expect(page.locator('tbody tr')).toContainText(registerType)
  )
}
