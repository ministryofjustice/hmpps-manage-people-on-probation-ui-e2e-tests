import { Page, expect } from '@playwright/test'
import { testBackLink } from '../utils'

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

export const createAppointmentMPop = async (page: Page, 
  appointment: mpopArrangeAppointment) => 
{
  await completeSentencePage(page, appointment.sentenceId)
  await completeTypeAttendancePage(page, appointment.typeId, appointment.attendee, appointment.isVisor)
  await completeLocationDateTimePage(page, appointment.dateTime, appointment.locationId)
  await completeSupportingInformationPage(page, appointment.sensitivity, appointment.note)
  await completeCYAPage(page, appointment.isVisor)

  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  
}

export const completeSentencePage = async(page: Page, id: number) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("What is this appointment for?")
  await page.getByRole('radio').nth(id).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeTypeAttendancePage = async(page: Page, id: number, attendee?:mpopAttendee, isVisor?:boolean) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment type and attendance")
  await testBackLink(page)
  if (attendee != undefined){
    await page.getByRole('link', {name: 'change'}).click()
    await completeAttendingPage(page, attendee)
  }
  await page.locator('[data-qa="type"]').getByRole('radio').nth(id).click()
  if (isVisor != undefined){
    await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(isVisor ? 0 : 1).click()
  }
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeAttendingPage = async(page: Page, attendee: mpopAttendee) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Who will attend the appointment?")
  await page.getByRole('link', {name: 'Back'}).click()
  await page.getByRole('link', {name: 'change'}).click()
  if (attendee.provider){
    await page.locator('[data-qa="providerCode"]').selectOption(attendee.provider)
  }
  if (attendee.team){
    await page.locator('[data-qa="teamCode"]').selectOption(attendee.team)
  }
  if (attendee.user){
    await page.locator('[data-qa="username"]').selectOption(attendee.user)
  }
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeLocationDateTimePage = async(page: Page, dateTime: mpopDateTime, locationId: number) => {
  await expect(page.locator('[data-qa="pageHeading"]').first()).toContainText("Appointment date, time and location")
  await testBackLink(page)
  await page.getByRole("button").filter({hasText: "Choose date"}).click()
  await page.getByTestId(dateTime.date).click()
  await page.locator('[data-qa="startTime"]').locator('[type="text"]').fill(dateTime.startTime)
  await page.locator('[data-qa="endTime"]').locator('[type="text"]').fill(dateTime.endTime)
  await page.locator('[data-qa="locationCode"]').getByRole('radio').nth(locationId).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeSupportingInformationPage = async(page: Page, sensitivity: boolean, note?: string) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Add supporting information (optional)")
  await testBackLink(page)
  if (note != undefined){
    await page.locator('[data-qa="notes"]').getByRole('textbox').fill(note)
  }
  await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(sensitivity ? 0 : 1).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeCYAPage = async(page: Page, isVisor: boolean=null) => {  
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Check your answers then confirm the appointment")  
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(0)).toContainText("Appointment for")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(1)).toContainText("Appointment type")
  let count = 2
  if (isVisor != undefined){
    await expect(page.locator('[class="govuk-summary-list__key"]').nth(2)).toContainText("VISOR report")
    count += 1
  }
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(count)).toContainText("Attending")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(count+1)).toContainText("Location")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(count+2)).toContainText("Date and time")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(count+3)).toContainText("Supporting information")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(count+4)).toContainText("Sensitivity")
  await page.locator('[data-qa="submit-btn"]').click()
}

export const createSimilarAppointmentMPop = async(page:Page, dateTime: mpopDateTime, sensitivity: boolean, note?: string) => {
  await completeConfirmationPage(page, "createAnother")
  await completeNextAppointmentPage(page, 0)
  await completeArrangeAnotherAppointmentPage(page, dateTime, sensitivity, note)
}

export const createAnotherAppointmentMPop = async(page:Page, appointment: mpopArrangeAppointment) => {
  await completeConfirmationPage(page, "createAnother")
  await completeNextAppointmentPage(page, 1)
  await createAppointmentMPop(page, appointment)
}

export const completeConfirmationPage = async(page: Page, option: string) => {  
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  
  await expect(page.locator('[data-qa="what-happens-next"]')).toContainText("What happens next")  
  if (option === "createAnother"){
    await page.getByRole('link', {name: 'arrange another appointment'}).click()
  } else if (option === "returnToAll") {
    await page.getByRole('link', {name: 'Return to all cases'}).click()
  } else {
    await page.locator('[data-qa="submit-btn"]').click()
  }
}

export const completeNextAppointmentPage = async(page:Page, id: number) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Do you want to arrange the next appointment with")  
  await page.locator('[data-qa="option"]').getByRole('radio').nth(id).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeArrangeAnotherAppointmentPage = async(page:Page, dateTime: mpopDateTime, sensitivity: boolean, note?: string) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Arrange another appointment")
  
  await page.getByRole('link', {name: 'Choose date and time'}).click()
  await page.getByRole("button").filter({hasText: "Choose date"}).click()
  await page.getByTestId(dateTime.date).click()
  await page.locator('[data-qa="startTime"]').locator('[type="text"]').fill(dateTime.startTime)
  await page.locator('[data-qa="endTime"]').locator('[type="text"]').fill(dateTime.endTime)
  await page.locator('[data-qa="submit-btn"]').click()

  if (note != undefined){
    await page.locator('[data-qa="notes"]').getByRole('textbox').fill(note)
  }
  await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(sensitivity ? 0 : 1).click()
  await page.locator('[data-qa="submit-btn"]').click()

  await page.locator('[data-qa="submit-btn"]').click()
}