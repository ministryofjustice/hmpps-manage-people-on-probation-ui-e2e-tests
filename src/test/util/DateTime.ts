import { DateTime } from 'luxon'

export interface MpopDateTime {
  date: string
  startTime: string
  endTime: string
}

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
export const dueDateString = (date: DateTime) : string => {
    return date.toFormat("yyyy-M-d")
}

export const today = DateTime.now().setZone('Europe/London')
export const yesterday = today.minus({ days: 1 })
export const tomorrow = today.plus({ days: 1 })
export const plus3Months = today.plus({ months: 3 })  // => 12 Sep 2025
export const plus6Months = today.plus({ months: 6 })  // => 12 Dec 2025
export const nextWeek = today.plus({ days: 7 })
export const lastWeek = today.minus({ days: 7 })
export const twoDaysAgo = today.minus({ days: 2 })

export const nextWeekend = (today: DateTime) => {
    while (!today.isWeekend){
        today = today.plus({ days: 1 })
    }
    return today
}

type Mapping = {
    [key: string]: DateTime
}
export const dateTimeMapping: Mapping = {
    LASTWEEK: lastWeek,
    TWODAYSAGO: twoDaysAgo,
    YESTERDAY: yesterday,
    TODAY: today,
    TOMORROW: tomorrow,
    NEXTWEEKEND: nextWeekend(today),
    NEXTWEEK: nextWeek,
    PLUS3MONTHS: plus3Months,
    PLUS6MONTHS: plus6Months
}

export const updateDateTime = (date: MpopDateTime): MpopDateTime => {
    if (parseInt(date.endTime.substring(0,2)) <= 22 && parseInt(date.startTime.substring(0,2)) <= 22){
        date.startTime = (parseInt(date.startTime.substring(0,2))+1).toString() + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))+1).toString() + date.endTime.substring(2,5)
    } else {
        date.startTime = (parseInt(date.startTime.substring(0,2))-18) + date.startTime.substring(2,5)
        date.endTime = (parseInt(date.endTime.substring(0,2))-18) + date.endTime.substring(2,5)
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

export const formatToLongDay = (dateStr: string) => {
    const date = new Date(dateStr); // parse string
    const weekday = date.getDay()
    const day = date.getDate(); // 9
    const month = date.getMonth() + 1; // 1 (months are 0-indexed)
    return `${weekday} ${day} ${month}`;
}

export const formatToDMY = (dateStr: string) => {
    const date = new Date(dateStr); // parse string
    const day = date.getDate(); // 9
    const month = date.getMonth() + 1; // 1 (months are 0-indexed)
    const year = date.getFullYear(); // 2026
    return `${day}/${month}/${year}`;
}

export const dateWithDayAndWithoutYear = (datetimeString: string) => {
  return DateTime.fromFormat(datetimeString, "d/M/yyyy").toFormat('cccc d MMMM')
}

export const futureTimes = [tomorrow, nextWeek]

export const to12Hour = (time: string) => {
     const hour = Number(time.substring(0,2))
     console.log(hour)
     if (hour < 12){
        return hour + time.substring(2) + 'am'
     } else {
        return (hour === 12 ? 12 : hour-12) + time.substring(2) + 'pm'
     }
}

export const mpopTime = (start: string, end: string) => {
    const startTime = to12Hour(start)
    const endTime = to12Hour(end)
    return startTime + ' to ' + endTime
}