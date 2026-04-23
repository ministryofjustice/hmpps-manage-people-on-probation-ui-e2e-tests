import { expect, Page } from "@playwright/test";
import { DateTime } from "luxon";
import { getCalenderEvent, getExternalReference } from "./API";
import { getUrn } from "./Common";
import { CaseType } from "../features/Fixtures";
import { MpopDateTime } from "./DateTime";

export const checkOutlook = async (
  page: Page,
  caseInfo: CaseType,
  token: string,
  past: boolean,
  dateTime: MpopDateTime,
) => {
  const urn = getUrn(page);
  const external = await getExternalReference(caseInfo.crn, urn, token);
  const [status, body] = await getCalenderEvent(external, token);
  if (past) {
    console.log("appointment in past. no outlook event");
    expect(status).toBe(404);
  } else {
    expect(status).toBe(200);
    const message = body.subject;
    const startDate = DateTime.fromISO(body.startDate).toFormat("HH:mm");
    const endDate = DateTime.fromISO(body.endDate).toFormat("HH:mm");
    expect(startDate).toBe(dateTime.startTime);
    expect(endDate).toBe(dateTime.endTime);
    expect(message).toContain(
      `${caseInfo.person.firstName[0]}. ${caseInfo.person.lastName}`,
    );
  }
};
