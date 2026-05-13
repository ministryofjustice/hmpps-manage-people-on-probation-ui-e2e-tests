import { createBdd, DataTable } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { caseNavigation } from "../../util/Navigation";
import SearchPage from "../../pageObjects/search.page";
import PersonalDetailsPage from "../../pageObjects/Case/personal-details.page";

const { When, Then } = createBdd(testContext);

When("I search for CRN", async ({ ctx }) => {
  const crn = ctx.case.crn;
  const page = ctx.base.page;
  await caseNavigation(page, crn, "overviewTab", false);
});

Then("I can view the CRN", async ({ ctx }) => {
  const crn = ctx.case.crn;
  const page = ctx.base.page;
  const overviewPage = new OverviewPage(page, crn);
  await overviewPage.checkPopHeader();
});

When("I search for a case CRN {string}", async ({ ctx }, caseCRN: string) => {
  const crn = ctx.case.crn;
  const page = ctx.base.page;

  const searchPage = new SearchPage(page);
  await searchPage.navigateTo(page);
  await searchPage.searchCases(caseCRN);
});

Then(
  "I can view below columns on the search page:",
  async ({ ctx }, data: DataTable) => {
    const searchPage = new SearchPage(ctx.base.page);
    await searchPage.assertColumnNames(data);
  },
);
