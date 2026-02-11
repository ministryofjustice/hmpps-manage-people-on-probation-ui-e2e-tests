import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Page } from '@playwright/test'
import { createOffender as deliusCreateOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender.mjs'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_FILE = path.join(__dirname, "../temp-user.json");
const TMP_FILE = USER_FILE + ".tmp";

export const createOffender = async (page: Page, person: Person, providerName?: string): Promise<string> => {
    let crn
    console.log(`Creating ${USER_FILE}`);


    console.log(`fs.existsSync(USER_FILE) ${fs.existsSync(USER_FILE)}`);
    try {
        // Attempt atomic lock
        const fd = fs.openSync(TMP_FILE, "wx");

        // 👑 Only ONE worker reaches here
        crn = await deliusCreateOffender(page, {person, providerName})

        fs.writeSync(fd, JSON.stringify({ crn }));
        fs.closeSync(fd);
        fs.renameSync(TMP_FILE, USER_FILE);

        console.log("User created by this worker:", crn);
        return crn;

    } catch (err: any) {
        console.error("EXCEPTION");
        // Another worker already created it
        if (err.code !== "EEXIST") throw err;

        // Wait until file is written
        while (!fs.existsSync(USER_FILE)) {
            await new Promise(r => setTimeout(r, 50));
        }
        console.log("READING file from file :", USER_FILE);
        const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
        console.log("User reused from file:", data.crn);
        return data.crn;
    }
}
