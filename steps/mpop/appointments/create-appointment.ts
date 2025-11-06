import { Page, expect, Locator } from '@playwright/test'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import { doUntil } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/refresh.mjs'

export interface Attendee {
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
  crn: string, 
  sentenceId: number, 
  typeId: number, 
  dateTime: mpopDateTime, 
  locationId: number, 
  note: string, 
  sensitivity: boolean, 
  nextId: number, 
  dateTime_another: mpopDateTime, 
  note_another: string, 
  sensitivity_another: boolean, 
  attendee: Attendee=null, 
  isVisor: boolean=null) => 
{
  await loginToManageMySupervision(page)

  await page.goto(`https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/${crn}/appointments/`)

  await doUntil (
    () => page.locator('[data-qa="arrange-appointment-btn"]').click(),
    () => expect(page.locator('[data-qa="pageHeading"]')).toContainText("What is this appointment for?")
  )

  await completeSentencePage(page, sentenceId)
  await completeTypeAttendancePage(page, typeId, attendee, isVisor)
  await completeLocationDateTimePage(page, dateTime, locationId)
  await completeSupportingInformationPage(page, note, sensitivity)
  await completeCYAPage(page, isVisor)
  await completeConfirmationPage(page)
  await completeNextAppointmentPage(page, nextId)
  await completeArrangeAnotherAppointmentPage(page, dateTime_another, note_another, sensitivity_another)

  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  

}

export const completeSentencePage = async(page: Page, id: number) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("What is this appointment for?")
  await page.getByRole('radio').nth(id).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeTypeAttendancePage = async(page: Page, id: number, attendee:Attendee=null, isVisor:boolean=null) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment type and attendance")
  if (attendee){
    await page.getByRole('link', {name: 'change'}).click()
    await completeAttendingPage(page, attendee)
  }
  await page.locator('[data-qa="type"]').getByRole('radio').nth(id).click()
  if (isVisor != null){
    await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(isVisor ? 0 : 1).click()
  }
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeAttendingPage = async(page: Page, attendee: Attendee) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Who will attend the appointment?")
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
  await page.getByRole("button").filter({hasText: "Choose date"}).click()
  await page.getByTestId(dateTime.date).click()
  await page.locator('[data-qa="startTime"]').locator('[type="text"]').fill(dateTime.startTime)
  await page.locator('[data-qa="endTime"]').locator('[type="text"]').fill(dateTime.endTime)
  await page.locator('[data-qa="locationCode"]').getByRole('radio').nth(locationId).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeSupportingInformationPage = async(page: Page, note: string, sensitivity: boolean) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Add supporting information (optional)")
  await page.locator('[data-qa="notes"]').getByRole('textbox').fill(note)
  await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(sensitivity ? 0 : 1).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeCYAPage = async(page: Page, isVisor: boolean=null) => {  
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Check your answers then confirm the appointment")  
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(0)).toContainText("Appointment for")
  await expect(page.locator('[class="govuk-summary-list__key"]').nth(1)).toContainText("Appointment type")
  let count = 2
  if (isVisor){
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

export const completeConfirmationPage = async(page: Page) => {  
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Appointment arranged")  
  await expect(page.locator('[data-qa="what-happens-next"]')).toContainText("What happens next")  
  await page.getByRole('link', {name: 'arrange another appointment'}).click()
}

export const completeNextAppointmentPage = async(page:Page, id: number) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Do you want to arrange the next appointment with")  
  await page.locator('[data-qa="option"]').getByRole('radio').nth(id).click()
  await page.locator('[data-qa="submit-btn"]').click()
}

export const completeArrangeAnotherAppointmentPage = async(page:Page, dateTime: mpopDateTime, note: string, sensitivity: boolean) => {
  await expect(page.locator('[data-qa="pageHeading"]')).toContainText("Arrange another appointment")
  
  await page.getByRole('link', {name: 'Choose date and time'}).click()
  await page.getByRole("button").filter({hasText: "Choose date"}).click()
  await page.getByTestId(dateTime.date).click()
  await page.locator('[data-qa="startTime"]').locator('[type="text"]').fill(dateTime.startTime)
  await page.locator('[data-qa="endTime"]').locator('[type="text"]').fill(dateTime.endTime)
  await page.locator('[data-qa="submit-btn"]').click()

  await page.locator('[data-qa="notes"]').getByRole('textbox').fill(note)
  await page.locator('[data-qa="visorReport"]').getByRole('radio').nth(sensitivity ? 0 : 1).click()
  await page.locator('[data-qa="submit-btn"]').click()

  await page.locator('[data-qa="submit-btn"]').click()
}