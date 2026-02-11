import { Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { navigateToCase } from "../../utilities/Navigation";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class PersonalDetailsPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Personal details", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/personal-details/`)
    }

    async navigateTo(crn?: string){
        navigateToCase(this.page, (crn ?? this.crn)!)
    }
}