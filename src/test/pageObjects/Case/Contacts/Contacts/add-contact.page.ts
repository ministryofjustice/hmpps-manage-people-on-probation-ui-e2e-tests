import { expect, Page } from "@playwright/test";
import ContactPage from "./contact.page";

export type AddContactDetails = {
  contact: string;
  relationTo: string;
  title?: string;
  date?: string;
  time?: string;
  contactDetails?: string;
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

  async selectFrequentContact(contact: string): Promise<void> {
    const frequentContact = this.page.getByRole("link", {
      name: contact,
      exact: true,
    });

    await expect(frequentContact).toBeVisible();
    await frequentContact.click();
  }

  async selectContactRelatedTo(contactType: string): Promise<string> {
    const fieldset = this.page.getByRole("group", {
      name: "What is the contact related to?",
    });

    await expect(fieldset).toBeVisible();

    const radios = fieldset.getByRole("radio");
    const count = await radios.count();

    if (count < 2) {
      throw new Error(
        `Expected at least 2 contact related to options, but found ${count}`,
      );
    }

    const index = contactType.trim().toUpperCase() === "MPOP" ? 0 : 1;
    const selectedRadio = radios.nth(index);

    await expect(selectedRadio).toBeVisible();
    await selectedRadio.check();
    await expect(selectedRadio).toBeChecked();

    return `option-${index}`;
  }

    async clickAddContactButton(): Promise<void> {
        await this.clickLink("Add a contact");
    }

    async selectFrequentContact(contact: string): Promise<void> {
        const frequentContact = this.page.getByRole("radio", {
            name: contact,
            exact: true,
        });

        await expect(frequentContact).toBeVisible();
        await frequentContact.click()
        await this.getQA('continue-button').click()
    }

    async selectContactRelatedTo(contactType: string): Promise<string> {
        const fieldset = this.page.getByRole("group", {
            name: "What is the contact related to?",
        });

        await expect(fieldset).toBeVisible();

        const radios = fieldset.getByRole("radio");
        const count = await radios.count();

        if (count < 2) {
            throw new Error(`Expected at least 2 contact related to options, but found ${count}`);
        }

        const index = contactType.trim().toUpperCase() === "MPOP" ? 0 : 1;
        const selectedRadio = radios.nth(index);

        await expect(selectedRadio).toBeVisible();
        await selectedRadio.check();
        await expect(selectedRadio).toBeChecked();

        return `option-${index}`;
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

  async provideContactDetails(data: AddContactDetails): Promise<void> {
    await this.selectContactRelatedTo(data.relationTo);
    await this.enterTitle(data.title);
    await this.enterDate(data.date);
    await this.enterTime(data.time);
    await this.enterContactDetails(data.contactDetails);
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
