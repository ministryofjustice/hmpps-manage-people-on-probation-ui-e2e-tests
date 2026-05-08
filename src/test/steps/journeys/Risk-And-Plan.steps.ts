import { createBdd } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import RiskAndPlanPage from "../../pageObjects/Case/risk-and-plan.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import RiskPage from "../../pageObjects/Case/risk.page";

const { When, Then } = createBdd(testContext);

When("I navigate to the Risk and Plan tab", async ({ ctx }) => {
  const page = ctx.base.page;
  const overviewPage = new OverviewPage(page);
  await overviewPage.assertOnPage();
  await Promise.all([
    page.waitForURL(/risk/i),
    overviewPage.useSubNavigation("riskTab"),
  ]);
});

Then("I can see the Sentence Plan link", async ({ ctx }) => {
  const page = ctx.base.page;
  const riskPage = new RiskPage(page);
  await riskPage.checkSections();
  await riskPage.checkRiskFlagLinks();
  // Risk and Plan page, verify Sentence plan link exists for this CRN
  const riskAndPlanPage = new RiskAndPlanPage(page);
  await riskAndPlanPage.assertOnPage();
  await riskAndPlanPage.checkRiskPlanSectionAndLink();
});
