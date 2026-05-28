import { createBdd, DataTable } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import RecordAnOutcomePage from "../../pageObjects/Case/record-an-outcome.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import CasesPage from "../../pageObjects/cases.page";

const { Then, When } = createBdd(testContext);

Then(
  "I land at the page with title {string}",
  async ({ ctx }, expectedTitle: string) => {
    const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
    await recordAnOutcomePage.assertTitleOnOutcomePage(expectedTitle);
  },
);

Then(
  "radio filter {string} is selected by default on record an outcome page",
  async ({ ctx }, radioOption: string) => {
    const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
    await recordAnOutcomePage.assertDefaultRadioSelection(radioOption);
  },
);

When(
  "I select the Older than {int} years radio and apply filter",
  async ({ ctx }, years: number) => {
    const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
    await recordAnOutcomePage.selectOlderThanYearsRadio(years);
    await recordAnOutcomePage.selectApplyFilter();
  },
);

Then(
  "I validate the results are more than {int} years old",
  async ({ ctx }, years: number) => {
    const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
    await recordAnOutcomePage.assertOlderThanYearsResults(years);
  },
);

When("I select the all filter option and apply filter", async ({ ctx }) => {
  const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
  await recordAnOutcomePage.selectAllFilterOption();
  await recordAnOutcomePage.selectApplyFilter();
});

Then("'All' radio is selected", async ({ ctx }) => {
  const recordAnOutcomePage = new RecordAnOutcomePage(ctx.base.page);
  await recordAnOutcomePage.assertAllRadioSelected();
});
