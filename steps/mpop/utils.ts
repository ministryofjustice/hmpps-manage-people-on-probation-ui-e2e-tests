import { DateTime } from 'luxon'

// To format the date as 'd MMM yyyy'
export const mpopFormatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('d MMM yyyy')
}
