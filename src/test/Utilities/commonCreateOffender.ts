import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Page } from "@playwright/test";
import { createOffender as deliusCreateOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";
import { Person } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_FILE = path.join(__dirname, "../temp-user.json");
const TMP_FILE = USER_FILE + ".tmp";

export const commonCreateOffender = async (
  page: Page,
  person: Person,
  providerName?: string,
): Promise<string> => {
  let crn;
  try {
    const fd = fs.openSync(TMP_FILE, "wx");

    crn = await deliusCreateOffender(page, { person, providerName });

    fs.writeSync(fd, JSON.stringify({ crn }));
    fs.closeSync(fd);
    fs.renameSync(TMP_FILE, USER_FILE);

    console.log("USER CREATED, CRN: ", crn);
    return crn;
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
    while (!fs.existsSync(USER_FILE)) {
      await new Promise((r) => setTimeout(r, 50));
    }
    const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    console.log("READING CRN from file:", data.crn);
    return data.crn;
  }
};
