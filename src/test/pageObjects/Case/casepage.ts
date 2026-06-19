import {expect, Page} from "@playwright/test";
import MPopPage from "../page";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string;

    protected constructor(page: Page, title?: string | RegExp, crn?: string) {
        super(page, title);
        this.crn = crn;
    }

    async assertOnPage(allowRestricted: boolean = true): Promise<string | void> {
        await this.page.waitForLoadState("networkidle");
        const onPage = await this.checkOnPage();
        if (!onPage && allowRestricted) {
            const restricted = await this.isRestricted();
            if (restricted) {
                await this.clickBackLink();
                return "restricted";
            }
        }
        try {
            expect(onPage).toBeTruthy();
        } catch {
            throw (
                "Expected to be on page: " + this.constructor.name + ", but was not."
            );
        }
    }

    async isRestricted(): Promise<boolean> {
        try {
            await expect(this.getClass("govuk-heading-l")).toContainText(
                "You are restricted from viewing this case",
            );
            return true;
        } catch {
            return false;
        }
    }

    async useBreadcrumbs(id: number) {
        //0 returns to cases, 1 returns to overview
        await this.getClass("govuk-breadcrumbs").getByRole("link").nth(id).click();
    }

    async checkCrn(crn?: string) {
        await this.checkQA("crn", (crn ?? this.crn)!);
    }

    async checkPopHeader(crn?: string) {
        const checkCrn = (crn ?? this.crn)!;
        await this.checkQA("crn", checkCrn);
    }

    async assertTextOnOverviewPage(expectedText: string) {
        await expect(
            this.page.locator(`[class=govuk-heading-m]`).nth(1),
        ).toContainText(expectedText);
    }

    async assertLinkTextOnOverviewPage(expectedHref: string) {
        const href = await this.page
            .locator(".govuk-notification-banner__content ul li a")
            .first()
            .getAttribute("href");
        expect(href).toEqual(expectedHref);
    }

    async selectOutcomeLink() {
        await this.page
            .locator(".govuk-notification-banner__content ul li a")
            .click();
    }


    async assertRequirementText(expectedText: string) {
        if (expectedText == "requirements")
            await expect(this.getQA("requirementsLabel")).toContainText(
                expectedText,);
        else if (expectedText == "Licence conditions")
            await expect(this.getQA("licenceConditionsLabel")).toContainText(
                expectedText,);
    }

    async assertGPSDataLink(expectedLinkText: string) {
        if (expectedLinkText == "Location Monitoring(GPS Tagging) - Monitored Appointment")
            await expect(this.getQA("requirementsEMDILink")).toContainText(expectedLinkText,);

        else if (expectedLinkText == "View GPS location monitoring data")
            await expect(this.getQA("licencesEMDILink")).toContainText(expectedLinkText,);

    }

    async selectLink(linkName: string) {
        if (linkName == "ORA Community Order")
            await this.page.getByRole("link", {name: /ORA Community Order/}).click();
        else if (linkName == "ORA Adult Custody (inc PSS)")
            await this.page.getByRole("link", {name: /ORA Adult Custody/}).click();
    }






}

