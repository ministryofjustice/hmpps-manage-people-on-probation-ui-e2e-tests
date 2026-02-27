import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { navigateToCase } from "../../util/Navigation";
import getUserFriendlyString, { MPoPCheckinDetails } from "../../util/SetupOnlineCheckins";
import { dateWithDayAndWithoutYear, formatToLongDay, lastWeek, luxonString, nextWeek, today, yesterday } from "../../util/DateTime";
import { DateTime } from "luxon";
import { FrequencyOptions } from "./Contacts/Checkins/SetUp/date-frequency.page";
import { Preference } from "./Contacts/Checkins/SetUp/contact-preference.page";
import AppointmentsPage from "./appointments.page";
import ContactPage from "./Contacts/contactpage";
import InstructionsPage from "./Contacts/Checkins/SetUp/instructions.page";
import ManageCheckInsPage from "./Contacts/Checkins/manage.page";
import PersonalDetailsPage from "./personal-details.page";
import RiskPage from "./risk.page";
import CaseSentencePage from "./sentence.page";
import CompliancePage from "./compliance.page";
import ActivityLogPage from "./activity-log.page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class OverviewPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Overview", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/`)
    }

    async checkOnlineCheckInsSetup(): Promise<boolean> {
        try {
            await expect(this.getQA("checkinCard").getByRole('link')).toHaveText("View all online check in details", {timeout: 1000})
            return true
        } catch {
            return false
        }
    }

    async checkAppointmentsSection() {
        await this.getQA('scheduleCard').isVisible()
    }
    async checkOnlineCheckInsSection(){
        await this.getQA("checkinCard").isVisible()
    }
    async checkPersonalDetailsSection() {
        await this.getQA('personalDetailsCard').isVisible()
    }
    async checkRiskSection() {
        await this.getQA('riskCard').isVisible()
    }
    async checkActivityAndComplianceSection() {
        await this.getQA('activityAndComplianceCard').isVisible()
    }
    async checkSentences(ids: number[]){
        for (let i=0; i<ids.length; i++){
            await this.getQA(`sentence${ids[i]}Card`).isVisible()
        }
    }
    async checkSections() {
        await this.checkAppointmentsSection()
        await this.checkOnlineCheckInsSection()
        await this.checkPersonalDetailsSection()
        await this.checkRiskSection()
        await this.checkActivityAndComplianceSection()
    }

    async checkAppointmentsLink() {
        await this.checkLink('scheduleCard', 'View appointments', new AppointmentsPage(this.page))
    }
    async checkOnlineCheckInsLink() {
        const setup = await this.checkOnlineCheckInsSetup()
        if (setup){
            await this.checkLink('checkinCard', 'View all online check in details', new ManageCheckInsPage(this.page))
        } else {
            await this.checkLink('checkinCard', 'Set up online check ins', new InstructionsPage(this.page))
        }
    }
    async checkPersonalDetailsLink() {
        await this.checkLink('personalDetailsCard', 'View all personal details', new PersonalDetailsPage(this.page))
    }
    async checkRiskLink() {
        await this.checkLink('riskCard', 'View all risk details', new RiskPage(this.page))
    }
    async checkSentenceLinks(ids: number[]){
        for (let i=0; i<ids.length; i++){
            await this.checkLink(`sentence${ids[i]}Card`, 'View all sentence details', new CaseSentencePage(this.page))
        }
    }
    async checkComplianceLink(){
        await this.checkLink('activityAndComplianceCard', 'View all compliance details', new CompliancePage(this.page))
    }
    async checkContactsLink(){
        await this.checkLink('activityAndComplianceCard', 'View all contacts details', new ActivityLogPage(this.page))
    }
    async checkLink(qa: string, link: string, page: CasePage){
        await this.getQA(qa).getByRole('link', {name: link}).click()
        await page.checkOnPage()
        if (page instanceof ContactPage){
            await page.clickBackLink()
        } else {
            await page.useBreadcrumbs(1)
        }
    }
    async checkLinks() {
        await this.checkAppointmentsLink()
        await this.checkOnlineCheckInsLink()
        await this.checkPersonalDetailsLink()
        await this.checkRiskLink()
        await this.checkComplianceLink()
        await this.checkContactsLink()
    }

    async NotMadeToday(): Promise<boolean> {
        const dateStr = await (await this.getSummaryRowValue(await this.getSummaryRowByKey('First check in'))).allTextContents()
        const string = dateStr[0].trim() + ' 2026'
        const date = DateTime.fromFormat(string,'cccc d MMMM y')
        if (date <= yesterday){
            return true
        }
        return false
    }

    async navigateTo(crn?: string){
        await navigateToCase(this.page, (crn ?? this.crn)!)
    }

    async verifyCheckinDetails(details: MPoPCheckinDetails){
        await this.getQA("checkinCard").isVisible()
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('First check in'), dateWithDayAndWithoutYear(details.date))
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('Frequency'), getUserFriendlyString(FrequencyOptions[details.frequency]))
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('Contact preferences'), getUserFriendlyString(Preference[details.preference]))
    }
}