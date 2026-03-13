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
    await sentencePage.assertSentenceTitle(title)
})

Then('the sentence page has the heading {string}', async ({ctx}, heading: string)=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.assertPageHeading(heading)
})

Then('the link {string} at sentence page works correctly', async ({ctx}, linkName :string)=>{
    const sentencePage = new SentencePage(ctx.base.page)
    await sentencePage.checkLinks(linkName)
})

