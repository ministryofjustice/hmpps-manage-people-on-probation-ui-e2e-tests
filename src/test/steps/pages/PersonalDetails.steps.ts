import {createBdd, DataTable} from "playwright-bdd";
import {testContext} from "../../features/Fixtures";
import PersonalDetailsPage from "../../pageObjects/Case/personal-details.page";

const { Given, When, Then} = createBdd(testContext);


Then('the personal details page is populated with title {string}', async ({ctx}, title :string)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertPersonalDetailsTitle(title)
})

Then('the personal details page has the heading {string}', async ({ctx}, title: string) => {
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.checkPageHeader('pageHeading', title)
})


Then('the Contact details section contains below data', async ({ctx}, data:DataTable)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertSections(data)
})

Then('Personal details section contains below data', async ({ctx}, data:DataTable)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertSections(data)
})

Then('Identity numbers section contains below data', async ({ctx}, data:DataTable)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertSections(data)
})

Then('Staff contacts section contains below data', async ({ctx}, data:DataTable)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertSections(data)
})

Then('Equality monitoring section contains below data', async ({ctx}, data:DataTable)=>{
    const personalDetailsPage = new PersonalDetailsPage(ctx.base.page)
    await personalDetailsPage.assertSections(data)
})