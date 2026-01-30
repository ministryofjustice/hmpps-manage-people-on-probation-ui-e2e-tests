import { Page } from "@playwright/test";
import NextAppointmentPage from "./next-appointment.page";
import ContactPage from "../contactpage";

export default class ConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Appointment arranged", crn, uuid)
    }
    
    async completePage(option: string) {
        if (option === "createAnother"){
            await this.clickLink('arrange another appointment')
            return new NextAppointmentPage(this.page)
        } else if (option === "returnToAll") {
            await this.clickLink('Return to all cases')
        } else {
            await this.submit()
        }
    }
}