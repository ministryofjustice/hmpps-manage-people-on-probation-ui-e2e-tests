import { createBdd, DataTable } from "playwright-bdd";
import { testContext } from "../../features/Fixtures";
import ActivityLogPage from "../../pageObjects/Case/activity-log.page";
import OverviewPage from "../../pageObjects/Case/overview.page";
import { getClientToken, getContacts } from "../../util/API";
import { addContactDataTable, contactDataTable } from "../../util/Contacts";
import { expect } from "@playwright/test";
import ContactPage from "../../pageObjects/Case/Contacts/Contacts/contact.page";
import AddContactPage from "../../pageObjects/Case/Contacts/Contacts/add-contact.page";
import { convertFeatureDateToString } from "../../util/DateTime";

const { Given, When, Then } = createBdd(testContext);

Given("I navigate to contact log", async ({ ctx }) => {
  const overviewPage = new OverviewPage(ctx.base.page);
  await overviewPage.assertOnPage();
  await overviewPage.useSubNavigation("activityLogTab");
  const contactsPage = new ActivityLogPage(ctx.base.page);
  await contactsPage.assertOnPage();
  ctx.contacts.count = (await contactsPage
    .getQA("results-count-total")
    .textContent())!;
});

Given("I record the full list of activities", async ({ ctx }) => {
  const token = await getClientToken();
  const contacts = await getContacts(ctx.case.crn, token);
  ctx.contacts = contacts;
});

When(
  "I filter the contact log with values",
  async ({ ctx }, data: DataTable) => {
    const page = ctx.base.page;
    const contactFilters = contactDataTable(data);
    const contactsPage = new ActivityLogPage(page);
    await contactsPage.applyFilters(contactFilters);
  },
);

When("I click on add contact", async ({ ctx }) => {
  const page = ctx.base.page;
  const contactPage = new ContactPage(page);
  await contactPage.getQA("headerActionButton").isEnabled();
  await contactPage.getQA("headerActionButton").click();
});

When("I click on {string} tab", async ({ ctx }, contact) => {
  const page = ctx.base.page;
  const contactByCategory = page.getByRole("link", {
    name: contact,
  });
  await expect(contactByCategory).toBeVisible();
  await contactByCategory.click();
});

When("I provide Contact details", async ({ ctx }, dataTable: DataTable) => {
  const page = ctx.base.page;
  const contactDetails = addContactDataTable(dataTable);
  const addContact = new AddContactPage(page);
  // await contactsPage.assertOnPage()
  await addContact.selectFrequentContact(contactDetails.contact);
  await addContact.contactDetails();
  switch (contactDetails.contact.trim()) {
    case "An appointment":
      break;
    case "I want to add a different contact":
      break;
    default: {
      const data = dataTable.rowsHash();
      await addContact.provideContactDetails({
        contact: data.contact,
        relationTo: data.relation_to,
        title: data.title,
        date: convertFeatureDateToString(data.date),
        time: data.time,
        outcome: data.outcome,
        contactDetails: data.contact_details,
        visorReport: data.visor_report,
        sensitiveInfo: data.sensitive_info,
        alertPractitioner: data.alert_practitioner,
      });
      break;
    }
  }
});

When("I save the contact details", async ({ ctx }) => {
  const page = ctx.base.page;
  const button = page.getByRole("button", { name: "Create contact" });

  await button.waitFor({ state: "visible" });
  await button.click();
});

Then("the contact log contains the correct info", async ({ ctx }) => {
  const page = ctx.base.page;
  const contactsPage = new ActivityLogPage(page);
  await contactsPage.assertOnPage();
});

Then(
  "the contact log contains {string} entries",
  async ({ ctx }, count: string) => {
    const page = ctx.base.page;
    const contactsPage = new ActivityLogPage(page);
    if (count === "full") {
      await expect(contactsPage.getQA("results-count-total")).toHaveText(
        ctx.contacts.count,
      );
    } else if (count === "filtered") {
      await expect(contactsPage.getQA("results-count-total")).not.toHaveText(
        ctx.contacts.count,
      );
    } else if (count === "0") {
      await expect(contactsPage.getQA("no-results")).toContainText(
        "0 search results",
      );
    } else {
      await expect(contactsPage.getQA("results-count-total")).toHaveText(count);
    }
  },
);

When("I search the {string}", async ({ ctx }, categoryToSelect: string) => {
  const page = ctx.base.page;
  const categoryList = categoryToSelect.split(",");
  for (const cat of categoryList) {
    const category = page.getByLabel(cat);
    await expect(category).toBeVisible();
    if (!(await category.isChecked())) {
      await category.check();
    }
  }
  const search = page.getByRole("button", { name: "Search" });
  await expect(search).toBeVisible();
  await search.click();
});

Then("there are {string} on contacts page", async ({ ctx }, error: string) => {
  const page = ctx.base.page;
  const contactsPage = new ActivityLogPage(page);
  if (error === "no errors") {
    await expect(contactsPage.getQA("errorList")).not.toBeVisible();
  } else if (error === "a missing date to error") {
    await expect(contactsPage.getQA("errorList")).toContainText(
      "Enter or select a date to",
    );
  }
});
