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
import fs from "fs";
import path from "path";
import { createOffender as deliusCreateOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";

import { ROOT_DIR } from "./Paths";

const USER_FILE = path.join(ROOT_DIR, "temp-offender.json");
const TMP_FILE = USER_FILE + ".tmp";

export const loginDeliusAndCreateOffender = async (
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
        console.time("createOffender-forced");
        crn = await createOffender(page, { person, providerName });
        console.timeEnd("createOffender-forced");
        console.log("Forced offender creation, CRN: ", crn);
    } else {
        console.time("manageCreateOffender");
        crn = await manageCreateOffender(page, person, providerName);
        console.timeEnd("manageCreateOffender");
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

export const manageCreateOffender = async (
  page: Page,
  person: Person,
  providerName?: string,
): Promise<string> => {
  if (fs.existsSync(USER_FILE)) {
    const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    console.log("READING CRN from existing file:", data.crn);
    return data.crn;
  }

  let crn;
  try {
    const fd = fs.openSync(TMP_FILE, "wx");
    console.time("deliusCreateOffender")
    crn = await deliusCreateOffender(page, { person, providerName });
    console.timeEnd("deliusCreateOffender");
    fs.writeSync(fd, JSON.stringify({ crn }));
    fs.closeSync(fd);
    fs.renameSync(TMP_FILE, USER_FILE);

    console.log("Offender Created, CRN: ", crn);
    return crn;
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
    while (!fs.existsSync(USER_FILE)) {
      await new Promise((r) => setTimeout(r, 50));
    }
    const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    console.log("Reading Offender CRN from file: ", data.crn);
    return data.crn;
  }
};