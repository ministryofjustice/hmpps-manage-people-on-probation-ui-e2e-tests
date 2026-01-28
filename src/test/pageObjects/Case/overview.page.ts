import { Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { navigateToCase } from "../../Utilities/Navigation";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class OverviewPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Overview", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/`)
    }

    async checkOnlineCheckInsSectionExists(){
        await this.getQA("checkinCard").isVisible()
        await this.getQA("frequencyLabel").isVisible()
        await this.getQA("contactPrefLabel").isVisible()
    }

    async navigateTo(crn?: string){
        navigateToCase(this.page, (crn ?? this.crn)!)
    }
}