import { expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import CasePage from "./casepage";

dotenv.config({ path: ".env" });

export default class TierPage extends CasePage {
  constructor(page: Page, crn?: string) {
    super(page, "", crn);
  }

  async checkOnPage(): Promise<boolean> {
    try {
      await expect(this.getClass("govuk-heading-l").first()).toContainText(
        "Summary",
      );
      return true;
    } catch {
      return false;
    }
  }

  // async checkTier(tier: string) {
  //   await expect(this.page.locator("p").first()).toContainText(
  //     `has a tier of ${tier}`,
  //   );
  // }

  async checkTier(tier: string) {
    const isMissing = tier.trim().toLowerCase() === "missing";

    const expected = isMissing
      ? "has a missing tier, as no reoffending risk predictors are available"
      : `has a tier of ${tier}`;

    await expect(this.page.locator("p").first()).toContainText(expected);
  }

  async checkTierLink() {
    const link = this.getQA("tierLink");
    const tier = (await link.allTextContents())[0].split(" ")[1];
    await link.click();
    await this.assertOnPage();
    await this.checkTier(tier!);
    await this.useBreadcrumbs(1); //always return to case
  }
}
