import { expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import { caseNavigation } from "../../util/Navigation";
import CasePage from "./casepage";

dotenv.config({ path: ".env" });
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL;

export default class RiskAndPlanPage extends CasePage {
  constructor(page: Page, crn?: string) {
    super(page, "Risk and plan", crn);
  }

  async goTo(crn?: string) {
      console.log("CRN:---", crn);
    await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/risk`);
  }

  async navigateTo(crn?: string) {
    await caseNavigation(this.page, (crn ?? this.crn)!, "riskTab");
  }

  async checkRiskPlanSectionAndLink() {
    const link = this.page.getByRole("link", {name: /View the sentence plan/i,});
    await expect(link).toBeVisible();
    const [newPage] = await Promise.all([
        this.page.context().waitForEvent("page"),
        link.click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/sentence-plan/);
 }
}
