// Standalone script to run getCaseloadOrderedByAllocatedOn without the
// Playwright test runner. Useful for quickly checking what CRNs the
// delete-pop step would resolve/order, given the current .env config.
//
// Usage:
//   npx tsx helper-scripts/get-caseload-crns.ts

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
  { depth: null },
);
