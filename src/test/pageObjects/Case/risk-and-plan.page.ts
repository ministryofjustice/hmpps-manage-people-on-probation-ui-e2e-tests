import { expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import CasePage from "./casepage";

dotenv.config({ path: ".env" });

export default class RiskAndPlanPage extends CasePage {
  constructor(page: Page, crn?: string) {
    super(page, "Risk and plan", crn);
  }

  async checkRiskPlanSectionAndLink() {
    const link = this.page.getByRole("link", {
      name: /View the sentence plan/i,
    });
    await expect(link).toBeVisible();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      link.click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/sentence-plan/);
  }
}
