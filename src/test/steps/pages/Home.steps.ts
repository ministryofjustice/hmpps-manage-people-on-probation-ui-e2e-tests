import { createBdd } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import HomePage from "../../pageObjects/home.page";

const { Then } = createBdd(testContext);

Then("the home page is populated", async ({ ctx }) => {
  const homePage = new HomePage(ctx.base.page);
  await homePage.assertOnPage();
  await homePage.checkSections();
});

Then("the home page links work correctly", async ({ ctx }) => {
  const homePage = new HomePage(ctx.base.page);
  await homePage.assertOnPage();
  await homePage.checkLinks();
});

Then('I see {string} text', async ({ctx}, expectedText :string) => {
  const homePage = new HomePage(ctx.base.page)
  await homePage.checkTextIsThisPageUseful(expectedText)
})


Then('I see {string} link at the footer', async ({ctx}, linkName :string)=>{
  const homePage = new HomePage(ctx.base.page)
  await homePage.checkFooterLinks(linkName)
})