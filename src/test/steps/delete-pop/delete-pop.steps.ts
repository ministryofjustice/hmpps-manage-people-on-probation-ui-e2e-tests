import { login } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login.mjs";
import { createBdd } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import { expect, Page } from "@playwright/test";
import {
  dismissModals,
  findOffenderByCRN,
} from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender.mjs";
import {
  getCaseloadOrderedByAllocatedOn,
  getCaseloadTotalElements,
  getClientToken,
} from "../../util/API";

const { When } = createBdd(testContext);

// CRNs reserved/protected test records.
const PROTECTED_CRNS = ["X979340"];
// Keep at least this many records in the caseload after deletion.
const DEFAULT_MIN_REMAINING = 70;
// Default cap on how many offenders to delete in a single run.
const DEFAULT_DELETE_LIMIT = 7;

When("I delete offender with CRNs", async ({ page }) => {
  const crnsEnv = process.env.CRNS;
  const username = process.env.DELIUS_USERNAME;
  if (!username?.trim()) {
    throw new Error("DELIUS_USERNAME environment variable must be set");
  }
  const token = await getClientToken();
  const totalElements = await getCaseloadTotalElements(username, token);
  console.log(totalElements);

  let crns: string[];
  if (crnsEnv?.trim()) {
    crns = crnsEnv
      .split(",")
      .map((crn) => crn.trim())
      .filter((crn) => crn.length > 0);
  } else {
    // Fetching the caseload from the MAS API (ordered by
    // allocatedOn ascending) instead of requiring CRNS to be populated
    // manually.
    const caseload = await getCaseloadOrderedByAllocatedOn(
      username,
      token,
      totalElements,
    );
    crns = caseload.map((entry) => entry.crn);
  }
  crns = crns.filter((crn) => !PROTECTED_CRNS.includes(crn));

  if (crns.length === 0) {
    throw new Error(
      "No CRNs found: set the CRNS environment variable or ensure the caseload API returns results",
    );
  }

  const deleteLimitEnv = process.env.DELETE_LIMIT;
  const deleteLimit = deleteLimitEnv?.trim()
    ? Number(deleteLimitEnv)
    : DEFAULT_DELETE_LIMIT;
  if (!Number.isInteger(deleteLimit) || deleteLimit <= 0) {
    throw new Error(
      "DELETE_LIMIT environment variable must be a positive integer",
    );
  }

  {
    // Always check against the live caseload size (even when CRNS is
    // supplied manually) so we never delete below the minimum caseload
    // size. Uses the API's totalElements, not just the number of CRNs
    // provided/returned, so the check stays accurate regardless of source.
    const minRemainingEnv = process.env.MIN_REMAINING_RECORDS;
    const minRemaining = minRemainingEnv?.trim()
      ? Number(minRemainingEnv)
      : DEFAULT_MIN_REMAINING;
    if (!Number.isInteger(minRemaining) || minRemaining < 0) {
      throw new Error(
        "MIN_REMAINING_RECORDS environment variable must be a non-negative integer",
      );
    }
    const maxDeletable = Math.max(0, totalElements - minRemaining);
    crns = crns.slice(0, Math.min(deleteLimit, maxDeletable));
  }

  if (crns.length === 0) {
    console.log(
      "No CRNs left to delete after applying DELETE_LIMIT/MIN_REMAINING_RECORDS constraints",
    );
    return;
  }

  await login(page);
  for (const [index, crn] of crns.entries()) {
    console.log(`Deleting offender ${index + 1} ${crn} of ${crns.length}`);
    if (index === 0) {
      await findOffenderByCRN(page, crn);
      await deleteOffender(page);
    } else {
      await expect(page).toHaveTitle(/National Search/);
      await page.getByRole("button", { name: "Clear Search Fields" }).click();
      await expect(page.getByText("No records found.")).toBeHidden();
      await page.getByRole("textbox", { name: "CRN:" }).fill(crn);
      await page.click("#searchButton");
      await expect(
        page.getByText("Showing 1 to 1 of 1 records "),
      ).toBeVisible();
      await page
        .locator("tr", { hasText: crn })
        .locator("a", { hasText: "View" })
        .click();
      await dismissModals(page);
      await deleteOffender(page);
    }
  }
});

export async function deleteOffender(page: Page) {
  await page.getByRole("link", { name: "Event List" }).click();
  await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();

  // Terminated events are hidden by default but still block whole-record
  // deletion, so reveal them before deleting all events.
  const showTerminatedEvents = page.getByLabel("Show Terminated Events:");
  await showTerminatedEvents.selectOption("Y");
  await page.waitForLoadState("networkidle");

  const deleteEventLinks = page.getByRole("link", { name: "delete" });
  let remaining = await deleteEventLinks.count();
  while (remaining > 0) {
    await deleteEventLinks.first().click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(deleteEventLinks).toHaveCount(remaining - 1);
    remaining -= 1;
  }
  await page.getByRole("link", { name: "Personal Details" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
}
