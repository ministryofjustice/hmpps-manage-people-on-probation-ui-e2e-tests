import { createBdd, DataTable } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import { getClientToken, getPersonalDetails } from "../../util/API";
import { expect } from "@playwright/test";
import PersonalDetailsPage from "../../pageObjects/Case/personal-details.page";
import {
  Address,
  addressDataTable,
  getUpdatedAddressDetails,
} from "../../util/PersonalDetails";
import ContactDetailsPage from "../../pageObjects/Case/Contacts/Checkins/SetUp/update-contact-details.page";
import UpdateAddressPage from "../../pageObjects/Case/Contacts/Checkins/update-address.page";

const { Given, When, Then } = createBdd(testContext);

Given("I navigate to personal details page", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(
    page,
    crn,
  );
  await personalDetails.navigateTo();
  await personalDetails.assertOnPage();
});

Given("I make a note of possible address types and codes", async ({ ctx }) => {
  const crn = ctx.case.crn;
  const token = await getClientToken();
  const details = await getPersonalDetails(crn, token);
  ctx.addressTypes = details.addressTypes!;
});

When("I can note the current details", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(
    page,
    crn,
  );
  await personalDetails.assertOnPage();
  ctx.details = await personalDetails.noteDetails();
});

When(
  "I navigate to update contact details via {string} link",
  async ({ ctx }, changeLink: string) => {
    const page = ctx.base.page;
    const crn = ctx.case.crn;
    const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(
      page,
      crn,
    );
    await personalDetails.assertOnPage();
    await personalDetails.navigateToUpdateContactDetails(changeLink);
    const contactDetailsPage = new ContactDetailsPage(page);
    await contactDetailsPage.assertOnPage();
  },
);

When(
  "I update the phone number to {string}",
  async ({ ctx }, phoneNumber: string) => {
    const page = ctx.base.page;
    const contactDetailsPage = new ContactDetailsPage(page);
    await contactDetailsPage.assertOnPage();
    await contactDetailsPage.fillText("phoneNumber", phoneNumber);
    ctx.details.contactDetails!.phone =
      phoneNumber === "" ? "No phone number" : phoneNumber;
  },
);

When(
  "I update the mobile number to {string}",
  async ({ ctx }, mobileNumber: string) => {
    const page = ctx.base.page;
    const contactDetailsPage = new ContactDetailsPage(page);
    await contactDetailsPage.assertOnPage();
    await contactDetailsPage.fillText("mobileNumber", mobileNumber);
    ctx.details.contactDetails!.mobile =
      mobileNumber === "" ? "No mobile number" : mobileNumber;
  },
);

When(
  "I update the email address to {string}",
  async ({ ctx }, emailAddress: string) => {
    const page = ctx.base.page;
    const contactDetailsPage = new ContactDetailsPage(page);
    await contactDetailsPage.assertOnPage();
    await contactDetailsPage.fillText("emailAddress", emailAddress);
    ctx.details.contactDetails!.email =
      emailAddress === "" ? "No email address" : emailAddress;
  },
);

When("I submit the updated contact details", async ({ ctx }) => {
  const page = ctx.base.page;
  const contactDetailsPage = new ContactDetailsPage(page);
  await contactDetailsPage.assertOnPage();
  await contactDetailsPage.getQA("submitBtn").click();
});

When("I navigate to the update main address page", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(
    page,
    crn,
  );
  await personalDetails.assertOnPage();
  await personalDetails.getQA("mainAddressAction").click();
  const updateAddressPage = new UpdateAddressPage(page);
  await updateAddressPage.assertOnPage();
});

When("I update the main address details", async ({ ctx }, data: DataTable) => {
  const address: Address = addressDataTable(data);
  ctx.details.addressDetails = getUpdatedAddressDetails(
    ctx.details.addressDetails!,
    address,
    ctx.addressTypes,
  );
  const page = ctx.base.page;
  const updateAddressPage = new UpdateAddressPage(page);
  await updateAddressPage.assertOnPage();
  await updateAddressPage.completePage(address);
});

Then("I can see the updated details", async ({ ctx }) => {
  const page = ctx.base.page;
  const crn = ctx.case.crn;
  const personalDetails: PersonalDetailsPage = new PersonalDetailsPage(
    page,
    crn,
  );
  await personalDetails.assertOnPage();
  expect(await personalDetails.noteDetails()).toEqual(ctx.details);
});
