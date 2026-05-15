import { expect, Page } from "@playwright/test";
import ContactPage from "./contact.page";
import path from "path";

export type AddContactDetails = {
  contact: string;
  relationTo: string;
  title?: string;
  date?: string;
  time?: string;
  contactDetails?: string;
  outcome?: string;
  fileName?: string;
  visorReport?: string;
  sensitiveInfo?: string;
  alertPractitioner?: string;
};

export default class AddContactPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Add a contact", crn, uuid);
  }

  async clickAddContactButton(): Promise<void> {
    await this.clickLink("Add a contact");
  }

  async selectContactRelatedTo(contactType?: string): Promise<string> {
    if (!contactType || contactType.trim() === "") return "No contact logged";

    const personLevelText = this.page.getByText(
      "This contact will be logged against the person.",
    );

    if (await personLevelText.isVisible()) {
      return "No contact logged";
    }

    const fieldset = this.page.getByRole("group", {
      name: "What is the contact related to?",
    });

    if ((await fieldset.count()) === 0) return "No contact logged";

    await expect(fieldset).toBeVisible();

    const radios = fieldset.getByRole("radio");
    const count = await radios.count();

    if (count === 0) return "No contact logged";

    const isMpop = contactType.trim().toUpperCase() === "MPOP";

    if (isMpop) {
      const mpopRadio = fieldset.locator("input[value='PERSON_LEVEL_CONTACT']");

      if ((await mpopRadio.count()) === 0) {
        // No PERSON_LEVEL_CONTACT radio — fall back to first radio
        const firstRadio = radios.first();
        await expect(firstRadio).toBeVisible();
        if (!(await firstRadio.isChecked())) await firstRadio.check();
        await expect(firstRadio).toBeChecked();
        return "MPoP";
      }

      await expect(mpopRadio).toBeVisible();
      if (!(await mpopRadio.isChecked())) await mpopRadio.check();
      await expect(mpopRadio).toBeChecked();
      return "MPoP";
    } else {
      // Sentence = any radio that is NOT PERSON_LEVEL_CONTACT
      const sentenceRadios = fieldset.locator(
        "input[type='radio']:not([value='PERSON_LEVEL_CONTACT'])",
      );

      const sentenceCount = await sentenceRadios.count();

      if (sentenceCount === 0) {
        throw new Error("No sentence radio button found");
      }

      const selected = sentenceRadios.first();
      await expect(selected).toBeVisible();
      if (!(await selected.isChecked())) await selected.check();
      await expect(selected).toBeChecked();
      return "Sentence";
    }
  }

  async selectFrequentContact(contact: string): Promise<void> {
    const frequentContact = this.page.getByRole("link", {
      name: contact,
      exact: true,
    });

    await expect(frequentContact).toBeVisible();
    await frequentContact.click();
  }

  async enterTitle(title?: string): Promise<void> {
    if (!title || title.trim() === "") return;

    const titleInput = this.page.getByLabel(
      "Give the contact a different title (optional)",
      {
        exact: true,
      },
    );

    await expect(titleInput).toBeVisible();
    await titleInput.fill(title);
  }

  async enterDate(date?: string): Promise<void> {
    if (!date || date.trim() === "") return;

    const dateInput = this.page.getByLabel("Date", { exact: true });
    await expect(dateInput).toBeVisible();
    await dateInput.fill(date);
  }

  async enterTime(time?: string): Promise<void> {
    if (!time || time.trim() === "") return;

    const timeInput = this.page.getByLabel("Time", { exact: true });
    await expect(timeInput).toBeVisible();
    await timeInput.fill(time);
  }

  async enterContactDetails(details?: string): Promise<void> {
    if (!details || details.trim() === "") return;

    const detailsTextArea = this.page.getByLabel("Add details of the contact", {
      exact: true,
    });

    await expect(detailsTextArea).toBeVisible();
    await detailsTextArea.fill(details);
  }

  private async selectOptionalBinaryQuestion(
    groupName: string | RegExp,
    value?: string,
    labels?: { yesLabel?: string; noLabel?: string },
  ): Promise<void> {
    if (!value || value.trim() === "") return;

    const fieldset = this.page.getByRole("group", {
      name: groupName,
    });

    if ((await fieldset.count()) === 0) {
      return;
    }

    await expect(fieldset.first()).toBeVisible();

    const isYes = this.toBoolean(value);
    const optionLabel = isYes
      ? (labels?.yesLabel ?? "Yes")
      : (labels?.noLabel ?? "No");

    const option = fieldset.first().getByRole("radio", {
      name: optionLabel,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.check();
    await expect(option).toBeChecked();
  }

  async selectVisorReport(value?: string): Promise<void> {
    await this.selectOptionalBinaryQuestion(
      "Include contact in ViSOR report?",
      value,
    );
  }

  async selectOutcome(value?: string): Promise<void> {
    if (!value || value.trim() === "") return;

    const outcomeGroup = this.page.getByRole("group", {
      name: "Select an outcome",
    });

    if ((await outcomeGroup.count()) === 0) return;

    const outcome = outcomeGroup.getByRole("radio", {
      name: value,
      exact: true,
    });

    if (await outcome.isVisible()) {
      await outcome.click();
      await expect(outcome).toBeChecked();
    }
  }

  async selectSensitiveInformation(value?: string): Promise<void> {
    await this.selectOptionalBinaryQuestion(
      "Does this contact include sensitive information?",
      value,
      {
        yesLabel: "Yes, it includes sensitive information",
        noLabel: "No, it is not sensitive",
      },
    );
  }

  async selectAlertPractitioner(value?: string): Promise<void> {
    await this.selectOptionalBinaryQuestion(
      /Do you want to alert .* about this contact\?/i,
      value,
    );
  }

  async uploadFile(fileName?: string): Promise<void> {
    if (!fileName || fileName.trim() === "") return;

    const filePath = path.resolve(
      process.cwd(),
      `src/test/fixtures/${fileName}`,
    );
    const fileInput = this.page.locator("input[type='file']");

    await fileInput.evaluate((el) => {
      (el as HTMLInputElement).style.display = "block";
    });

    await fileInput.setInputFiles(filePath);
  }

  async provideContactDetails(data: AddContactDetails): Promise<void> {
    await this.selectContactRelatedTo(data.relationTo);
    await this.enterTitle(data.title);
    await this.enterDate(data.date);
    await this.enterTime(data.time);
    await this.enterContactDetails(data.contactDetails);
    await this.selectOutcome(data.outcome);
    await this.uploadFile(data.fileName);
    await this.selectVisorReport(data.visorReport);
    await this.selectSensitiveInformation(data.sensitiveInfo);
    await this.selectAlertPractitioner(data.alertPractitioner);
  }

  private toBoolean(value: string): boolean {
    return value.trim().toLowerCase() === "true";
  }

  async checkOnPage(): Promise<boolean> {
    try {
      await this.checkQA("pageHeading", "Contacts");
      return true;
    } catch {
      return false;
    }
  }
}
