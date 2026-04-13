import { expect, Locator, Page } from "@playwright/test";
import ContactPage from "./contact.page";
import ActivityLogPage from "../../activity-log.page";

export type AddContactDetails = {
    contact: string;
    relationTo: string;
    title?: string;
    date?: string;
    time?: string;
    contactDetails?: string;
    visorReport?: string;
    sensitiveInfo?: string;
    alertPractitioner?: string;
};

export default class AddContactPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Add a contact", crn, uuid);
    }

    async clickAddContactButton(): Promise<void> {
        await this.clickLink("Add a contact");
    }

    async selectFrequentContact(contact: string): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        const frequentContact = this.page.getByRole("radio", {
            name: contact,
            exact: true,
        });

        await expect(frequentContact).toBeVisible();
        await frequentContact.check();
    }

    async selectContactRelatedTo(contactType: string): Promise<string> {
        const fieldset = this.page.getByRole("group", {
            name: "What is the contact related to?",
        });

        await expect(fieldset).toBeVisible();

        const radios = fieldset.getByRole("radio");
        const count = await radios.count();

        if (count < 2) {
            throw new Error(`Expected at least 2 options, but found ${count}`);
        }

        let index: number;

        if (contactType.trim().toUpperCase() === "MPOP") {
            index = 0; // first radio
        } else {
            index =  0; // second radio
        }

        const selectedRadio = radios.nth(index);

        await expect(selectedRadio).toBeVisible();
        await selectedRadio.check();

        return await selectedRadio.textContent() ?? `option-${index}`;
    }

    async enterTitle(title: string): Promise<void> {
        const titleInput = this.page
            .locator("label")
            .filter({ hasText: "Give the contact a different title" })
            .locator("..")
            .locator("input");

        await expect(titleInput).toBeVisible();
        await titleInput.fill(title);
    }

    async enterDate(date: string): Promise<void> {
        const dateInput = this.page.getByLabel("Date", { exact: true });
        await expect(dateInput).toBeVisible();
        await dateInput.fill(date);
    }

    async enterTime(time: string): Promise<void> {
        const timeInput = this.page.getByLabel("Time", { exact: true });
        await expect(timeInput).toBeVisible();
        await timeInput.fill(time);
    }

    async enterContactDetails(details: string): Promise<void> {
        const detailsTextArea = this.page.locator("textarea");
        await expect(detailsTextArea).toBeVisible();
        await detailsTextArea.fill(details);
    }

    private async selectOptionalBinaryQuestion(
        questionText: string | RegExp,
        value?: string,
        labels?: { yesLabel?: string; noLabel?: string }
    ): Promise<void> {
        if (value === undefined || value.trim() === "") {
            return;
        }

        const fieldset =
            typeof questionText === "string"
                ? this.page.locator("fieldset").filter({ hasText: questionText })
                : this.page.locator("fieldset").filter({ hasText: questionText });

        if ((await fieldset.count()) === 0) {
            return;
        }

        if (!(await fieldset.first().isVisible())) {
            return;
        }

        const isYes = this.toBoolean(value);
        const optionLabel = isYes
            ? labels?.yesLabel ?? "Yes"
            : labels?.noLabel ?? "No";

        await fieldset.getByRole("radio", { name: optionLabel, exact: true }).check();
    }


    async selectVisorInformation(value: string): Promise<void> {
        const fieldset = this.page.locator('fieldset').filter({
            hasText: 'Include contact in ViSOR report?',
        });

        // Check if it exists in DOM
        if (await fieldset.count() === 0) {
            console.log('ViSOR section not present - skipping');
            return;
        }

        // Optional: ensure visible before interacting
        if (!(await fieldset.isVisible())) {
            console.log('ViSOR section not visible - skipping');
            return;
        }

        if (value === undefined || value.trim() === '') {
            console.log('No value provided for ViSOR - skipping');
            return;
        }

        const isYes = this.toBoolean(value);
        const optionLabel = isYes ? 'Yes' : 'No';

        await fieldset.getByRole('radio', { name: optionLabel }).check();
    }

    async selectVisorReport(value?: string): Promise<void> {
        await this.selectOptionalBinaryQuestion("Include contact in ViSOR report?", value);
    }

    async selectAlertPractitioner(value?: string): Promise<void> {
        await this.selectOptionalBinaryQuestion(
            /Do you want to alert .* about this contact\?/i,
            value
        );
    }


    async provideContactDetails(data: AddContactDetails): Promise<void> {
        await this.selectContactRelatedTo(data.relationTo);

        if (data.title?.trim()) {
            await this.enterTitle(data.title);
        }

        if (data.date?.trim()) {
            await this.enterDate(data.date);
        }

        if (data.time?.trim()) {
            await this.enterTime(data.time);
        }

        if (data.contactDetails?.trim()) {
            await this.enterContactDetails(data.contactDetails);
        }

        if (data.visorReport !== undefined) {
            await this.selectVisorReport(data.visorReport);
        }

        if (data.sensitiveInfo !== undefined) {
            await this.selectSensitiveInformation(data.sensitiveInfo);
        }

        if (data.alertPractitioner !== undefined) {
            await this.selectAlertPractitioner(data.alertPractitioner);
        }
    }

    private getContactRelatedToFieldset(): Locator {
        return this.page.locator("fieldset").filter({
            hasText: "What is the contact related to?",
        });
    }

    private async selectBinaryQuestion(
        questionText: string,
        value: string,
        labels?: { yesLabel?: string; noLabel?: string }
    ): Promise<void> {
        const fieldset = this.page.locator("fieldset").filter({
            hasText: questionText,
        });

        await expect(fieldset).toBeVisible();

        const isYes = this.toBoolean(value);
        const optionLabel = isYes
            ? labels?.yesLabel ?? "Yes"
            : labels?.noLabel ?? "No";

        await fieldset.getByRole("radio", { name: optionLabel, exact: true }).check();
    }

    private toBoolean(value: string): boolean {
        return value.trim().toLowerCase() === "true";
    }

    async checkOnPage(): Promise<boolean>{
        try {
            await this.checkQA("pageHeading", "Contacts")
            return true
        } catch {
            return false
        }
    }


async selectSensitiveInformation(value?: string): Promise<void> {
    if (!value || value.trim() === "") return;

const fieldset = this.page.getByRole("group", {
    name: "Does this contact include sensitive information?",
});

await expect(fieldset).toBeVisible();

const isYes = value.trim().toLowerCase() === "true";
const optionLabel = isYes
    ? "Yes, it includes sensitive information"
    : "No, it is not sensitive";

const option = fieldset.getByRole("radio", {
    name: optionLabel,
    exact: true,
});

await expect(option).toBeVisible();
await option.check();
}
}