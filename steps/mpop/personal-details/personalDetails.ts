import { Page, expect, Locator } from '@playwright/test'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'

export const loginMPoPAndGoToPersonalDetails = async (page: Page, crn: string) => {
  await loginToManageMySupervision(page)
  await searchForCrn(page, crn)
  await page.getByRole('link', { name: 'Personal details' }).first().click()
}

export const searchForCrn = async (page: Page, crn: string) => {
  await page.locator('#search').fill(crn)
  await page.getByRole('button', { name: 'Search' }).click()
  await page.locator(`[href$="${crn}"]`).click()
  await expect(page).toHaveTitle('Overview - Manage people on probation')
}

export const assertAddressDetails = async (
  page: Page,
  locator: Locator,
  address: { buildingNumber: string; street: string; cityName: string; county: string; zipCode: string },
) => {
  await expect(locator).toContainText(`${address.buildingNumber} ${address.street}`)
  await expect(locator).toContainText(address.cityName)
  await expect(locator).toContainText(address.county)
  await expect(locator).toContainText(address.zipCode)
}
