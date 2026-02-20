import { Page } from "@playwright/test";
import ContactPage from "../contactpage";

import { TextMessageOption } from '../../../../util/ArrangeAppointment';
export default class TextConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Text message confirmation", crn, uuid)
    }

    async completePage(text: TextMessageOption, mobile?: string) {

        switch (text) {

            case 'yes':
                await this.page.locator('input[type="radio"][value="YES"]').check()
                await this.submit()
                break

            case 'yes-add':
                await this.page.locator('input[type="radio"][value="YES_ADD_MOBILE_NUMBER"]').check()
                await this.submit()
                // Wait for navigation to mobile page
                await this.page.waitForLoadState('networkidle')

                if (!mobile) {
                    throw new Error('Mobile number is required when using yes-add')
                }

                await this.page.getByRole('textbox', { name: /mobile/i }).fill(mobile)
                await this.continueButton()
                break

            case 'yes-update':
                await this.page.locator('input[type="radio"][value="YES_UPDATE_MOBILE_NUMBER"]').check()
                await this.submit()
                await this.page.waitForLoadState('networkidle')

                if (!mobile) {
                    throw new Error('Mobile number is required when using yes-add')
                }

                await this.page.getByRole('textbox', { name: /mobile/i }).fill(mobile)
                await this.continueButton()
                break

            case 'no':
                await this.page.locator('input[type="radio"][value="NO"]').check()
                await this.submit()
                break
        }
    }

}



