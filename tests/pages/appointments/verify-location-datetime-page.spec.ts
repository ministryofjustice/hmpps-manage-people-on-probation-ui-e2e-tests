import { APIRequestContext, Browser, BrowserContext, expect, Page, request, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs'
import loginDeliusAndCreateOffender from '../../../steps/delius/create-offender/createOffender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCustodialEvent, CreatedEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { automatedTestUser1 } from '../../../steps/test-data'
import { createAnotherAppointmentMPop, createAppointmentMPop, createSimilarAppointmentMPop, mpopArrangeAppointment, mpopAttendee, mpopDateTime} from '../../../steps/mpop/appointments/create-appointment'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AppointmentsPage from '../../../steps/mpop/pages/appointments.page'
import SentencePage from '../../../steps/mpop/pages/appointments/sentence.page'
import TypeAttendancePage from '../../../steps/mpop/pages/appointments/type-attendance.page'
import LocationDateTimePage from '../../../steps/mpop/pages/appointments/location-datetime.page'
import LocationNotInListPage from '../../../steps/mpop/pages/appointments/location-not-in-list.page'

dotenv.config({ path: '.env' }) // Load environment variables

let crn: string
let person: Person
let sentence: CreatedEvent
let browser: Browser
let context: BrowserContext
let page: Page

test.describe('Location dateTime page', () => {
    test.beforeEach(async ({ browser: b }) => {
        test.setTimeout(120000)
        browser = b
        context = await browser.newContext()
        page = await context.newPage()

        ;[person, crn] = await loginDeliusAndCreateOffender(page, 'Wales', automatedTestUser1, data.teams.allocationsTestTeam)
        sentence = await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    })

    test.afterEach(async () => {
        await context.close()
    })

    test('CheckLocationNotInList page', async () => {
        test.setTimeout(120_000)

        //navigate to start of arrange appointment pipeline
        await loginToManageMySupervision(page)
        const appointments = new AppointmentsPage(page)
        await appointments.goTo(crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()

        const dateTime: mpopDateTime = {
            date: "12/11/2030",
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
        test.setTimeout(120_000)

        //navigate to start of arrange appointment pipeline
        await loginToManageMySupervision(page)
        const appointments = new AppointmentsPage(page)
        await appointments.goTo(crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()

        const attendee: mpopAttendee = {
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
        test.setTimeout(120_000)

        //navigate to start of arrange appointment pipeline
        await loginToManageMySupervision(page)
        const appointments = new AppointmentsPage(page)
        await appointments.goTo(crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()

        const dateTime: mpopDateTime = {
            date: "12/11/2030",
            startTime: "15:15",
            endTime: "12:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0)

        await locationDateTimePage.checkForError("The end time must be after the start time")
    })

    test('DateTime Validation - non 24h format', async () => {
        test.setTimeout(120_000)

        //navigate to start of arrange appointment pipeline
        await loginToManageMySupervision(page)
        const appointments = new AppointmentsPage(page)
        await appointments.goTo(crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()

        const dateTime: mpopDateTime = {
            date: "12/11/2030",
            startTime: "5:15",
            endTime: "13:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0)

        await locationDateTimePage.checkForError("Enter a time in the 24-hour format, for example 16:30")
    })

    // test('DateTime Validation - appointment in past', async () => {
    //     test.setTimeout(120_000)

    //     //navigate to start of arrange appointment pipeline
    //     await loginToManageMySupervision(page)
    //     const appointments = new AppointmentsPage(page)
    //     await appointments.goTo(crn)
    //     await appointments.checkOnPage()
    //     await appointments.startArrangeAppointment()

    //     const dateTime: mpopDateTime = {
    //         date: "11/11/2030",
    //         startTime: "05:15",
    //         endTime: "06:15"
    //     }
    //     const sentencePage = new SentencePage(page)
    //     await sentencePage.completePage(0)
    //     const typeAttendancePage = new TypeAttendancePage(page)
    //     await typeAttendancePage.completePage(0)
    //     const locationDateTimePage = new LocationDateTimePage(page)
    //     await locationDateTimePage.completePage(dateTime, 0)

    //     await locationDateTimePage.checkForError("The start time must be now or in the future")
    // })

    test('DateTime Validation - non working day warning', async () => {
        test.setTimeout(120_000)

        //navigate to start of arrange appointment pipeline
        await loginToManageMySupervision(page)
        const appointments = new AppointmentsPage(page)
        await appointments.goTo(crn)
        await appointments.checkOnPage()
        await appointments.startArrangeAppointment()

        const dateTime: mpopDateTime = {
            date: "16/11/2030",
            startTime: "12:15",
            endTime: "13:15"
        }
        const sentencePage = new SentencePage(page)
        await sentencePage.completePage(0)
        const typeAttendancePage = new TypeAttendancePage(page)
        await typeAttendancePage.completePage(0)
        const locationDateTimePage = new LocationDateTimePage(page)
        await locationDateTimePage.completePage(dateTime, 0)

        await locationDateTimePage.checkQA("nonWorkingDayNameWarning", "You have selected a non-working day (Saturday). Continue with these details or make changes.")
    })
})