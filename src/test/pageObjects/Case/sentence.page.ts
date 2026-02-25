import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation, navigateToCase } from "../../util/Navigation";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class CaseSentencePage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Sentence", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/sentence/`)
    }

    async navigateTo(crn?: string){
        await caseNavigation(this.page, (crn ?? this.crn)!, "sentenceTab")
    }
}