import { Locator, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import HomePage from "./home.page";
import { baseNavigation } from "../utilities/Navigation";
import MPopPage from "./page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class AlertsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Alerts")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/alerts`)
    }

    getTableRowByCRN(crn: string): Locator {
        return this.getClass('govuk-table_row').filter({has: this.page.getByRole('paragraph', {name: crn})})
    }

    async navigateTo(page: Page) {
        await baseNavigation(page, "Alerts")
    }
}