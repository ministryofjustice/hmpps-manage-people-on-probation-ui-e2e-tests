
import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import * as dotenv from 'dotenv'
import SentencePage from "../appointments/sentence.page";
import CaseUpcomingAppointmentsPage from "../appointments/upcoming-appointments.page";
import ActivityLogPage from "./activity-log.page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class OverviewPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Overview")
    }

    async goTo(crn: string){
       await this.page.goto(`${MPOP_URL}/case/${crn}/`)
    }

    async checkOnlineCheckInsSectionExists(){
        await this.getQA("checkinCard").isVisible()
        await this.getQA("frequencyLabel").isVisible()
        await this.getQA("contactPrefLabel").isVisible()
    }
}