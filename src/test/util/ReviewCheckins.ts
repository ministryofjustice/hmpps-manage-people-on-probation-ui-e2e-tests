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
import { start } from "repl"
import HomePage from "../pageObjects/home.page"
import CasesPage from "../pageObjects/cases.page"

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

export const getCasesWithCheckInsSetup = async(page: Page) => {
    const cases = new CasesPage(page)
    await cases.navigateTo()
    await cases.checkOnPage()
    let totalId = 0
    let pageNum = 1
    let crns = []
    const count = await cases.getCount()
    console.log(count)
    while (totalId < count){
        for (let i=1; i<=10; i++){
            totalId += 1
            console.log(totalId)
            await cases.selectCaseByID(i)
            const casePage = new OverviewPage(page)
            const crn = await casePage.getQA('crn').textContent()
            console.log(crn)
            const setup = await casePage.checkOnlineCheckInsSetup()
            if (setup){
                console.log('setupCRN: ' + crn)
                if (crns.indexOf(crn) === -1){
                    crns.push(crn)
                    console.log(crns)
                } else {
                    console.log('already in')
                } 
            }
            await casePage.useBreadcrumbs(0)
            if (pageNum > 1){
                await cases.pagination(pageNum)
            }
        }
        pageNum += 1
        await cases.pagination(pageNum)
        console.log('new page')
    }

}

export const getCrnsWithCheckInsSetup = async(page: Page, startCrn: string) => {
    let crn = startCrn
    let crnNumber = crn.substring(1) as unknown as number
    const searchPage = new SearchPage(page)
    while (true){
        crnNumber = crnNumber - 1
        crn = 'X' + crnNumber.toString()
        console.log(crn)
        await searchPage.navigateTo(page)
        await searchPage.searchCases(crn)
        const pages = await searchPage.countCases()
        if (pages > 0){
            console.log('validCRN')
            await searchPage.selectCaseByID(1)
            const casePage = new OverviewPage(page, crn)
            const setup = await casePage.checkOnlineCheckInsSetup()
            if (setup){
                console.log('setupCRN: ' + crn)
            }
        }
    }
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
