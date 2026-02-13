import { Page } from '@playwright/test'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login.mjs'
import {
    deliusPerson,
    Person,
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs'
import {
    internalTransfer
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/transfer/internal-transfer.mjs'
import { data, Staff, Team } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { manageCreateOffender } from "./manageCreateOffender";

const loginDeliusAndCreateOffender = async (
    page: Page,
    providerName?: string,
    staff?: Staff,
    team?: Team,
    createNewOffender?: boolean,
): Promise<[Person, string]> => {
    await loginToDelius(page);
    const person = deliusPerson();
    let crn;
    if (createNewOffender) {
        console.time("createOffender");
        crn = await createOffender(page, { person, providerName });
        console.timeEnd("createOffender");
        console.log("Forced offender creation, CRN: ", crn);
    } else {
        console.time("manageCreateOffender");
        crn = await manageCreateOffender(page, person, providerName);
        console.time("manageCreateOffender");
    }

    // Only call internalTransfer if providerName, staff, and team are provided
    if (providerName && staff && team) {
        await internalTransfer(page, {
            crn,
            allocation: { staff, team },
        });
    }

    return [person, crn];
};

export default loginDeliusAndCreateOffender;