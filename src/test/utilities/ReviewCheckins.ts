import { Page } from "@playwright/test"
import ReviewIdentityPage from "../pageObjects/Case/Contacts/Checkins/Review/review-identity.page"
import ReviewNotesPage from "../pageObjects/Case/Contacts/Checkins/Review/review-notes.page"
import ReviewExpiredPage from "../pageObjects/Case/Contacts/Checkins/Review/review-expired.page"
import CasePage from "../pageObjects/Case/casepage"
import OverviewPage from "../pageObjects/Case/overview.page"
import SearchPage from "../pageObjects/search.page"
import ContactPage from "../pageObjects/Case/Contacts/contactpage"
import ActivityLogPage from "../pageObjects/Case/activity-log.page"

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

export const getValidCrnForExpiredCheckin = async(page: Page, crn: string) : Promise<string> => {
    // let crnNumber = (crn.substring(1) as unknown as number)
    // crnNumber = crnNumber-100
    let setup = false
    let old = false
    let available = false
    const searchPage = new SearchPage(page)
    await searchPage.navigateTo(page)
    let startCRN = 'X980730'
    //passedCRNs X90729, X980718, X980722, X980721
    let crnNumber = startCRN.substring(1) as unknown as number
    while (setup === false || old === false || available === false){
        setup = false
        old = false
        crnNumber = crnNumber-1
        crn = 'X' + crnNumber.toString()
        await searchPage.searchCases(crn)
        const pages = await searchPage.countCases()
        if (pages > 0){
            console.log('case exists')
            await searchPage.selectCaseByID(1)
            const casePage = new OverviewPage(page, crn)
            setup = await casePage.checkOnlineCheckInsSetup()
            if (setup === true){
                console.log("is setup")
                old = await casePage.NotMadeToday()
                if (old === true){
                    console.log("is old enough")
                    casePage.useSubNavigation("activityLogTab")
                    const contactPage = new ActivityLogPage(page) 
                    available = await contactPage.checkAvailable()
                }
            }
            await casePage.usePrimaryNavigation('Search')
        }  
    }
    return crn
}
