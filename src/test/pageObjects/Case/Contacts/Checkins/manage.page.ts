import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";
import { navigateToCase } from "../../../../util/Navigation";
import OverviewPage from "../../overview.page";
import { DataTable } from "playwright-bdd";

export default class ManageCheckInsPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Online check ins", crn, uuid);
  }

  async navigateTo(crn?: string) {
    await navigateToCase(this.page, (crn ?? this.crn)!);
    const overview = new OverviewPage(this.page);
    await overview.assertOnPage();
    await overview.checkOnlineCheckInsLink(false);
  }

  async clickStopCheckIns() {
    await this.getQA("stop-checkin-btn").click();
  }

  async clickRestartCheckIns() {
    await this.getQA("restart-checkin-btn").click();
  }

  async clickChangeQuestions() {
    await this.page.getByRole("link", { name: /Change questions/ }).click();
  }

  async assertCancelAndGoToOverviewLink(linkText: string) {
    await expect(this.getQA("formAnchorLink").nth(0)).toContainText(linkText);
  }

  async selectAddQuestionsToOnlineCheckInsButton() {
    await this.getQA("submit-btn").click();
  }

  async assertTextOnAddQuestionPage(expectedText: string) {
    await expect(this.getQA("pageHeading").nth(0)).toContainText(expectedText);
  }

  async assertQuestionsText(data: DataTable) {
    for (const row of data.rows()) {
      const expectedQuestionText = row[0];
      switch (expectedQuestionText) {
        case "How have you been feeling since we last spoke?":
          // await expect(this.getQA('abc')).toContainText('Phone number')
          await expect(
            this.page.locator(`[class=govuk-table__cell]`).first(),
          ).toContainText(expectedQuestionText);
          break;
        case "Is there anything you need support with or want to let us know about?1":
          await expect(
            this.page.locator(`[class=govuk-table__cell]`).nth(2),
          ).toContainText(expectedQuestionText);
          break;
      }
    }
  }

  async assertPreviewLinks() {
    await expect(this.getQA(`preview-feeling-link`)).toContainText("Preview");
    await expect(this.getQA(`preview-support-link`)).toContainText("Preview");
  }

  async selectPreviewFeelingLink() {
    await this.getQA(`preview-feeling-link`).click();
  }

  async selectBackToQuestionsButton() {
    await this.getQA(`submit-btn`).click();
  }

  async selectPreviewSupportLink() {
    await this.getQA(`preview-support-link`).click();
  }

  async assertRadioButtonsOnFeelingPreviewPage(data: DataTable) {
    for (const row of data.rows()) {
      const label = row[0];

      switch (label) {
        case "Very well":
          await expect(
            this.page.getByRole("radio", { name: "Very well" }),
          ).toBeVisible();
          break;
        case "Well":
          await expect(
            this.page.getByRole("radio", { name: /^Well$/ }),
          ).toBeVisible();
          break;
        case "OK":
          await expect(
            this.page.getByRole("radio", { name: "OK" }),
          ).toBeVisible();
          break;
        case "Not Great":
          await expect(
            this.page.getByRole("radio", { name: "Not Great" }),
          ).toBeVisible();
          break;
        case "Struggling":
          await expect(
            this.page.getByRole("radio", { name: "Struggling" }),
          ).toBeVisible();
          break;
      }
    }
  }

  async assertTextAreaOnFeelingPreviewPage(data: DataTable) {
    for (const row of data.rows()) {
      const label = row[0];

      switch (label) {
        case "Very well":
          await expect(
            this.page.getByRole("textbox", {
              name: "Tell us why you are very well (optional)",
            }),
          ).toBeVisible();
          break;
        case "Well":
          await expect(
            this.page.getByRole("textbox", {
              name: "Tell us why you are well (optional)",
            }),
          ).toBeVisible();
          break;
        case "OK":
          await expect(
            this.page.getByRole("textbox", {
              name: "Tell us why you are OK (optional)",
            }),
          ).toBeVisible();
          break;
        case "Not Great":
          await expect(
            this.page.getByRole("textbox", {
              name: "Tell us why you are not great (optional)",
            }),
          ).toBeVisible();
          break;
        case "Struggling":
          await expect(
            this.page.getByRole("textbox", {
              name: "Tell us why you are struggling (optional)",
            }),
          ).toBeVisible();
          break;
      }
    }
  }

  async assertCheckBoxesOnSupportPreviewPage(data: DataTable) {
    for (const row of data.rows()) {
      const label = row[0];

      switch (label) {
        case "Mental health":
          await expect(
            this.page.locator("[id='mentalHealthSupport-checkbox']"),
          ).toBeVisible();
          // await expect(this.page.getByRole("checkbox", {name: "Mental health"})).toBeVisible();
          break;
        case "Alcohol":
          // await expect(this.page.getByRole("checkbox", {name: "Alcohol"})).toBeVisible();
          await expect(
            this.page.locator("[id='alcoholSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Drugs":
          await expect(
            this.page.locator("[id='drugsSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Money":
          await expect(
            this.page.locator("[id='moneySupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Housing":
          await expect(
            this.page.locator("[id='housingSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Employment and education":
          await expect(
            this.page.locator("[id='employmentAndEducationSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Relationships (family, friends, partner)":
          await expect(
            this.page.locator("[id='relationshipsSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Something else":
          await expect(
            this.page.locator("[id='otherSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "No, I do not need any support":
          await expect(
            this.page.locator("[id='no-help-checkbox']"),
          ).toBeVisible();
          break;
      }
    }
  }

  async assertTextAreaOnSupportPreviewPage(data: DataTable) {
    for (const row of data.rows()) {
      const label = row[0];

      switch (label) {
        case "Tell us what you want us to know about mental health (optional)":
          await expect(
            this.page.locator("[id='mentalHealthSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about alcohol (optional)":
          await expect(
            this.page.locator("[id='alcoholSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about drugs (optional)":
          await expect(
            this.page.locator("[id='drugsSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about money (optional)":
          await expect(
            this.page.locator("[id='moneySupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about housing (optional)":
          await expect(
            this.page.locator("[id='housingSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about employment and education (optional)":
          await expect(
            this.page.locator("[id='employmentAndEducationSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about your relationships (optional)":
          await expect(
            this.page.locator("[id='relationshipsSupport-checkbox']"),
          ).toBeVisible();
          break;
        case "Tell us what you want us to know about (optional)":
          await expect(
            this.page.locator("[id='no-help-checkbox']"),
          ).toBeVisible();
          break;
      }
    }
  }

  async assertAddQuestionButton(expectedButton: string) {
    await expect(this.getQA(`add-question-btn`)).toContainText(expectedButton);
  }

  async assertSaveQuestionsButton(expectedButton: string) {
    await expect(this.getQA(`save-questions-btn`)).toContainText(
      expectedButton,
    );
  }

  async assertCancelAndGoBackLink(expectedLink: string) {
    await expect(this.getQA(`cancel-link`)).toContainText(expectedLink);
  }

  async selectCancelAndGoBackLink() {
    await this.getQA(`cancel-link`).click();
  }
}
