import {createBdd, DataTable} from "playwright-bdd";
import {ContactDetails, testContext} from "../../features/Fixtures";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { getClientToken, getContacts, getPersonalDetails } from "../../util/API";
import { expect } from "@playwright/test";
import PersonalDetailsPage from "../../pageObjects/Case/personal-details.page";
import { Address, addressDataTable, contactDetailsDataTable, getUpdatedAddressDetails, getUpdatedContactDetails } from "../../util/PersonalDetails";

const { Given, When, Then } = createBdd(testContext);

Given('I navigate to personal details page',async ({ctx})=>{
    const page = ctx.base.page
    const crn = ctx.case.crn
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(page, crn)
    await personalDetails.navigateTo()
    await personalDetails.assertOnPage()
})

Given('I make a note of possible address types and codes',async ({ctx})=>{
    const crn = ctx.case.crn
    const token = await getClientToken()
    const details = await getPersonalDetails(crn, token)
    ctx.addressTypes = details.addressTypes!
})

When('I can note the current details',async ({ctx})=>{
    const page = ctx.base.page
    const crn = ctx.case.crn
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(page, crn)
    await personalDetails.assertOnPage()
    ctx.details = await personalDetails.noteDetails()
})

When('I change the contact details',async ({ctx}, data:DataTable)=>{
    const contactDetails : ContactDetails = contactDetailsDataTable(data)
    ctx.details.contactDetails = getUpdatedContactDetails(ctx.details.contactDetails!, contactDetails)
    const page = ctx.base.page
    const crn = ctx.case.crn
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(page, crn)
    await personalDetails.assertOnPage()
    await personalDetails.updateContactDetails(contactDetails)
})



When('I update the main address',async ({ctx}, data:DataTable)=>{
    const address : Address = addressDataTable(data)
    ctx.details.addressDetails = getUpdatedAddressDetails(ctx.details.addressDetails!, address, ctx.addressTypes)
    const page = ctx.base.page
    const crn = ctx.case.crn
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(page, crn)
    await personalDetails.assertOnPage()
    await personalDetails.updateMainAddress(address)
})

Then('I can see the updated details',async ({ctx})=>{
    const page = ctx.base.page
    const crn = ctx.case.crn
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(page, crn)
    await personalDetails.assertOnPage()
    expect(await personalDetails.noteDetails()).toEqual(ctx.details)
})