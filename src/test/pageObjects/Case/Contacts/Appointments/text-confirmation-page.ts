import {expect, Page } from "@playwright/test";
import ContactPage from "../contactpage";

import { TextMessageOption } from '../../../../util/ArrangeAppointment';
export default class TextConfirmationPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Text message confirmation", crn, uuid)
    }

    private formatDateForSMS(dateStr: string): string {
        const [day, month, year] = dateStr.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        return dateObj.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }

    private formatTimeForSMS(time24: string): string {
        const [hourStr, minuteStr] = time24.split(':');
        let hour = Number(hourStr);
        const minute = minuteStr.padStart(2, '0'); // ensure 2 digits

        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        if (hour === 0) hour = 12; // midnight or noon

        return `${hour}:${minute}${ampm}`;
    }


    //
    async completePage(text: string, mobile: string, date: string, startTime: string, locationId: string | number) {
        const smsWrapper = this.page.locator('div.sms-message-wrapper');

        // Format date and time for SMS validation
        const formattedDate = date ? this.formatDateForSMS(date) : undefined;
        const formattedStartTime = startTime ? this.formatTimeForSMS(startTime) : undefined;

        console.log("text:", text);
        console.log("mobile:", mobile);
        console.log("formattedDate:", formattedDate);
        console.log("formattedStartTime:", formattedStartTime);

        switch (text) {
            case 'yes':
                await this.page.locator('input[type="radio"][value="YES"]').check();

                // Wait for SMS preview to appear
                await smsWrapper.waitFor({ state: 'visible', timeout: 15000 });
                const smsTextYes = await smsWrapper.innerText();
                console.log("SMS Text (YES):", smsTextYes);

                if (formattedDate) expect(smsTextYes).toContain(formattedDate);
                if (formattedStartTime) expect(smsTextYes).toContain(formattedStartTime);
                await this.submit();
                break;

            case 'yes-add':
                await this.page.locator('input[type="radio"][value="YES_ADD_MOBILE_NUMBER"]').check();
                console.log("location Id :", locationId);
                await smsWrapper.waitFor({ state: 'visible', timeout: 15000 });

                const smsTextAdd = await smsWrapper.innerText();
                console.log("SMS Text (YES_ADD):", smsTextAdd);

                if (formattedDate) expect(smsTextAdd).toContain(formattedDate);
                if (formattedStartTime) expect(smsTextAdd).toContain(formattedStartTime);
                await this.submit();

                await this.page.waitForLoadState('networkidle');
                if (!mobile) throw new Error('Mobile number is required when using yes-add');
                await this.page.getByRole('textbox', { name: /mobile/i }).fill(mobile);
                await this.continueButton();
                break;

            case 'yes-update':
                await this.page.locator('input[type="radio"][value="YES_UPDATE_MOBILE_NUMBER"]').check();

                await smsWrapper.waitFor({ state: 'visible', timeout: 15000 });
                const smsTextUpdate = await smsWrapper.innerText();
                console.log("SMS Text (YES_UPDATE):", smsTextUpdate);

                if (formattedDate) expect(smsTextUpdate).toContain(formattedDate);
                if (formattedStartTime) expect(smsTextUpdate).toContain(formattedStartTime);
                await this.submit();

                await this.page.waitForLoadState('networkidle');
                if (!mobile) throw new Error('Mobile number is required when using yes-update');
                await this.page.getByRole('textbox', { name: /mobile/i }).fill(mobile);
                await this.continueButton();
                break;

            case 'no':
                await this.page.locator('input[type="radio"][value="NO"]').check();

                await smsWrapper.waitFor({ state: 'visible', timeout: 15000 });
                const smsTextNo = await smsWrapper.innerText();
                console.log("SMS Text (No):", smsTextNo);

                if (formattedDate) expect(smsTextNo).toContain(formattedDate);
                if (formattedStartTime) expect(smsTextNo).toContain(formattedStartTime);
                await this.submit();
                break;
        }
    }
}



