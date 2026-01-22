import { Page } from '@playwright/test'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login.mjs'
import { deleteOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/delete-offender.mjs'

const loginDeliusAndDeleteOffender = async (
    page: Page,
    crn: string,
): Promise<void> => {
    await loginToDelius(page)
    await deleteOffender(page, crn)
    return
}


export default loginDeliusAndDeleteOffender
