import {expect, Page} from "@playwright/test";
import MPopPage from "../page";
import {today} from "../../util/DateTime";
import {DateTime} from "luxon";
import {parse, format, subYears} from "date-fns";

export default abstract class CasePage extends MPopPage {
    readonly crn?: string;

    protected constructor(page: Page, title?: string | RegExp, crn?: string) {
        super(page, title);
        this.crn = crn;
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

    // async assertTitleOnOutcomePage(expectedTitle: string) {
    //     const actualTitle = await this.page.title();
    //     expect(actualTitle).toEqual(expectedTitle);
    // }
    //
    // async assertDefaultRadioSelection(expectedRadio: string) {
    //     const radioButton = this.page.locator('input[type="radio"][value="PAST_TWO_YEARS"]')
    //     await radioButton.isVisible();
    //     await expect(radioButton).toBeChecked();
    // }
    //
    //
    // async selectOlderThanYearsRadio(years: number) {
    //     if (years === 2) {
    //         await this.page.locator('input[type="radio"][value="OLDER_THAN_TWO_YEARS"]').click()
    //     } else {
    //         throw new Error(`Radio button for Older than ${years} years not implemented`);
    //     }
    // }
    //
    // async selectApplyFilter() {
    //     await this.page.locator('[data-qa="submit-button"]').click()
    // }
    //
    // async assertOlderThanYearsResults(years: number) {
    //     const labels = await this.page.locator(".govuk-radios__item label").allInnerTexts();
    //     // The first few labels are filter options (Past 2 years, Older than 2 years, All)
    //     // We need to skip them and look at the actual results.
    //     const results = labels.filter(text => text.includes("\n"));
    //
    //     const thresholdDate = today.minus({ years });
    //
    //     for (const result of results) {
    //         // Example result: "AL Contact Type for RAR\nFriday 26 April 2024 from 9am"
    //         const lines = result.split("\n");
    //         if (lines.length < 2) continue;
    //
    //         const datePart = lines[1].split(" from ")[0]; // "Friday 26 April 2024"
    //         const parsedDate = DateTime.fromFormat(datePart, "EEEE d MMMM yyyy", { zone: "Europe/London" });
    //
    //         expect(parsedDate.isValid, `Failed to parse date: ${datePart} from result: ${result}`).toBeTruthy();
    //         expect(parsedDate < thresholdDate, `Date ${parsedDate.toISODate()} is not older than ${years} years (threshold: ${thresholdDate.toISODate()})`).toBeTruthy();
    //     }
    // }
    //
    // async selectAllFilterOption() {
    //     await this.page.locator('input[type="radio"][value="ALL"]').click()
    // }
    //
    // async assertAllRadioSelected() {
    //     const radioButton = this.page.locator('input[type="radio"][value="ALL"]')
    //     await expect(radioButton).toBeChecked();
    // }
    //
}