import { Page } from "@playwright/test"
import { dateTimeMapping, luxonString, MpopDateTime, nextWeek, plus3Months, today, tomorrow, yesterday } from "../util/DateTime"
import SentencePage from "../pageObjects/Case/Contacts/Appointments/sentence.page"
import TypeAttendancePage from "../pageObjects/Case/Contacts/Appointments/type-attendance.page"
import LocationDateTimePage from "../pageObjects/Case/Contacts/Appointments/location-datetime.page"
import SupportingInformationPage from "../pageObjects/Case/Contacts/Appointments/supporting-information.page"
import ConfirmationPage from "../pageObjects/Case/Contacts/Appointments/confirmation.page"
import NextAppointmentPage, { NextAction } from "../pageObjects/Case/Contacts/Appointments/next-appointment.page"
import TextConfirmationPage from "../pageObjects/Case/Contacts/Appointments/text-confirmation-page"
import CYAPage from "../pageObjects/Case/Contacts/Appointments/CYA.page"
import ArrangeAnotherPage from "../pageObjects/Case/Contacts/Appointments/arrange-another.page"
import { DataTable } from "playwright-bdd"
import { dateTime as defaultTime, attendee as self } from "./Data"
import { YesNoCheck } from "./ReviewCheckins"
import { DateTime } from "luxon"
import AttendedCompliedPage from "../pageObjects/Case/Contacts/Appointments/attended-complied.page"
import AddNotePage from "../pageObjects/Case/Contacts/Appointments/add-note.page"
import LocationNotInListPage from "../pageObjects/Case/Contacts/Appointments/location-not-in-list.page"
import ReschedulePage from "../pageObjects/Case/Contacts/Appointments/reschedule.page"
import RescheduleDetailsPage from "../pageObjects/Case/Contacts/Appointments/reschedule-details"
import {e} from "@faker-js/faker/dist/airline-BUL6NtOJ";



export interface MpopArrangeAppointment {
  sentenceId: number | "person"
  typeId: number
  attendee?: MpopAttendee
  isVisor?: boolean
  dateTime: MpopDateTime
  locationId: number | "not needed" | "not in list"
  text: TextMessageOption,
  mobile?: string
  note?: string
  sensitivity: boolean
}

export interface MpopAppointmentChanges {
  sentenceId?: number | "person"
  typeId?: number
  attendee?: MpopAttendee
  isVisor?: boolean
  dateTime?: MpopDateTime
  locationId?: number | "not needed" | "not in list"
  text?: TextMessageOption,
  mobile?: string
  note?: string
  sensitivity?: boolean
}

export interface MpopAttendee {
  provider?: string
  team?: string
  user?: string
}

export interface RescheduleDetails {
  user: number,
  reason: string,
  sensitivity: boolean
}

export const setupAppointmentMPop = async(page: Page, appointment: MpopArrangeAppointment, past:boolean = false) => {
  const sentencePage = new SentencePage(page)
  await sentencePage.completePage(appointment.sentenceId)
  const typeAttendancePage = new TypeAttendancePage(page)
  await typeAttendancePage.completePage(appointment.typeId, appointment.attendee, appointment.isVisor)
  const locationDateTimePage = new LocationDateTimePage(page)
  const locationId = await locationDateTimePage.findLocationId(appointment.typeId, appointment.locationId)
  await locationDateTimePage.completePage(appointment.dateTime, locationId)
  if (appointment.locationId === 'not in list'){
    console.log('location not in list')
    return
  }
  if (past){
    console.log('past appointment')
    const attendedCompliedPage = new AttendedCompliedPage(page)
    await attendedCompliedPage.checkOnPage()
    await attendedCompliedPage.completePage()
    const addNotePage = new AddNotePage(page)
    await addNotePage.checkOnPage()
    await addNotePage.completePage(appointment.sensitivity, appointment.note)//file
  } else {
    const textConfirmationPage = new TextConfirmationPage(page)
    await textConfirmationPage.completePage(appointment.text, appointment.mobile)
    const supportingInformationPage = new SupportingInformationPage(page)
    await supportingInformationPage.completePage(appointment.sensitivity, appointment.note)
  }
  const cyaPage = new CYAPage(page)
  await cyaPage.checkOnPage()
}

export const createAppointmentMPop = async(page: Page, appointment: MpopArrangeAppointment) => {
  const past = DateTime.fromFormat(appointment.dateTime.date, "d/M/yyyy")  < today
  await setupAppointmentMPop(page, appointment, past)
  if (appointment.locationId === 'not in list'){
    return
  }
  const cyaPage = new CYAPage(page)
  await cyaPage.completePage(appointment.isVisor, past)
  const confirmationPage = new ConfirmationPage(page, past)
  await confirmationPage.checkOnPage()
}

export const createSimilarAppointmentMPop = async(page:Page, changes: MpopAppointmentChanges) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(NextAction.Similar)
  const arrangeAnotherPage = new ArrangeAnotherPage(page)
  await arrangeAnotherPage.completePage(changes)
}

export const createAnotherAppointmentMPop = async(page:Page, appointment: MpopArrangeAppointment) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(NextAction.New)
  await createAppointmentMPop(page, appointment)
}

export const rescheduleAppointmentMPop = async(page:Page, rescheduleDetails: RescheduleDetails, changes: MpopAppointmentChanges) => {
  const reschedulePage = new ReschedulePage(page)
  await reschedulePage.completePage(rescheduleDetails.user, rescheduleDetails.reason, rescheduleDetails.sensitivity)
  const rescheduleDetailsPage = new RescheduleDetailsPage(page)
  await rescheduleDetailsPage.completePage(changes)
}


export const textMap = {
    'Yes': 'yes',
    'Yes, add a mobile number' : 'yes-add',
    'Yes, update their mobile number': 'yes-update',
    'No': 'no'
} as const

type TextMapKey = keyof typeof textMap
export type TextMessageOption = typeof textMap[TextMapKey]

export const appointmentDataTable = (data: DataTable, full:boolean = false) : MpopAppointmentChanges => {
    let sentenceId: number | 'person' | undefined = full ? 0 : undefined
    let typeId: number | undefined = full ? 0 : undefined
    let attendee: MpopAttendee | undefined = full ? self : undefined
    let isVisor: boolean 
    let date: string = luxonString(tomorrow)
    let startTime: string = "15:15"
    let endTime: string = "16:15"
    let locationId: number | "not needed" | "not in list" | undefined = full ? 0 : undefined

    let text: TextMessageOption

    let mobile: string
    let note: string
    let sensitivity: boolean = false
    for (const row of data.hashes()){
        if (row.label === 'sentenceId'){
            sentenceId = row.value as unknown as number | 'person'
            //0 - X are sentences
            //last entry is person (use text 'person')
        }
        if (row.label === 'typeId'){
            typeId = row.value as unknown as number
            //0 - 8 options for sentence (1 requires no location)
            //0 only option for person
        }
        if (row.label === 'attendeeProvider'){
            if (!attendee){
              attendee = {}
            }
            attendee.provider = row.value
        }
        if (row.label === 'attendeeTeam'){
            if (!attendee){
              attendee = {}
            }
            attendee.team = row.value
        }
        if (row.label === 'attendeeName'){
            if (!attendee){
              attendee = {}
            }
            attendee.user = row.value
        }
        if (row.label === 'isVisor'){
            isVisor = YesNoCheck[row.value as keyof typeof YesNoCheck] === 0 ? true : false
        }
        if (row.label === 'date'){
            date = luxonString(dateTimeMapping[row.value])
        }
        if (row.label === 'startTime'){
            startTime = row.value
        }
        if (row.label === 'endTime'){
            endTime = row.value
        }
        if (row.label === 'locationId'){
            locationId = row.value as unknown as number | "not needed" | "not in list" 
            //not needed - last if an option
            //not in list - last otherwise (2nd last if not needed is option)
        }
        // if (row.label === 'text'){
        //     text = YesNoCheck[row.value as keyof typeof YesNoCheck] === 0 ? true : false
        // }
        if (row.label === 'text'){
            text = textMap[row.value as TextMapKey]
        }
        if (row.label === 'mobile'){
            mobile = row.value
        }
        if (row.label === 'note'){
            note = row.value
        }
        if (row.label === 'sensitive'){
            sensitivity = YesNoCheck[row.value as keyof typeof YesNoCheck] === 0 ? true : false
        }
    }

    const appointment : MpopAppointmentChanges = {
      sentenceId: sentenceId,
      typeId: typeId,
      attendee: attendee,
      isVisor: isVisor!,
      dateTime: {
        date: date,
        startTime: startTime,
        endTime: endTime
      },
      locationId: locationId,
      text: text,
      mobile: mobile!,
      note: note!,
      sensitivity: sensitivity
    }

    return appointment
}

export const rescheduleDataTable = (data: DataTable) : RescheduleDetails => {
    let who: "person" | "system"
    let reason: string
    let sensitivity: boolean = false
    for (const row of data.hashes()){
        if (row.label === 'who'){
            who = row.value as "person" | "system"
        }
        if (row.label === 'reason'){
            reason = row.value
        }
        if (row.label === 'sensitive'){
            sensitivity = YesNoCheck[row.value as keyof typeof YesNoCheck] === 0 ? true : false
        }
    }
    const reschedule : RescheduleDetails = {
      user: who! === 'person' ? 0 : 1,
      reason: reason!,
      sensitivity: sensitivity
    }

    return reschedule
}

export const fullDetailsFromChanges = (changes: MpopAppointmentChanges, base: MpopArrangeAppointment) : MpopArrangeAppointment => {
  const appointment : MpopArrangeAppointment = {
    sentenceId: changes.sentenceId ?? base.sentenceId!,
    typeId: changes.typeId ?? base.typeId!,
    attendee: changes.attendee ?? base.attendee!,
    isVisor: changes.isVisor ?? base.isVisor,
    dateTime: changes.dateTime ?? base.dateTime!,
    locationId: changes.locationId ?? base.locationId!,
    text: changes.text ?? base.text!,
    mobile: changes.mobile ?? base.mobile,
    note: changes.note ?? base.note,
    sensitivity: changes.sensitivity ?? base.sensitivity!
  }
  return appointment
}