import { Page } from "@playwright/test"
import DateFrequencyPage, { FrequencyOptions } from "../pageObjects/Case/Contacts/Checkins/SetUp/date-frequency.page"
import ContactPreferencePage, { contactMethod, Preference } from "../pageObjects/Case/Contacts/Checkins/SetUp/contact-preference.page"
import PhotoOptionsPage, { PhotoOptions } from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-options.page"
import InstructionsPage from "../pageObjects/Case/Contacts/Checkins/SetUp/instructions.page"
import UploadPhotoPage from "../pageObjects/Case/Contacts/Checkins/SetUp/upload-photo.page"
import PhotoMeetRulesPage from "../pageObjects/Case/Contacts/Checkins/SetUp/photo-meet-rules.page"
import CheckInSummaryPage from "../pageObjects/Case/Contacts/Checkins/SetUp/check-in-summary.page"
import { futureTimes, luxonString, nextWeek, tomorrow } from "./DateTime"
import { DataTable } from "playwright-bdd"
import TakePhotoPage from "../pageObjects/Case/Contacts/Checkins/SetUp/take-photo.page"
import { chance, randomEnum, randomPicker } from "./Common"

export interface MpopSetupCheckin {
    date: string
    frequency: FrequencyOptions
    contact: ContactDetails
    preference: Preference
    photo: PhotoOptions
}

export interface MpopSetupChanges {
    date?: string
    frequency?: FrequencyOptions
    contact?: ContactDetails
    preference?: Preference
    photo?: PhotoOptions
}

export interface MPoPCheckinDetails {
    date: string
    frequency: FrequencyOptions
    preference: Preference
}

export interface ContactDetails {
    mobile?: string
    email?: string
}

export const setupCheckinsMPop = async(page: Page, setup: MpopSetupCheckin) => {
    const instructionPage = new InstructionsPage(page)
    await instructionPage.checkOnPage()
    await instructionPage.completePage()

     // Navigate to Date frequency page, verify page header and complete the page
    const dateFrequencyPage = new DateFrequencyPage(page)
    await dateFrequencyPage.checkOnPage()
    await dateFrequencyPage.completePage(setup.date, setup.frequency)

    // Navigate to Contact preference page, verify page header and select TEXT Message option
    const contactPreferencePage = new ContactPreferencePage(page) 
    await contactPreferencePage.checkOnPage()
    await contactPreferencePage.completePage(setup.contact, setup.preference )
    
    // Photo options page
    const photoOptionsPage = new PhotoOptionsPage(page) 
    await photoOptionsPage.checkOnPage()
    await photoOptionsPage.completePage(setup.photo)

    if (setup.photo === PhotoOptions.UPLOAD){
        // Upload a Photo page
        const uploadPhotoPage = new UploadPhotoPage(page)
        await uploadPhotoPage.checkOnPage()
        // await uploadPhotoPage.checkPageHeaderPhoto("pageHeading", "Upload a photo of")
        await uploadPhotoPage.completePage()
    } else if (setup.photo === PhotoOptions.TAKE){
        // Take a Photo page
        const takePhotoPage = new TakePhotoPage(page)
        await takePhotoPage.checkOnPage()
        await takePhotoPage.completePage()  
    }

    // Photo Meet the rules page
    const photoMeetRulesPage = new PhotoMeetRulesPage(page)
    await photoMeetRulesPage.checkOnPage()
    await photoMeetRulesPage.completePage()

    const checkInSummaryPage = new CheckInSummaryPage(page)
    await checkInSummaryPage.checkOnPage()
}

export const makeChangesSetupCheckins = async(page: Page, changes: MpopSetupChanges) => {
    const checkInSummaryPage = new CheckInSummaryPage(page)
    if (changes.date || changes.frequency !== undefined){
        while (true){
            await checkInSummaryPage.checkOnPage()
            if (changes.date){
                await checkInSummaryPage.clickDateChangeLink()
            } else {
                await checkInSummaryPage.clickDateIntervalChangeLink()
            }
            const dateFrequencyPage = new DateFrequencyPage(page)
            await dateFrequencyPage.checkOnPage()
            await dateFrequencyPage.changePage(changes.date, changes.frequency)
            try {
                await dateFrequencyPage.checkOnPage()
                await dateFrequencyPage.clickBackLink()
            } catch {
                break 
            }
        }
    }

    if (changes.contact?.email || changes.contact?.mobile || changes.preference){
        if (changes.preference !== undefined){
            await checkInSummaryPage.clickPreferredCommsActionChangeLink()
        } else if (changes.contact?.mobile){
            await checkInSummaryPage.clickMobileActionChangeLink()
        } else {
            await checkInSummaryPage.clickEmailActionChangeLink()
        }
        const contactPreferencePage = new ContactPreferencePage(page) 
        await contactPreferencePage.checkOnPage()
        await contactPreferencePage.changePage(changes.contact, changes.preference)
    }

    if (changes.photo !== undefined){
        await checkInSummaryPage.clickTakeAPhotoActionChangeLink()
        const photoOptionsPage = new PhotoOptionsPage(page) 
        await photoOptionsPage.checkOnPage()
        await photoOptionsPage.changePage(changes.photo)

        if (changes.photo === PhotoOptions.UPLOAD){
            const uploadPhotoPage = new UploadPhotoPage(page)
            await uploadPhotoPage.checkOnPage()
            await uploadPhotoPage.completePage()
        }
        else if (changes.photo === PhotoOptions.TAKE){
            const takePhotoPage = new TakePhotoPage(page)
            await takePhotoPage.checkOnPage()
            await takePhotoPage.completePage()
        }

        const photoMeetRulesPage = new PhotoMeetRulesPage(page)
        await photoMeetRulesPage.checkOnPage()
        await photoMeetRulesPage.completePage()
    }
}

export const setupDataTable = (data: DataTable) : MpopSetupChanges => {
    let date : string
    let frequency : FrequencyOptions
    let mobile : string
    let email : string
    let preference : Preference
    let photo : PhotoOptions
    for (const row of data.hashes()){
        if (row.label === 'date'){
            if (row.value === 'tomorrow'){
                date = luxonString(tomorrow)
            } 
            if (row.value === 'nextweek'){
                date = luxonString(nextWeek)
            }
        }
        if (row.label === 'frequency'){
            frequency = FrequencyOptions[row.value as keyof typeof FrequencyOptions]
        }
        if (row.label === 'mobile'){
            mobile = row.value
        }
        if (row.label === 'email'){
            email = row.value
        }
        if (row.label === 'preference'){
            preference = Preference[row.value as keyof typeof Preference]
        }
        if (row.label === 'photo'){
            photo = PhotoOptions[row.value as keyof typeof PhotoOptions]
        }
    }

    const config : MpopSetupChanges = {
        date: date!,
        frequency: frequency!,
        contact: {mobile: mobile!, email: email!},
        preference: preference!,
        photo: photo!
    }

    return config
}

export const randomCheckIn = (full: boolean = true) : MpopSetupChanges => {
    let config: MpopSetupChanges
    if (full){
        const preference = randomEnum(Preference)
        let mobile : string | undefined
        let email : string | undefined
        if (preference === Preference.EMAIL){
            mobile = chance() ? '07771 900 900' : undefined
            email = 'Test@test.com'
        }
        if (preference === Preference.TEXT){
            mobile = '07771 900 900'
            email = chance() ? 'Test@test.com' : undefined
        }
        config = {
            date: luxonString(randomPicker(futureTimes)),
            frequency: randomEnum(FrequencyOptions),
            contact: {mobile: mobile, email: email},
            preference: preference as Preference,
            photo: randomEnum(PhotoOptions)
        } as MpopSetupCheckin
    } else {
        const preference = chance() ? randomEnum(Preference) : undefined
        let mobile : string | undefined
        let email : string | undefined
        if (preference === Preference.EMAIL){
            mobile = chance() ? '07771 900 900' : undefined
            email = 'Test@test.com'
        }
        if (preference === Preference.TEXT){
            mobile = '07771 900 900'
            email = chance() ? 'Test@test.com' : undefined
        }
        config = {
            date: chance() ? luxonString(randomPicker(futureTimes)) : undefined,
            frequency: chance() ? randomEnum(FrequencyOptions) : undefined,
            contact: {mobile: mobile, email: email},
            preference: preference,
            photo: chance() ? randomEnum(PhotoOptions) : undefined
        } 
    }
    return config
}

const definitions: Record<string, string> = {
  YES: 'Yes',
  NO: 'No',
  EMAIL: 'Email',
  TEXT: 'Text message',
  PHONE: 'Text message',
  EVERY_WEEK: 'Every week',
  EVERY_2_WEEKS: 'Every 2 weeks',
  EVERY_4_WEEKS: 'Every 4 weeks',
  EVERY_8_WEEKS: 'Every 8 weeks',
  VERY_WELL: 'Very well',
  WELL: 'Well',
  NOT_GREAT: 'Not great',
  STRUGGLING: 'Struggling',
  MENTAL_HEALTH: 'Mental health',
  ALCOHOL: 'Alcohol',
  DRUGS: 'Drugs',
  HOUSING: 'Housing',
  MONEY: 'Money',
  SUPPORT_SYSTEM: 'Support system',
  OTHER: 'Other',
  NO_HELP: 'No, I do not need help',
}

export default function getUserFriendlyString(key: string): string {
  if (!key) {
    return ''
  }
  if (typeof key !== 'string') {
    return key
  }
  return definitions[key.trim().toUpperCase()] ?? key
}