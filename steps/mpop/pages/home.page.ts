import {  Page } from "@playwright/test";
import MPopPage from "./page";
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class HomePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage people on probation")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/`)
    }
    
}