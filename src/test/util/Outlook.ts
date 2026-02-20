import { expect, Page } from "@playwright/test";
import { DateTime } from "luxon";
import { getCalenderEvent, getClientToken, getExternalReference } from "./API";
import { getUrn } from "./Common";

export const checkOutlook = async(page: Page, crn: string, token: string, past: boolean) => {
    const urn = getUrn(page)
    const external = await getExternalReference(crn, urn, token)
    const [status, body] = await getCalenderEvent(external, token)
    if (past){
        expect(status).not.toBe(200)
    } else {
        expect(status).toBe(200)
    }
}