import { Page } from "@playwright/test"
import { MpopDateTime } from "./DateTime"
import SentencePage from "../pageObjects/Case/Contacts/Appointments/sentence.page"
import TypeAttendancePage from "../pageObjects/Case/Contacts/Appointments/type-attendance.page"
import LocationDateTimePage from "../pageObjects/Case/Contacts/Appointments/location-datetime.page"
import SupportingInformationPage from "../pageObjects/Case/Contacts/Appointments/supporting-information.page"
import ConfirmationPage from "../pageObjects/Case/Contacts/Appointments/confirmation.page"
import NextAppointmentPage, { NextAction } from "../pageObjects/Case/Contacts/Appointments/next-appointment.page"
import TextConfirmationPage from "../pageObjects/Case/Contacts/Appointments/text-confirmation-page"
import CYAPage from "../pageObjects/Case/Contacts/Appointments/CYA.page"
import ArrangeAnotherPage from "../pageObjects/Case/Contacts/Appointments/arrange-another.page"

export interface MpopArrangeAppointment {
  sentenceId: number
  typeId: number
  attendee?: MpopAttendee
  isVisor?: boolean
  dateTime: MpopDateTime
  locationId: number
  text: boolean,
  mobile?: string
  note?: string
  sensitivity: boolean
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

export const createSimilarAppointmentMPop = async(page:Page, dateTime: MpopDateTime, text: boolean, sensitivity: boolean, note?: string, mobile?: string) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(NextAction.Similar)
  const arrangeAnotherPage = new ArrangeAnotherPage(page)
  await arrangeAnotherPage.completePage(dateTime,text,sensitivity,undefined,note)
}

export const createAnotherAppointmentMPop = async(page:Page, appointment: MpopArrangeAppointment) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(NextAction.New)
  await createAppointmentMPop(page, appointment)
}