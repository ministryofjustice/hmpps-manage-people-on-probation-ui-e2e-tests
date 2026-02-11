import { Page } from "@playwright/test";
import { login as loginToDelius } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login.mjs";
import {
  deliusPerson,
  Person,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";
import { createOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";
import { internalTransfer } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/transfer/internal-transfer.mjs";
import {
  Staff,
  Team,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs";
import { createOffender as commonCreateOffender } from "./createOffender";

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
  console.log("Creating new Offender");
  if (createNewOffender) {
    crn = await createOffender(page, { person, providerName });
  } else {
    crn = await commonCreateOffender(page, person, providerName);
  }
    //crn = await createOffender(page, { person, providerName });

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
