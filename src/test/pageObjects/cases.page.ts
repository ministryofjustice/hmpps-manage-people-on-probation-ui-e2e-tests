import { expect, Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";
import { baseNavigation } from "../util/Navigation";
import OverviewPage from "./Case/overview.page";
import RecentCasesPage from "./recent-cases.page";
import { CaseFilters } from "../util/Cases";
import { DataTable } from "playwright-bdd";

export default class CasesPage extends MPopPage {
  constructor(page: Page) {
    super(page, "Cases");
  }

  async goTo() {
    await this.page.goto(`${MPOP_URL}/case`);
  }

  async applyFilters(caseFilters: CaseFilters) {
    if (caseFilters.name_crn) {
      await this.page.getByRole("textbox").fill(caseFilters.name_crn);
    }
    if (caseFilters.sentence) {
      await this.page
        .locator(`[name="sentenceCode"]`)
        .selectOption(caseFilters.sentence);
    }
    if (caseFilters.type) {
      await this.page
        .locator(`[name="nextContactCode"]`)
        .selectOption(caseFilters.type);
    }
    await this.page.getByRole("button", { name: "Filter cases" }).click();
  }

  async selectCaseByID(id: number) {
    await this.clickTableLink("myCasesCard", `nameOrCrnValue${id}`);
  }

  async getCount(): Promise<number> {
    try {
      const text = await this.getQA("pagination").textContent();
      const count = text?.match(/\d+(,\d+)*/g) as unknown as number[];
      return parseInt(count[2].toString().replace(/,/g, ""), 10);
    } catch {
      const count = await this.getClass("govuk-table__row").count();
      return count - 1;
    }
  }

  async navigateTo() {
    await baseNavigation(this.page, "Cases");
  }

  async checkSections() {
    await this.getQA("caseloadNavigation").isVisible();
    await this.getClass("govuk-filter-background").isVisible();
    await this.getQA("myCasesCard").isVisible();
  }

  async assertCaseColumnNames(data: DataTable) {
    for (const row of data.rows()) {
      const label = row[0];

      switch (label) {
        case "Cases":
          await expect(
            this.page.locator(`[class=govuk-table__header]`).nth(0),
          ).toContainText(label);
          break;

        case "Main Sentence":
          await expect(
            this.page.locator(`[class=govuk-table__header]`).nth(1),
          ).toContainText(label);
          break;

        case "Last Appointment":
          await expect(
            this.page.locator(`[class=govuk-table__header]`).nth(2),
          ).toContainText(label);
          break;

        case "Next Appointment":
          await expect(
            this.page.locator(`[class=govuk-table__header]`).nth(3),
          ).toContainText("Next Appointment");
          break;
      }
    }
  }

  async checkNoRecentCases() {
    await this.useSubNavigation("recentCasesTab");
    const recentCasesPage = new RecentCasesPage(this.page);
    await recentCasesPage.assertOnPage();
    await recentCasesPage.checkNoRecentCases();
    await this.useSubNavigation("overviewTab");
  }

  async checkRecentCases() {
    await this.checkNoRecentCases();
    await this.assertOnPage();
    const text = await this.getQA("myCasesCard")
      .getByRole("link", { name: /,/ })
      .allTextContents();
    const top5 = text.slice(0, 5).map((i) => i.trim());
    for (let i = 0; i < top5.length; i++) {
      await this.getQA("myCasesCard")
        .getByRole("link", { name: top5[i] })
        .click();
      const overviewPage = new OverviewPage(this.page);
      await overviewPage.assertOnPage();
      await overviewPage.useBreadcrumbs(0);
      await this.assertOnPage();
    }
    await this.useSubNavigation("recentCasesTab");
    const recentCasesPage = new RecentCasesPage(this.page);
    await recentCasesPage.assertOnPage();
    await recentCasesPage.checkRecentCases(top5);
    await this.useSubNavigation("overviewTab");
  }

  async checkLinks() {
    await this.checkRecentCases();
  }
}
