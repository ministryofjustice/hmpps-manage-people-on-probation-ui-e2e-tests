import {expect, Page} from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import {caseNavigation, navigateToCase} from "../../util/Navigation";

dotenv.config({path: '.env'})
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class SentencePage extends CasePage {
    [x: string]: any;

    constructor(page: Page, crn?: string) {
        super(page, "Sentence", crn)
    }

    async goTo(crn?: string) {
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/sentence/`)
    }

    async navigateTo(crn?: string) {
        await caseNavigation(this.page, (crn ?? this.crn)!, "sentenceTab")
    }

    async checkPageHeading(heading: string) {
        await expect(this.getQA('pageHeading').first()).toContainText(heading)
    }

    async checkSentenceTitle(expectedTitle: string) {
        const actualTitle = await this.page.title()
        expect(actualTitle).toEqual(expectedTitle)
    }

    async checkAdultCustodyLessThan12MLink() {
        await this.page.getByRole('link', {name: /Adult Custody < 12m/}).click()
        await expect(this.getQA('pageHeading').nth(0)).toContainText("Sentence")
        await expect(this.getQA('pageHeading').nth(1)).toContainText("Adult Custody < 12m")
    }

    async checkORACommunityOrderLink() {
        await this.page.getByRole('link', {name: /ORA Community Order/}).click()
        await expect(this.getQA('pageHeading').nth(0)).toContainText("Sentence")
        await expect(this.getQA('pageHeading').nth(1)).toContainText("ORA Community Order")
        await this.checkOffenceSectionInORACommunity()
        await this.checkConvictionSectionInORACommunity()
        await this.checkSentenceSectionInORACommunity()
    }

    async checkCJADeferredSentenceLink() {
        await this.page.getByRole('link', {name: /CJA - Deferred Sentence/}).click()
        await expect(this.getQA('pageHeading').nth(0)).toContainText("Sentence")
        await expect(this.getQA('pageHeading').nth(1)).toContainText("CJA - Deferred Sentence")
        await this.checkOffenceSectionInCJADeferredSentence()
        await this.checkConvictionSectionInCJADeferredSentence()
        await this.checkSentenceSectionInCJADeferredSentence()
    }

    async checkOffenceSectionInORACommunity() {
        await expect(this.getQA('offenceCard')).toContainText("Offence")
        await expect(this.getQA('mainOffenceLabel')).toContainText("Main offence")
        await expect(this.getQA('mainOffenceValue')).toContainText("(Unlawful sexual intercourse with girl under 16 (pre 1/5/04) - 02201) (1 count)")
        await expect(this.getQA('dateOfOffenceLabel')).toContainText("Offence date")
        await expect(this.getQA('dateOfOffenceValue')).toContainText("6 August 2024")
        await expect(this.getQA('offenceNotesLabel')).toContainText("Notes")
        await expect(this.getQA('additionalOffencesLabel')).toContainText("Additional offences")
    }

    async checkConvictionSectionInORACommunity() {
        await expect(this.getQA('sentencingCourtLabel')).toContainText("Sentencing court")
        await expect(this.getQA('sentencingCourtValue').first()).toContainText("Southern Derbyshire Magistrates Court (Derby)")
        await expect(this.getQA('responsibleCourtLabel').nth(0)).toContainText("Responsible court")
        await expect(this.getQA('responsibleCourtValue')).toContainText("Southern Derbyshire Magistrates Court (Derby)")
        await expect(this.getQA('convictionDateLabel')).toContainText("Conviction date")
        await expect(this.getQA('convictionDateValue')).toContainText("6 August 2024")
        await expect(this.getQA('additionalSentencesLabel')).toContainText("Additional sentences")
    }

    async checkSentenceSectionInORACommunity() {
        await expect(this.getQA('sentenceCard')).toContainText("Sentence")
        await expect(this.getQA('orderDescriptionLabel')).toContainText("Order")
        await expect(this.getQA('orderDescriptionValue')).toContainText("ORA Community Order")
        await expect(this.getQA('orderEventNumberLabel')).toContainText("NDelius event number")
        await expect(this.getQA('orderEventNumberValue')).toContainText("1")
        await expect(this.getQA('orderStartDateLabel')).toContainText("Sentence start date")
        await expect(this.getQA('orderStartDateValue')).toContainText("6 August 2024")
        await expect(this.getQA('orderReleaseDateLabel')).toContainText("Date released on licence")
        await expect(this.getQA('orderReleaseDateValue')).toContainText("No release date details")
        await expect(this.getQA('orderEndDateLabel')).toContainText("Expected sentence end date")
        await expect(this.getQA('orderEndDateValue')).toContainText("5 February 2025")
        await expect(this.getQA('orderTimeElapsedLabel')).toContainText("Time elapsed")
        await expect(this.getQA('orderTimeElapsedValue')).toContainText("19 months elapsed (of 6 months)")
        await expect(this.getQA('requirementsLabel')).toContainText("Requirements")
        expect(this.page.getByRole('link', {name: /5 of 90 RAR days completed/}).isVisible())
        expect(this.page.getByRole('link', {name: /Curfew (Police Checks Only) - Curfew/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - New Me Strengths/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - Rehabilitation Activity Requirement (RAR)/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - New Me Strengths/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - Living As New Me/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - Living As New Me/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - COVAID (Control - Angry Impulsive Drinkers)/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - iHorizon/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - TSP (Thinking Skills)/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - Resolve/}).isVisible())
        expect(this.page.getByRole('link', {name: /Alcohol Treatment - Alcohol Treatment/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR\/GAR Accredited Programmes - Building Better Relationships (BBR)/}).isVisible())
        expect(this.page.getByRole('link', {name: /5 of 15 RAR days completed/}).isVisible())
        expect(this.page.getByRole('link', {name: /5 of 32 RAR days completed/}).isVisible())
        expect(this.page.getByRole('link', {name: /5 of 35 RAR days completed/}).isVisible())
        expect(this.page.getByRole('link', {name: /RAR Supervision Period Length/}).isVisible())
        expect(this.page.getByRole('link', {name: /5 of 30 RAR days completed/}).isVisible())
        await expect(this.getQA('courtDocumentsLabel')).toContainText("Court documents")
        expect(this.page.getByRole('link', {name: /CPS_001.docx/}).isVisible())

    }


    async checkOffenceSectionInCJADeferredSentence() {
        await expect(this.getQA('offenceCard')).toContainText("Offence")
        await expect(this.getQA('offenceCard')).toContainText("Main offence")
        await expect(this.getQA('mainOffenceValue')).toContainText("(Buggery and attempted buggery - 01600) (3 count)")
        await expect(this.getQA('dateOfOffenceLabel')).toContainText("Offence date")
        await expect(this.getQA('dateOfOffenceValue')).toContainText("17 September 2024")
        await expect(this.getQA('offenceNotesLabel')).toContainText("Notes")
        await expect(this.getQA('offenceNotesValue')).toContainText("Test 3")
        await expect(this.getQA('additionalOffencesLabel')).toContainText("Additional offences")
        await expect(this.getQA('additionalOffencesValue')).toContainText("View additional offence details")
    }

    async checkConvictionSectionInCJADeferredSentence() {
        await expect(this.getQA('sentencingCourtLabel')).toContainText("Sentencing court")
        await expect(this.getQA('sentencingCourtValue')).toContainText("Alloa Sheriff's Court")
        await expect(this.getQA('responsibleCourtLabel')).toContainText("Responsible court")
        await expect(this.getQA('responsibleCourtValue')).toContainText("Alloa Sheriff's Court")
        await expect(this.getQA('convictionDateLabel')).toContainText("Conviction date")
        await expect(this.getQA('convictionDateValue')).toContainText("17 September 2024")
        await expect(this.getQA('convictionDateLabel')).toContainText("Conviction date")
        await expect(this.getQA('additionalSentencesLabel')).toContainText("Additional sentences")
    }

    async checkSentenceSectionInCJADeferredSentence() {
        await expect(this.getQA('sentenceCard')).toContainText("Sentence")
        await expect(this.getQA('orderDescriptionLabel')).toContainText("Order")
        await expect(this.getQA('orderDescriptionValue')).toContainText("CJA - Deferred Sentence")
        await expect(this.getQA('orderEventNumberLabel')).toContainText("NDelius event number")
        await expect(this.getQA('orderEventNumberValue')).toContainText("3")
        await expect(this.getQA('orderStartDateLabel')).toContainText("Sentence start date")
        await expect(this.getQA('orderStartDateValue')).toContainText("17 September 2024")
        await expect(this.getQA('orderReleaseDateLabel')).toContainText("Date released on licence")
        await expect(this.getQA('orderReleaseDateValue')).toContainText("No release date details")
        await expect(this.getQA('orderEndDateLabel')).toContainText("Expected sentence end date")
        await expect(this.getQA('orderEndDateValue')).toContainText("16 May 2025")
        await expect(this.getQA('orderTimeElapsedLabel')).toContainText("Time elapsed")
        await expect(this.getQA('orderTimeElapsedValue')).toContainText("17 months elapsed (of 8 months)")
        await expect(this.getQA('requirementsLabel')).toContainText("Requirements")
        expect(this.page.getByRole('link', {name: /Alcohol Treatment - Alcohol Treatment/}).isVisible())
        expect(this.page.getByRole('link', {name: /Alcohol Treatment - Alcohol Treatment/}).isVisible())
        await expect(this.getQA('courtDocumentsLabel')).toContainText("Court documents")
        await expect(this.getQA('courtDocumentsValue')).toContainText("No court documents")
    }


    async checkProbationHistoryDetails() {
        const sentencePage = new SentencePage(this.page)
        await this.page.getByRole('link', {name: /Probation history/}).click()
        await this.page.waitForURL('**/probation-history')
        await expect(this.getQA('pageHeading').nth(1)).toContainText("Probation history")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous probation details")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous orders")
        await expect(this.getQA('probationHistoryCard')).toContainText("4 previous orders")
        await expect(this.getQA('probationHistoryCard')).toContainText("Previous breaches")
        await expect(this.getQA('probationHistoryCard')).toContainText("1 previous breach")
        await expect(this.getQA('probationHistoryCard')).toContainText("9 previous contacts")

        await sentencePage.useBreadcrumbs(2)
    }

    async checkScoreHistory() {
        await this.page.getByRole('link', {name: /View OASys score history/}).click()
        await this.page.waitForURL('**/oasys-score-history')
        await expect(this.getQA('pageHeading')).toContainText("OASys score history")
        await this.useBreadcrumbs(2)
        await this.checkOnPage()
    }

    async checkLinks(linkName: string) {
        switch (linkName) {
            case 'Probation history':
                await this.checkProbationHistoryDetails()
                break;
            case 'CJA - Deferred Sentence':
                await this.checkCJADeferredSentenceLink()
                break;
            case 'ORA Community Order':
                await this.checkORACommunityOrderLink()
                break;
            case 'Adult Custody < 12m':
                await this.checkAdultCustodyLessThan12MLink()
                break;
        }
    }


}