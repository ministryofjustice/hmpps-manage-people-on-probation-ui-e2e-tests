import { Browser, BrowserContext, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event.mjs'
import { automatedTestUser1 } from '../../../steps/test-data'
import { MpopAttendee, MpopDateTime} from '../../../steps/mpop/navigation/create-appointment'
import AppointmentsPage from '../../../steps/mpop/pages/case/appointments.page'
import SentencePage from '../../../steps/mpop/pages/appointments/sentence.page'
import TypeAttendancePage from '../../../steps/mpop/pages/appointments/type-attendance.page'
import LocationDateTimePage from '../../../steps/mpop/pages/appointments/location-datetime.page'
import LocationNotInListPage from '../../../steps/mpop/pages/appointments/location-not-in-list.page'
import { luxonString, nextWeekend, tomorrow, yesterday } from '../../../steps/mpop/utils'
import { navigateToAppointments } from '../../../steps/mpop/navigation/case-navigation'
import {login} from "../../../steps/mpop/login";

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string 
let browser: Browser
let context: BrowserContext
let page: Page
let person: Person
let sentence: CreatedEvent

test.describe.configure({ mode: 'serial' });
test.describe('Location dateTime page', () => {
    test.beforeAll(async ({browser: b}) => {
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
        sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

    })
    test.beforeEach(async ({ browser: b }) => {
        browser = b
        context = await browser.newContext()
        page = await context.newPage()
        await login(page)

        //navigate to start of arrange appointment pipeline
        const appointments : AppointmentsPage = await navigateToAppointments(page, crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()
    })

    test.afterEach(async () => {
        await context.close()
    })

    test('CheckLocationNotInList page', async () => {

        const dateTime: MpopDateTime = {
            date: luxonString(tomorrow),
            startTime: "15:15",
            endTime: "16:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 1)
        const locationNotInListPage = new LocationNotInListPage(page)
        await locationNotInListPage.checkOnPage()
    })

    test('CheckLocationNotInList page - no valid locations', async () => {

        const attendee: MpopAttendee = {
            provider: "N56",
            team: "N56AAT"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0, attendee)
        const locationNotInListPage = new LocationNotInListPage(page)
        await locationNotInListPage.checkOnPage()
    })

    test('DateTime Validation - end before start', async () => {

        const dateTime: MpopDateTime = {
            date: luxonString(tomorrow),
            startTime: "15:15",
            endTime: "12:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0, false)

        await locationDateTimePage.checkForError("The end time must be after the start time")
    })

    test('DateTime Validation - non 24h format', async () => {

        const dateTime: MpopDateTime = {
            date: luxonString(tomorrow),
            startTime: "5:15",
            endTime: "13:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0, false)

        await locationDateTimePage.checkForError("Enter a time in the 24-hour format, for example 16:30")
    })

    test('DateTime Validation - non working day warning', async () => {

        const dateTime: MpopDateTime = {
            date: luxonString(nextWeekend(tomorrow)),
            startTime: "12:15",
            endTime: "13:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0, false)

        await locationDateTimePage.checkQA("nonWorkingDayNameWarning", "You have selected a non-working day (Saturday). Continue with these details or make changes.")
    })
})