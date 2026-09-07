// Standalone script to preview the CRNs the delete-pop step would select
// for deletion (in order), without running it via the Playwright test
// runner. Applies the same limitedAccess/PROTECTED_CRNS filtering as the
// step itself, via the shared getCaseloadCrnsForDeletion helper.
//
// Usage:
//   npx tsx helper-scripts/get-delete-pop-candidates.ts

import * as dotenv from "dotenv";
import { getClientToken, getCaseloadTotalElements } from "../src/test/util/API";
import { getCaseloadCrnsForDeletion } from "../src/test/steps/delete-pop/delete-pop.util";

dotenv.config({ path: ".env" });

const username = process.env.DELIUS_USERNAME;

if (!username?.trim()) {
  throw new Error("DELIUS_USERNAME environment variable must be set");
}

const token = await getClientToken();

const totalElements = await getCaseloadTotalElements(username, token);
console.log("totalElements:", totalElements);

const crns = await getCaseloadCrnsForDeletion(username, token, totalElements);

console.log(
  `deletion candidate CRNs (${crns.length}, oldest allocatedOn first):`,
);
console.dir(crns, { depth: null, maxArrayLength: null });
