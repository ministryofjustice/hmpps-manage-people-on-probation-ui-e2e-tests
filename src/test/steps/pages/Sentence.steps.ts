import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import SentencePage from "../../pageObjects/Case/sentence.page";

const { Given, When, Then } = createBdd(testContext);


When('I navigate to sentence page',async ({ctx})=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.useSubNavigation('sentenceTab')
})

Then('the sentence page is populated with title {string}', async ({ctx}, title :string)=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.checkSentenceTitle(title)
})

Then('the sentence page has the heading {string}', async ({ctx}, heading: string)=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.checkPageHeading(heading)
})

Then('the sentence page links work correctly', async ({ctx})=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.checkLinks()
})
