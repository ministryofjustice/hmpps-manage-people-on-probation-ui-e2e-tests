import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { navigateToCase } from "../../utilities/Navigation";
import getUserFriendlyString, { MPoPCheckinDetails } from "../../utilities/SetupOnlineCheckins";
import { dateWithDayAndWithoutYear, formatToLongDay, lastWeek, luxonString, nextWeek, today, yesterday } from "../../utilities/DateTime";
import { DateTime } from "luxon";
import { FrequencyOptions } from "./Contacts/Checkins/SetUp/date-frequency.page";
import { Preference } from "./Contacts/Checkins/SetUp/contact-preference.page";

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

    async NotMadeToday(): Promise<boolean> {
        const dateStr = await (await this.getSummaryRowValue(await this.getSummaryRowByKey('First check in'))).allTextContents()
        const string = dateStr[0].trim() + ' 2026'
        console.log(string)
        const date = DateTime.fromFormat(string,'cccc d MMMM y')
        if (date <= yesterday){
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
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('Frequency'), getUserFriendlyString(FrequencyOptions[details.frequency]))
        await this.checkSummaryRowValue(await this.getSummaryRowByKey('Contact preferences'), getUserFriendlyString(Preference[details.preference]))
    }
}