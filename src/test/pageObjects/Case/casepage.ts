import {expect, Page} from "@playwright/test";
import MPopPage from "../page";
import UpcomingAppointmentsPage from "../upcoming.page";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string;

    protected constructor(page: Page, title?: string | RegExp, crn?: string) {
        super(page, title);
        this.crn = crn;
    }

    async getNewestAppointment() {
        try {
            await this.clickLink("View all upcoming appointments.");
            const upcomingAppointment = new UpcomingAppointmentsPage(this.page);
            await upcomingAppointment.assertOnPage();
            //sort descending
            await upcomingAppointment.page
                .getByRole("button", { name: "Date" })
                .click();
            await upcomingAppointment.page
                .getByRole("button", { name: "Date" })
                .click();
            await this.getQA("upcomingAppointments")
                .getByRole("link", { name: /Manage/ })
                .first()
                .click();
        } catch {
            await this.getQA("upcomingAppointmentsSection")
                .getByRole("link", { name: /Manage/ })
                .last()
                .click();
        }
    }

    async assertOnPage(allowRestricted: boolean = true) {
        await this.page.waitForLoadState("networkidle");
        const onPage = await this.checkOnPage();
        if (!onPage && allowRestricted) {
            const restricted = await this.isRestricted();
            if (restricted) {
                await this.clickBackLink();
                return;
            }
        }
        expect(onPage).toBeTruthy();
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
        const href = await this.page.locator(".govuk-notification-banner__content ul li a").first().getAttribute('href');
        expect(href).toEqual(expectedHref);
    }

    async selectOutcomeLink() {
        await this.page.locator(".govuk-notification-banner__content ul li a").click();
    }
}