import { createBdd } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import RiskPage from "../../pageObjects/Case/risk.page";

const { Given, Then } = createBdd(testContext);

Given("I navigate to risk page", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.useSubNavigation("riskTab");
});

Then("the risk page is populated", async ({ ctx }) => {
  const riskPage = new RiskPage(ctx.base.page);
  await riskPage.assertOnPage();
  await riskPage.checkSections();
});

Then("the risk page links work correctly", async ({ ctx }) => {
  const riskPage = new RiskPage(ctx.base.page);
  await riskPage.assertOnPage();
  await riskPage.checkLinks();
});
