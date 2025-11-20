// /steps/test-data.ts
import { Contact, data } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs"
import { MpopAttendee } from "./mpop/navigation/create-appointment"
import { tomorrow } from "./mpop/utils"

export const automatedTestUser1 = {
    name: 'AutomatedTestUser, AutomatedTestUser (PS - PSO)',
    firstName: 'AutomatedTestUser',
    lastName: 'AutomatedTestUser',
}

export const testCrn = "X756510"

export const attendee: MpopAttendee = {
    team: "N07T02",
    user: "AndyAdamczak1"
}

export const deliusAlert: Contact = { 
    relatesTo: `Event 1 - Adult Custody < 12m (6 Months)`,
    date: tomorrow.toJSDate(),
    startTime: tomorrow.toJSDate(),
    allocation: { team: data.teams.allocationsTestTeam },
    category: "All/Always",
    type: "3 Way Meeting (Non NS)",
    alert: true,
    note: "Words ".repeat(500)
}
