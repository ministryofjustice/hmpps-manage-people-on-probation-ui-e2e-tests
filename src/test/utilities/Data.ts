// /steps/test-data.ts
import { Contact, data } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs"
import path from 'path'
import { tomorrow } from "./DateTime"
import * as dotenv from 'dotenv'
import { MpopAttendee } from "./ArrangeAppointment"

dotenv.config({ path: '.env' })

export const testUser = {
    name: 'TestUser, MPOP (PS - PSO)',
    firstName: 'MPOP',
    lastName: 'TestUser',
}

export const testCrn = "X977632"
export const attendee: MpopAttendee = {
    team: "N07AAT",
    user: "jsftest"
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

export const photo_1_path = path.join(process.cwd(), 'src/test/fixtures/Photo1.png');
export const video_1_path = path.join(process.cwd(), 'src/test/fixtures/Video1.mp4');

export const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export const ContextConfig = process.env.LOCAL ? { recordVideo: { dir: 'videos/' } } : undefined
