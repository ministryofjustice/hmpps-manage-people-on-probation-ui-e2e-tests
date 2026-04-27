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
