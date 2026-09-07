import { getCaseloadOrderedByAllocatedOn } from "../../util/API";

// CRNs reserved/protected test records.
export const PROTECTED_CRNS = new Set(["X979340"]);

// CRNs (ordered by allocatedOn ascending) that delete-pop is allowed to
// select for deletion: limited-access cases and PROTECTED_CRNS are
// excluded.
export const getCaseloadCrnsForDeletion = async (
  username: string,
  token: string,
  totalElements: number,
): Promise<string[]> => {
  const caseload = await getCaseloadOrderedByAllocatedOn(
    username,
    token,
    totalElements,
  );
  return caseload
    .filter(({ limitedAccess }) => limitedAccess !== true)
    .filter(({ crn }) => !PROTECTED_CRNS.has(crn))
    .map(({ crn }) => crn);
};
