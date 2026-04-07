import { login } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import {createBdd} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import {expect, Page} from "@playwright/test";
import {
    dismissModals,
    findOffenderByCRN
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender";


const { Given, When, Then } = createBdd(testContext);

When('I delete offender with CRNs', async ({ page }) => {
   const crns = process.env.CRNS

    await login(page)
    for (const [index, crn] of crns.split(',').entries()) {
        console.log(`Deleting offender with CRN: ${crn}`)
        if (index === 0) {
            await findOffenderByCRN(page, crn)
            await deleteOffender(page, crn)
        } else {
            await expect(page).toHaveTitle(/National Search/)
            await page.getByRole('button', { name: 'Clear Search Fields' }).click()
            await expect(
                page.getByText('No records found.')
            ).toBeHidden();
            await page.getByRole('textbox', { name: 'CRN:' }).fill(crn)
            await page.click('#searchButton')
            await expect(page.getByText('Showing 1 to 1 of 1 records ')).toBeVisible()
            await page.locator('tr', { hasText: crn }).locator('a', { hasText: 'View' }).click()
            await dismissModals(page)
            await deleteOffender(page, crn)
        }
    }
})

export async function deleteOffender(page: Page, crn: string) {
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
}