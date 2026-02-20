import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

import { TextMessageOption } from '../../../../util/ArrangeAppointment';
export default class TextConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Text message confirmation", crn, uuid)
    }

    // async completePage(option: boolean, mobile: string = '') {
    //     await this.clickRadio("smsOptIn", option ? 0 : 1)
    //     await this.submit()
    // }
    async completePage(text: TextMessageOption, mobile?: string) {

        switch (text) {

            case 'yes':
                await this.page.locator('input[type="radio"][value="YES"]').check()
                console.log(text)
                break

            case 'yes-add':
                await this.page.locator('input[type="radio"][value="YES_ADD_MOBILE_NUMBER"]').check()
                console.log(text)
                break

            case 'yes-update':
                await this.page.locator('input[type="radio"][value="YES_UPDATE_MOBILE_NUMBER"]').check()
                console.log(text)
                await this.page.getByRole('textbox', { name: /mobile/i }).fill(mobile!)
                break

            case 'no':
                await this.page.locator('input[type="radio"][value="NO"]').check()
                console.log(text)
                break
        }
    }

}



