import { Page } from '@playwright/test'
import { DateTime} from 'luxon'
import { mpopDateTime } from './appointments/create-appointment'

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

export const getUuid = (page: Page) => {
    const url = page.url()
    const split = url.split('?')[0].split('/')
    return split[split.length - 2]
}

export const testBackLink = async(page: Page) => {
  await page.getByRole('link', {name: 'Back'}).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const updateDateTime = (date: mpopDateTime): mpopDateTime => {
    if (parseInt(date.endTime.substring(0,2)) <= 22){
        date.startTime = (parseInt(date.startTime.substring(0,2))+1).toString() + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))+1).toString() + date.endTime.substring(2,5)
    } else {
        date.startTime = (parseInt(date.startTime.substring(0,2))-22).toString() + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))-22).toString() + date.endTime.substring(2,5)
        let dateTime = new DateTime()
        dateTime.fromFormat(date.date, {locale: 'en-gb'})
        dateTime.plus({ days: 1 })
        date.date = luxonString(dateTime)
    }
    return date
}