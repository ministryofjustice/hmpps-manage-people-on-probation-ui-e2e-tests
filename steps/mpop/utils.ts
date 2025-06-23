import { DateTime } from 'luxon'

// To format the date as 'd MMM yyyy'
export const mpopFormatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('d MMM yyyy')
}

export const mpopLongMonthFormat = (date: Date) =>
    DateTime.fromJSDate(date).toFormat('d MMMM yyyy')

export const mpopShortMonthFormat = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('d MMM yyyy')
}

export const today = DateTime.fromISO(DateTime.now())
export const yesterday = today.minus({ days: 1 })
export const plus3Months = today.plus({ months: 3 })  // => 12 Sep 2025
export const plus6Months = today.plus({ months: 6 })  // => 12 Dec 2025
