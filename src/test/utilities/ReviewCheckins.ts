import { Page } from "@playwright/test"
import ReviewIdentityPage from "../pageObjects/Case/Contacts/Checkins/Review/review-identity.page"
import ReviewNotesPage from "../pageObjects/Case/Contacts/Checkins/Review/review-notes.page"
import ReviewExpiredPage from "../pageObjects/Case/Contacts/Checkins/Review/review-expired.page"

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
