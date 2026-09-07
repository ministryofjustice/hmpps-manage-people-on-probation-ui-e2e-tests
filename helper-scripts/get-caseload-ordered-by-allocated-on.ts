// Standalone script to preview the full caseload ordered by allocatedOn
// ascending, with dates shown against each CRN. Unlike
// get-caseload-crns.ts, this does not apply the delete-pop
// limitedAccess/PROTECTED_CRNS filtering - it's a raw view of the ordered
// caseload, useful for inspecting allocation dates directly.
//
// Usage:
//   npx tsx helper-scripts/get-caseload-ordered-by-allocated-on.ts

import * as dotenv from "dotenv";
import {
  getClientToken,
  getCaseloadTotalElements,
  getCaseloadOrderedByAllocatedOn,
} from "../src/test/util/API";

dotenv.config({ path: ".env" });

const username = process.env.DELIUS_USERNAME;

if (!username?.trim()) {
  throw new Error("DELIUS_USERNAME environment variable must be set");
}

const token = await getClientToken();

const totalElements = await getCaseloadTotalElements(username, token);
console.log("totalElements:", totalElements);

const caseload = await getCaseloadOrderedByAllocatedOn(
  username,
  token,
  totalElements,
);

console.log(`caseload (${caseload.length}, oldest allocatedOn first):`);
console.dir(
  caseload.map(({ crn, allocatedOn }) => `${crn} (${allocatedOn})`),
  { depth: null, maxArrayLength: null },
);
