import { Page, expect, Locator } from '@playwright/test'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login'

export const loginMPoPAndGoToCases = async (page: Page) => {
  await loginToManageMySupervision(page)
  await page.getByRole('link', { name: 'Cases', exact: true }).click();
  await expect(page.locator('h1.govuk-heading-l')).toContainText('Cases')
}

