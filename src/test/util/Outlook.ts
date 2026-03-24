import { expect, Page } from "@playwright/test";
import { DateTime } from "luxon";
import { getCalenderEvent, getClientToken, getExternalReference } from "./API";
import { getUrn } from "./Common";
import { CaseType } from "../features/Fixtures";

export const checkOutlook = async(page: Page, caseInfo: CaseType, token: string, past: boolean) => {
    const urn = getUrn(page)
    const external = await getExternalReference(caseInfo.crn, urn, token)
    const [status, body] = await getCalenderEvent(external, token)
    if (past){
        console.log('appointment in past. no outlook event')
        expect(status).toBe(404)
    } else {
        expect(status).toBe(200)
        const message = body.subject
        console.log(message)
        expect(message).toContain(`with ${caseInfo.person.firstName} ${caseInfo.person.lastName}`)
    }
}