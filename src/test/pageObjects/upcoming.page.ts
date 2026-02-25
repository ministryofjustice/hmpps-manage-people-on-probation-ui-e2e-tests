import { Page } from "@playwright/test";
import MPopPage from "./page";

export default class UpcomingAppiointmentsPage extends MPopPage {
    constructor(page: Page) {
        super(page, "My upcoming appointments")
    }

    async selectOfficeVisit(id: number = 0){
        await this.page.getByRole('link', {name: 'Planned Office Visit (NS)' }).nth(id).click()
    }
}