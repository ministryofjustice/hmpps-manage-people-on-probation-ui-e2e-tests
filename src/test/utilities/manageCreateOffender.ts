import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";
import { createOffender as deliusCreateOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";
import { Person } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";

import { ROOT_DIR } from "./paths";

const USER_FILE = path.join(ROOT_DIR, "temp-offender.json");
const TMP_FILE = USER_FILE + ".tmp";

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

    crn = await deliusCreateOffender(page, { person, providerName });

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
