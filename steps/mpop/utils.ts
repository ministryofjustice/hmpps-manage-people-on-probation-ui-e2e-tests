import { expect, Locator, Page } from '@playwright/test'
import { DateTime } from 'luxon'
import { MpopDateTime } from './navigation/create-appointment'
import { Contact } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data.mjs'
import { fillDate, fillTime, selectOption } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.mjs'
import { doUntil } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/refresh.mjs'
import { findOffenderByCRNNoContextCheck } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender.mjs'
import { findContactsByCRN } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/contact/find-contacts.mjs'

// To format the date as 'd MMM yyyy'
export const mpopFormatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('d MMM yyyy')
}

export const mpopLongMonthFormat = (date: Date) =>
    DateTime.fromJSDate(date).toFormat('d MMMM yyyy')

export const mpopShortMonthFormat = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('d MMM yyyy')
}

export const luxonString = (date: DateTime) : string => {
    return date.toFormat("d/M/yyyy")
}

export const today = DateTime.fromISO(DateTime.now())
export const yesterday = today.minus({ days: 1 })
export const tomorrow = today.plus({ days: 1 })
export const plus3Months = today.plus({ months: 3 })  // => 12 Sep 2025
export const plus6Months = today.plus({ months: 6 })  // => 12 Dec 2025

export const nextWeekend = (today: DateTime) => {
    while (!today.isWeekend){
        today = today.plus({ days: 1 })
    }
    return today
}

export const getUuid = (page: Page) => {
    const url = page.url()
    const split = url.split('?')[0].split('/')
    return split[split.length - 2]
}

export const testBackLink = async(page: Page) => {
  await page.getByRole('link', {name: 'Back'}).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const updateDateTime = (date: MpopDateTime): MpopDateTime => {
    if (parseInt(date.endTime.substring(0,2)) <= 18 && parseInt(date.startTime.substring(0,2)) <= 18){
        date.startTime = (parseInt(date.startTime.substring(0,2))+1).toString() + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))+1).toString() + date.endTime.substring(2,5)
    } else {
        date.startTime = (parseInt(date.startTime.substring(0,2))-12) + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))-12) + date.endTime.substring(2,5)
        let dateTime = DateTime.fromFormat(date.date, "d/M/yyyy")
        dateTime = dateTime.plus({ days: 1 })
        while (dateTime.isWeekend){
            dateTime = dateTime.plus({ days: 1 })
        }
        date.date = luxonString(dateTime)
    }
    if (date.startTime.length === 4){
        date.startTime = "0" + date.startTime
    } 
    if (date.endTime.length === 4){
        date.endTime = "0" + date.endTime
    } 
    return date
}

interface AlertContact extends Contact {
  alert?: boolean
  note?: string
}

export const createContact = async (page: Page, crn: string, options: AlertContact) => {
    await findContactsByCRN(page, crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details', { timeout: 10000 })
    if (options.date) {
        await fillDate(page, '#StartDate\\:datePicker', options.date as Date)
    }

    await selectOption(page, '#RelatedTo\\:selectOneMenu', options.relatesTo)
    await selectOption(page, '#ContactCategory\\:selectOneMenu', options.category)
    await selectOption(page, '#ContactType\\:selectOneMenu', options.type)
    await selectOption(page, '#TransferToTrust\\:selectOneMenu', options.allocation?.team?.provider)
    await selectOption(page, '#TransferToTeam\\:selectOneMenu', options.allocation?.team?.name)

    await selectOption(page, '#alert\\:selectOneMenu', options.alert ? "Yes" : "No")

    if (options.allocation?.team?.location) {
        await selectOption(page, '#Location\\:selectOneMenu', options.allocation?.team?.location)
    }
    if (options.startTime) {
        await fillTime(page, '#StartTime\\:timePicker', options.startTime)
    }
    if (options.endTime) {
        await fillTime(page, '#EndTime\\:timePicker', options.endTime)
    }
    if (options.outcome) {
        await selectOption(page, '#contactOutcome\\:selectOneMenu', options.outcome)
    }
    if (options.enforcementAction) {
        await selectOption(page, '#enforcementAction\\:selectOneMenu', options.enforcementAction)
    }
    await selectOption(page, '#TransferToOfficer\\:selectOneMenu', options.allocation?.staff?.name)

    if (options.note){
        await page.fill(`#Notes\\:notesField`, options.note)
    }

    try {
        // Attempt to create contact
        await doUntil(
            async () => {
                await page.locator('input[type="submit"].btn-primary').click()
            },
            // Check if the page title matches "Contact List"
            async () => expect(page).toHaveTitle(/Contact List/),
            { timeout: 60_000, intervals: [500, 1000, 5000] }
        )
    } catch (error) {
        console.error('Error occurred while waiting for page title:', error)
        // Handle fallback in case of an error
        if ((await page.title()) === 'Error Page') {
            await findOffenderByCRNNoContextCheck(page, crn)
            return await createContact(page, crn, options)
        }

        if (!(await page.title()).includes('Contact List')) {
            await page.locator('#navigation-include\\:linkNavigation1ContactList').click()
        }
    }
}