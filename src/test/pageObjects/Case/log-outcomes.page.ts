import { expect, Locator, Page } from "@playwright/test";
import CasePage from "../../pageObjects/Case/casepage";

export default class LogOutcomesPage extends CasePage {
  readonly uuid?: string;

  constructor(
    page: Page,
    title?: string | RegExp,
    crn?: string,
    uuid?: string,
  ) {
    super(page, "Outcomes to log", crn);
    this.uuid = uuid;
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
  async selectOutcome(option: string) {
    await this.page.getByLabel(option).check();
  }
  // Radio buttons
  private get attendedCompliedRadio(): Locator {
    return this.page.getByRole("radio", {
      name: /attended - complied/i,
    });
  }

  private get attendedFailedToComplyRadio(): Locator {
    return this.page.getByRole("radio", {
      name: /attended - failed to comply/i,
    });
  }

  private get unacceptableAbsenceRadio(): Locator {
    return this.page.getByRole("radio", {
      name: /unacceptable absence/i,
    });
  }

  private get failedToAttendRadio(): Locator {
    return this.page.getByRole("radio", {
      name: /failed to attend/i,
    });
  }

  // Assertions
  async outcomeRadioButtonsExist(): Promise<void> {
    await expect(this.attendedCompliedRadio).toBeVisible();
    await expect(this.attendedFailedToComplyRadio).toBeVisible();
    await expect(this.unacceptableAbsenceRadio).toBeVisible();
    await expect(this.failedToAttendRadio).toBeVisible();
  }

  // Actions
  async selectAttendedComplied(): Promise<void> {
    await this.attendedCompliedRadio.check();
  }

  async selectAttendedFailedToComply(): Promise<void> {
    await this.attendedFailedToComplyRadio.check();
  }

  async selectUnacceptableAbsence(): Promise<void> {
    await this.unacceptableAbsenceRadio.check();
  }

  async selectFailedToAttend(): Promise<void> {
    await this.failedToAttendRadio.check();
  }
}
