import { Locator, Page } from "@playwright/test";
import { baseNavigation } from "../util/Navigation";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";

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