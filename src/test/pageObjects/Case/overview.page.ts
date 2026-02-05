import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { navigateToCase } from "../../utilities/Navigation";
import { MPoPCheckinDetails } from "../../utilities/SetupOnlineCheckins";
import { dateWithDayAndWithoutYear, formatToLongDay, lastWeek, luxonString, nextWeek, today, yesterday } from "../../utilities/DateTime";
import { DateTime } from "luxon";

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
            await expect(this.getQA("checkinCard").getByRole('link')).toHaveText("View all online check in details", {timeout: 5000})
            return true
        } catch {
            return false
        }
    }

    async NotMadeToday(): Promise<boolean> {
        const dateStr = await (await this.getSummaryRowValue(await this.getSummaryRowByKey('First check in'))).allTextContents()
        const string = dateStr[0].trim() + ' 2026'
        const date = DateTime.fromFormat(string,'cccc d MMMM y')
        console.log(date)
        if (date < nextWeek.minus({days: 3})){
            return true
        }
        return false
    }

    async checkOnlineCheckInsSectionExists(){
        await this.getQA("checkinCard").isVisible()
        await this.getQA("frequencyLabel").isVisible()
        await this.getQA("contactPrefLabel").isVisible()
    }

    async navigateTo(crn?: string){
        await navigateToCase(this.page, (crn ?? this.crn)!)
    }

    async verifyCheckinDetails(details: MPoPCheckinDetails){
        await this.getQA("checkinCard").isVisible()
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('First check in'), dateWithDayAndWithoutYear(details.date))
    }
}