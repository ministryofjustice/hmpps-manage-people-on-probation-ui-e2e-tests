import { expect, Page } from "@playwright/test";
import { login as loginToDelius } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login.mjs";
import {
  deliusPerson,
  Person,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";
import { createOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";
import {
  Staff,
  Team,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs";
import fs from "fs";
import path from "path";
import { createOffender as deliusCreateOffender } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs";
import { selectOption } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs";
import { findOffenderByCRN } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender";
import {
  Allocation,
  Optional,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data";

import { ROOT_DIR } from "./Paths";

const USER_FILE = path.join(ROOT_DIR, "temp-offender.json");
const TMP_FILE = USER_FILE + ".tmp";

export const loginDeliusAndCreateOffender = async (
  page: Page,
  providerName?: string,
  staff?: Staff,
  team?: Team,
  createNewOffender?: boolean,
): Promise<[Person, string, boolean]> => {
  let person: Person = deliusPerson();
  let created: boolean;
  let crn: string;
  if (createNewOffender) {
    await loginToDelius(page);
    crn = await createOffender(page, { person, providerName });
    created = true;
  } else {
    [crn, person, created] = await manageCreateOffender(
      page,
      person,
      providerName,
    );
  }

  // Only call internalTransfer if providerName, staff, and team are provided
  if (providerName && staff && team && created) {
    await internalTransfer(page, {
      crn,
      allocation: { staff, team },
    });
  }
  return [person, crn, created];
};

export const manageCreateOffender = async (
  page: Page,
  person: Person,
  providerName?: string,
): Promise<[string, Person, boolean]> => {
  if (fs.existsSync(USER_FILE)) {
    const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    return [data.crn, data.person, false];
  }

  let crn;
  try {
    const fd = fs.openSync(TMP_FILE, "wx");
    await loginToDelius(page);
    crn = await deliusCreateOffender(page, { person, providerName });
    fs.writeSync(
      fd,
      JSON.stringify({
        crn,
        person,
      }),
    );
    fs.closeSync(fd);
    fs.renameSync(TMP_FILE, USER_FILE);
    return [crn, person, true];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
    while (!fs.existsSync(USER_FILE)) {
      await new Promise((r) => setTimeout(r, 50));
    }
    const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    return [data.crn, data.person, false];
  }
};

export async function internalTransfer(
  page: Page,
  {
    crn,
    allocation,
    reason = "Initial Allocation",
  }: {
    crn: string;
    allocation?: Optional<Allocation>;
    reason?: string;
  },
) {
  await findOffenderByCRN(page, crn);
  await page.locator("input", { hasText: "Transfers" }).click();
  await expect(page).toHaveTitle(/Consolidated Transfer Request/);
  await selectOption(
    page,
    "#Trust\\:selectOneMenu",
    allocation?.team?.provider,
  );
  await selectOption(page, "#Team\\:selectOneMenu", allocation?.team?.name);
  const selectedStaff = await selectOption(
    page,
    "#Staff\\:selectOneMenu",
    allocation?.staff?.name,
  );

  const options = await page
    .locator("#offenderTransferRequestTable")
    .locator("select");

  const count = await options.count();
  for (let i = 0; i < count; i++) {
    await options.nth(i).selectOption({ label: reason });
  }

  await page.locator("input", { hasText: "Transfer" }).click();
  await expect(page).toHaveTitle(/Consolidated Transfer Request/);

  return selectedStaff;
}

export const toNDeliusSearchResponseDateTimeFormat = (
    date: string,
    time: string,
): string => {
  const [day, month, year] = date.split("/");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} ${time}`;
};
