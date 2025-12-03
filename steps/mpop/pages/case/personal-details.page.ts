import { expect, Locator, Page } from "@playwright/test";
import MPopPage from "../page";
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class PersonalDetailsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Personal details")
    }

    async goTo(crn: string){
       await this.page.goto(`${MPOP_URL}/case/${crn}/personal-details/`)
    }
}