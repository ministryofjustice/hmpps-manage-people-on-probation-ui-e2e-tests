import { Page, expect } from '@playwright/test'
import { testBackLink } from '../utils'
import SentencePage from '../pages/appointments/sentence.page'
import TypeAttendancePage from '../pages/appointments/type-attendance.page'
import LocationDateTimePage from '../pages/appointments/location-datetime.page'
import SupportingInformationPage from '../pages/appointments/supporting-information.page'
import CYAPage from '../pages/appointments/CYA.page'
import ConfirmationPage from '../pages/appointments/confirmation.page'
import NextAppointmentPage from '../pages/appointments/next-appointment.page'
import ArrangeAnotherPage from '../pages/appointments/arrange-another.page'

export interface mpopArrangeAppointment {
  crn: string
  sentenceId: number
  typeId: number
  attendee?: mpopAttendee
  isVisor?: boolean
  dateTime: mpopDateTime
  locationId: number
  note?: string
  sensitivity: boolean
}

export interface mpopAttendee {
  provider?: string
  team?: string
  user?: string
}

export interface mpopDateTime {
  date: string
  startTime: string
  endTime: string
}

export const createAppointmentMPop = async(page: Page, appointment: mpopArrangeAppointment) => {
  const sentencePage = new SentencePage(page)
  await sentencePage.completePage(appointment.sentenceId)
  const typeAttendancePage = new TypeAttendancePage(page)
  await typeAttendancePage.completePage(appointment.typeId, appointment.attendee, appointment.isVisor)
  const locationDateTimePage = new LocationDateTimePage(page)
  await locationDateTimePage.completePage(appointment.dateTime, appointment.locationId)
  const supportingInformationPage = new SupportingInformationPage(page)
  await supportingInformationPage.completePage(appointment.sensitivity, appointment.note)
  const cyaPage = new CYAPage(page)
  await cyaPage.completePage(appointment.isVisor)
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.checkOnPage()
}

export const createSimilarAppointmentMPop = async(page:Page, dateTime: mpopDateTime, sensitivity: boolean, note?: string) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(0)
  const arrangeAnotherPage = new ArrangeAnotherPage(page)
  await arrangeAnotherPage.completePage(dateTime,sensitivity,note)
}

export const createAnotherAppointmentMPop = async(page:Page, appointment: mpopArrangeAppointment) => {
  const confirmationPage = new ConfirmationPage(page)
  await confirmationPage.completePage("createAnother")
  const nextAppointmentPage = new NextAppointmentPage(page)
  await nextAppointmentPage.completePage(1)
  await createAppointmentMPop(page, appointment)
}