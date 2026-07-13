import { expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import CasePage from "./casepage";

dotenv.config({ path: ".env" });
const arnsSentencePlanUrl: string = process.env.ARNS_SENTENCE_PLAN_URL!;

export default class CreateSentencePlanPage extends CasePage {
  constructor(page: Page, crn?: string) {
    super(page, "Assess and plan", crn);
  }

  async gotToPage() {
    await this.page.goto(arnsSentencePlanUrl);
  }

  async customiseScenario(crn: string) {
    await this.page.getByRole("button", { name: "Customize scenario" }).click();
    const randomizeCheckbox = this.page.locator("#crn-randomize-checkbox");
    const crnInput = this.page.locator("#crn");

    await randomizeCheckbox.uncheck();

    await expect(crnInput).toBeEnabled();

    await crnInput.fill(crn);
    await this.page.getByRole("button", { name: "Create session" }).click();
    await this.page.getByRole("button", { name: "Generate link" }).click();

    await this.page.locator("#confirm_privacy").check();
    await this.page.getByRole("button", { name: "Confirm" }).click();
  }

  async createGoal() {
    await this.page.getByRole("button", { name: "Create goal" }).click();

    await this.page.locator("#goal_title").fill("tenancy");

    await this.page.locator("#is_related_to_other_areas" ).click();

    await this.page.getByRole("checkbox", { name: "Drug use" }).click();

    await this.page.locator("#can_start_now" ).click();
    await this.page.locator("#target_date_option" ).click();


    // Select the goal from the autocomplete

    // Is this goal related to any other area of need? -> Yes
    await this.page.getByLabel("Yes").first().check();

    // Select "Alcohol use"
    await this.page.getByLabel("Alcohol use").check();

     await this.page.getByRole("button", { name: /Add Steps/i }).click();
  }

  async agreeOnPlan() {
    // agree on plan
    // Select first option in "Who will do the step?"

     await this.page.locator('#step_actor_0').click();
     await this.page.locator('#step_actor_0-option-2').click();

    // Enter step description
    await this.page.locator("#step_description_0").fill("Test goal");

    await this.page.locator('#step_status_0').click();
    await this.page.locator('#step_status_0-option-2').click();


    // Click "Save and continue"
    await this.page.getByRole("button", { name: /save and continue/i }).click();

    // On the next page click "Agree plan"
    await this.page.locator("#agree-plan-button").click();

    await this.page.getByRole("radio", { name: "Yes, I agree" }).nth(0).check();

    await this.page.getByRole("button", { name: "Save" }).click();
  }
}
