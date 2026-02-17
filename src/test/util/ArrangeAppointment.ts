import { Page } from "@playwright/test"
import { luxonString, MpopDateTime, nextWeek, plus3Months, tomorrow, yesterday } from "../util/DateTime"
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

export interface MpopArrangeAppointment {
  sentenceId: number | "person"
  typeId: number
  attendee?: MpopAttendee
  isVisor?: boolean
  dateTime: MpopDateTime
  locationId: number | "not needed" | "not in list"
  text: boolean,
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
  text?: boolean,
  mobile?: string
  note?: string
  sensitivity?: boolean
}

export interface MpopAttendee {
  provider?: string
  team?: string
  user?: string
}

export const setupAppointmentMPop = async(page: Page, appointment: MpopArrangeAppointment) => {
  const sentencePage = new SentencePage(page)
  await sentencePage.completePage(appointment.sentenceId)
  const typeAttendancePage = new TypeAttendancePage(page)
  await typeAttendancePage.completePage(appointment.typeId, appointment.attendee, appointment.isVisor)
  const locationDateTimePage = new LocationDateTimePage(page)
  await locationDateTimePage.completePage(appointment.dateTime, appointment.locationId)
  const textConfirmationPage = new TextConfirmationPage(page)
  await textConfirmationPage.completePage(appointment.text, appointment.mobile)
  const supportingInformationPage = new SupportingInformationPage(page)
  await supportingInformationPage.completePage(appointment.sensitivity, appointment.note)
  const cyaPage = new CYAPage(page)
  await cyaPage.checkOnPage()
}

export const createAppointmentMPop = async(page: Page, appointment: MpopArrangeAppointment) => {
  await setupAppointmentMPop(page, appointment)
  const cyaPage = new CYAPage(page)
  await cyaPage.completePage(appointment.isVisor)
  const confirmationPage = new ConfirmationPage(page)
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

export const appointmentDataTable = (data: DataTable, full:boolean = false) : MpopAppointmentChanges => {
    let sentenceId: number | 'person' | undefined = full ? 0 : undefined
    let typeId: number | undefined = full ? 0 : undefined
    let attendee: MpopAttendee | undefined = full ? self : undefined
    let isVisor: boolean 
    let dateTime: MpopDateTime = defaultTime
    let locationId: number | "not needed" | "not in list" | undefined = full ? 0 : undefined
    let text: boolean = false
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
          if (row.value === 'yesterday'){
              dateTime.date = luxonString(yesterday)
          }
          if (row.value === 'tomorrow'){
              dateTime.date = luxonString(tomorrow)
          } 
          if (row.value === 'nextweek'){
              dateTime.date = luxonString(nextWeek)
          }
          if (row.value === '3months'){
              dateTime.date = luxonString(plus3Months)
          }
        }
        if (row.label === 'startTime'){
            dateTime.startTime = row.value
        }
        if (row.label === 'endTime'){
            dateTime.endTime = row.value
        }
        if (row.label === 'locationId'){
            locationId = row.value as unknown as number | "not needed" | "not in list" 
            //not needed - last if an option
            //not in list - last otherwise (2nd last if not needed is option)
        }
        if (row.label === 'text'){
            text = YesNoCheck[row.value as keyof typeof YesNoCheck] === 0 ? true : false
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
      dateTime: dateTime,
      locationId: locationId,
      text: text,
      mobile: mobile!,
      note: note!,
      sensitivity: sensitivity
    }

    return appointment
}
