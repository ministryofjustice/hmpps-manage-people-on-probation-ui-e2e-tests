import { createBdd } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import TierPage from "../../pageObjects/Case/tier.page";

const { Then } = createBdd(testContext);
const { When } = createBdd(testContext);

Then("the overview page is populated", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.checkSections();
});

Then("the overview page links work correctly", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.checkLinks();
});

Then("the pop header is correct", async ({ ctx }) => {
  const crn = ctx.case.crn;
  const overviewPage = new OverviewPage(ctx.base.page, crn);
  await overviewPage.assertOnPage();
  await overviewPage.checkCrn();
  const tierPage = new TierPage(ctx.base.page);
  await tierPage.checkTierLink();
});

Then("I can see the text {string}", async ({ ctx }, expectedText: string) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertTextOnOverviewPage(expectedText);
});

Then("link with href {string}", async ({ ctx }, expectedText: string) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertLinkTextOnOverviewPage(expectedText);
});

When("I select the outcome link", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.selectOutcomeLink();
});

Then(
    "I see {string} under ORA Community Order at overview page",
    async ({ ctx }, expectedText: string) => {
      const overviewPage = new OverviewPage(ctx.base.page);
      await overviewPage.assertRequirementText(expectedText);
    },
);

Then(
    "I see {string} link under Requirements section at overview page",
    async ({ ctx }, expectedText: string) => {
      const overviewPage = new OverviewPage(ctx.base.page);
      await overviewPage.assertGPSDataLink(expectedText);
    },
);

When(
    "I select {string} link at overview page",
    async ({ ctx }, linkName: string) => {
      const overviewPage = new OverviewPage(ctx.base.page);
      await overviewPage.selectLink(linkName);
    },
);

Then(
    "I see {string} under ORA Adult Custody at overview page",
    async ({ ctx }, expectedText: string) => {
      const overviewPage = new OverviewPage(ctx.base.page);
      await overviewPage.assertRequirementText(expectedText);
    },
);

Then(
    "I see {string} link under Licence conditions at overview page",
    async ({ ctx }, expectedText: string) => {
      const overviewPage = new OverviewPage(ctx.base.page);
      await overviewPage.assertGPSDataLink(expectedText);
    },
);