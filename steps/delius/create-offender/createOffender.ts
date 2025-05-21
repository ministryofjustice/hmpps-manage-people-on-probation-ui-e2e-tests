import { Page } from '@playwright/test'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import {
  deliusPerson,
  Person,
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'
import {
  internalTransfer
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/transfer/internal-transfer'
import { data, Staff, Team } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'

const loginDeliusAndCreateOffender = async (
    page: Page,
    providerName?: string,
    staff?: Staff,
    team?: Team
): Promise<[Person, string]> => {
    await loginToDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName })

    // Only call internalTransfer if providerName, staff, and team are provided
    if (providerName && staff && team) {
        await internalTransfer(page, {
            crn,
            allocation: { staff, team }
        })
    }

    return [person, crn]
}


export default loginDeliusAndCreateOffender
