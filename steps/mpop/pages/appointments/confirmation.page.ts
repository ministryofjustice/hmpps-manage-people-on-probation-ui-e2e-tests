import { expect, Page } from "@playwright/test";
import MPopPage from "../page";
import NextAppointmentPage from "./next-appointment.page";
import AppointmentsPage from "../appointments.page";

export default class ConfirmationPage extends MPopPage {
    constructor(page: Page) {
        super(page, 'Appointment arranged')
    }

    async completePage(option: string): Promise<MPopPage> {
        if (option === "createAnother"){
            await this.clickLink('arrange another appointment')
            return new NextAppointmentPage(this.page)
        } else if (option === "returnToAll") {
            await this.clickLink('Return to all cases')
            // return new CasesPage(this.page)
        } else {
            await this.submit()
            // return new OverviewPage(this.page)
        }
    }
}