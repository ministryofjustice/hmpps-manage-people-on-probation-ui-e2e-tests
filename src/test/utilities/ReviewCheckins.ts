import { Page } from "@playwright/test"
import ReviewIdentityPage from "../pageObjects/Case/Contacts/Checkins/Review/review-identity.page"
import ReviewNotesPage from "../pageObjects/Case/Contacts/Checkins/Review/review-notes.page"
import ReviewExpiredPage from "../pageObjects/Case/Contacts/Checkins/Review/review-expired.page"
import CasePage from "../pageObjects/Case/casepage"
import OverviewPage from "../pageObjects/Case/overview.page"
import SearchPage from "../pageObjects/search.page"
import ContactPage from "../pageObjects/Case/Contacts/contactpage"
import ActivityLogPage from "../pageObjects/Case/activity-log.page"
import PersonalDetailsPage from "../pageObjects/Case/personal-details.page"
import { DataTable } from "playwright-bdd"

export enum ReviewType {
    SUBMITTED = 0,
    EXPIRED = 1
}
export enum YesNoCheck {
    YES = 0,
    NO = 1
}

export interface Review {
    type: ReviewType,
    review: ExpiredReview | SubmittedReview
}
export interface ExpiredReview {
    comment: string
}
export interface SubmittedReview {
    identity: YesNoCheck
    note?: string
    risk?: YesNoCheck
}

export interface SurveyResponse  {
  mentalHealth: MentalHealth
  mentalHealthComment?: string
  assistance: SupportAspect[]
  mentalHealthSupport?: string
  alcoholSupport?: string
  drugsSupport?: string
  moneySupport?: string
  housingSupport?: string
  supportSystemSupport?: string
  otherSupport?: string
  callback: CallbackRequested
  callbackDetails?: string
}
export enum MentalHealth {
  VeryWell = 'VERY_WELL',
  Well = 'WELL',
  Ok = 'OK',
  NotGreat = 'NOT_GREAT',
  Struggling = 'STRUGGLING',
}
export enum SupportAspect {
  MentalHealth = 'MENTAL_HEALTH',
  Alcohol = 'ALCOHOL',
  Drugs = 'DRUGS',
  Money = 'MONEY',
  Housing = 'HOUSING',
  SupportSystem = 'SUPPORT_SYSTEM',
  Other = 'OTHER',
  NoHelp = 'NO_HELP',
}
export enum CallbackRequested {
  Yes = 'YES',
  No = 'NO',
}

export const reviewCheckinMpop = async(page: Page, review: Review) => {
    if (review.type === ReviewType.EXPIRED){
        reviewExpiredCheckinMpop(page, review.review as ExpiredReview)
    }
    if (review.type === ReviewType.SUBMITTED){
        reviewSubmittedCheckinMpop(page, review.review as SubmittedReview)
    }
}

export const reviewExpiredCheckinMpop = async(page: Page, review: ExpiredReview) => {
    const reviewExpiredPage = new ReviewExpiredPage(page)
    await reviewExpiredPage.checkOnPage()
    await reviewExpiredPage.completePage(review.comment)
}
export const reviewSubmittedCheckinMpop = async(page: Page, review: SubmittedReview) => {
    const reviewIdentityPage = new ReviewIdentityPage(page)
    await reviewIdentityPage.checkOnPage()
    await reviewIdentityPage.completePage(review.identity)

    const reviewNotesPage = new ReviewNotesPage(page)
    await reviewNotesPage.checkOnPage()
    await reviewNotesPage.completePage(review.note, review.risk)
}

export const getValidCrnForExpiredCheckin = async(page: Page, crn?: string) : Promise<string> => {
    let setup = false
    let old = false
    let available = false
    let practitioner = false
    const searchPage = new SearchPage(page)
    await searchPage.navigateTo(page)
    crn = crn ?? 'X977280' 
    crn = 'X982076'
    let index = 0
    let passedCRNs : string[] = ['X981726','X982081','X981982', 'X980729', 'X980718', 'X980722', 'X980721', 'X977961', 'X977632'] 
    let crnNumber = crn.substring(1) as unknown as number
    while (setup === false || old === false || available === false || practitioner === false){
        setup = false
        old = false
        if (passedCRNs.length > index){
            crn = passedCRNs[index]
            index += 1
        } else {
            crnNumber = crnNumber-1
            crn = 'X' + crnNumber.toString()
        }
        console.log(crn)
        await searchPage.searchCases(crn)
        const pages = await searchPage.countCases()
        console.log(pages)
        if (pages > 0){
            console.log('exists')
            await searchPage.selectCaseByID(1)
            const casePage = new OverviewPage(page, crn)
            setup = await casePage.checkOnlineCheckInsSetup()
            if (setup === true){
                console.log("setup")
                old = await casePage.NotMadeToday()
                if (old === true){
                    console.log("old")
                    await casePage.useSubNavigation("activityLogTab")
                    const contactPage = new ActivityLogPage(page) 
                    available = await contactPage.checkAvailable()
                    if (available === true){
                        console.log("unused today")
                        await page.getByRole('link', {name: "Personal details"}).click()
                        const personalDetailsPage = new PersonalDetailsPage(page)
                        personalDetailsPage.checkOnPage()
                        practitioner = await personalDetailsPage.checkForPractitioner()
                    }
                }
            }
            await casePage.usePrimaryNavigation('Search')
        }  
    }
    return crn!
}

export const reviewDataTable = (data: DataTable) : SurveyResponse => {
    let mentalHealth: MentalHealth
    let mentalHealthComment: string|undefined
    let assistance: SupportAspect[] = []
    let mentalHealthSupport: string|undefined
    let alcoholSupport: string|undefined
    let drugsSupport: string|undefined
    let moneySupport: string|undefined
    let housingSupport: string|undefined
    let supportSystemSupport: string|undefined
    let otherSupport: string|undefined
    let callback: CallbackRequested
    let callbackDetails: string|undefined
    for (const row of data.hashes()){
        if (row.label === 'mentalHealth'){
            mentalHealth = MentalHealth[row.value as keyof typeof MentalHealth]
        }
        if (row.label === 'mentalHealthComment'){
            mentalHealthComment = row.value
        }
        if (row.label === 'mentalHealthSupport'){
            mentalHealthSupport = row.value
            assistance.push(SupportAspect.MentalHealth)
        }
        if (row.label === 'alcoholSupport'){
            alcoholSupport = row.value
            assistance.push(SupportAspect.Alcohol)
        }
        if (row.label === 'drugsSupport'){
            drugsSupport = row.value
            assistance.push(SupportAspect.Drugs)
        }
        if (row.label === 'moneySupport'){
            moneySupport = row.value
            assistance.push(SupportAspect.Money)
        }
        if (row.label === 'housingSupport'){
            housingSupport = row.value
            assistance.push(SupportAspect.Housing)
        }
        if (row.label === 'supportSystemSupport'){
            supportSystemSupport = row.value
            assistance.push(SupportAspect.SupportSystem)
        }
        if (row.label === 'otherSupport'){
            otherSupport = row.value
            assistance.push(SupportAspect.Other)
        }
        if (row.label === 'callback'){
            callback = CallbackRequested[row.value as keyof typeof CallbackRequested]
        }
        if (row.label === 'callbackDetails'){
            callbackDetails = row.value
        }
    }

    const surveyResponse : SurveyResponse = {
        mentalHealth: mentalHealth!,
        mentalHealthComment: mentalHealthComment,
        assistance: assistance!,
        mentalHealthSupport: mentalHealthSupport,
        alcoholSupport: alcoholSupport,
        drugsSupport: drugsSupport,
        moneySupport: moneySupport,
        housingSupport: housingSupport,
        supportSystemSupport: supportSystemSupport,
        otherSupport: otherSupport,
        callback: callback!,
        callbackDetails: callbackDetails
    }

    return surveyResponse
}
