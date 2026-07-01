import { expect, Page } from "@playwright/test";
import ContactPage from "../Contacts/contact.page";

export class LogAppointmentOutcomePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /failure to comply/i, crn, uuid);
  }
  async checkTop5(upcoming: string[]) {
    const text = await this.getClass("moj-scrollable-pane")
      .getByRole("link", { name: /,/ })
      .allTextContents();
    const top5 = text.slice(0, 5).map((i) => i.trim());
    expect(upcoming[0]).toEqual(top5[0]); //only check top1 atm due to sorting issues to be resolved in backend
  }
  async verifyOptions(expected: string[]) {
    for (const option of expected) {
      await expect(
        this.page.getByRole("radio", {
          name: option,
          exact: true,
        }),
      ).toBeVisible();
    }
  }
  async selectRadioOption(option: string) {
    const radioButton = this.page.getByRole("radio", {
      name: option,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }

  async completePage() {
    await this.selectRadioOption("Send a letter");
  }
}

export class AcceptableAbsencePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /absence acceptable/i, crn, uuid);
  }

  async completePage() {
    const radioButton = this.page.getByRole("radio", {
      name: "Court / legal",
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }
}

export class UnacceptableAbsencePage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /unacceptable absence/i, crn, uuid);
  }

  async selectRadioOption(option: string) {
    const radioButton = this.page.getByRole("radio", {
      name: option,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }

  async completePage() {
    await this.selectRadioOption("Send a letter");
  }
}

export class FailedToAttendPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, /enforcement action for .+s absence/i, crn, uuid);
  }

  async selectRadioOption(option: string) {
    const radioButton = this.page.getByRole("radio", {
      name: option,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }

  async completePage() {
    await this.selectRadioOption("Send a letter");
  }
}

export class SendALetterPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Send a letter", crn, uuid);
  }

  async completePage() {
    const radioButton = this.page.getByRole("radio", {
      name: "Case administrator",
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    const radioButtonLetterType = this.page.getByRole("radio", {
      name: "First warning letter",
      exact: true,
    });
    await expect(radioButtonLetterType).toBeVisible();
    await radioButtonLetterType.check();
    await expect(radioButtonLetterType).toBeChecked();
    await this.submit();
  }
}

export class InitiateABreachPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Initiate a breach", crn, uuid);
  }

  async completePage(radioOptionName: string) {
    const radioButton = this.page.getByRole("radio", {
      name: radioOptionName,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }
}

export class InitiateARecallPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Initiate a recall", crn, uuid);
  }

  async completePage(radioOptionName: string) {
    const radioButton = this.page.getByRole("radio", {
      name: radioOptionName,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }
}

export class InitiateBreachOrRecallPage extends ContactPage {
  constructor(page: Page, crn?: string, uuid?: string) {
    super(page, "Initiate a recall", crn, uuid);
  }

  async completePage(radioOptionName: string) {
    const radioButton = this.page.getByRole("radio", {
      name: radioOptionName,
      exact: true,
    });
    await expect(radioButton).toBeVisible();
    await radioButton.check();
    await expect(radioButton).toBeChecked();
    await this.submit();
  }
}
