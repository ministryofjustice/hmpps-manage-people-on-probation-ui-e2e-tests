import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"
import path from "node:path";

import {photo_1_path} from "../../../test-data.ts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class PhotoMeetRulesPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    // async goTo(crn: string){
    //     await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in\\/upload-a-photo   /`)
    // }
    async checkPhotoRulesDisplayed() {
        await expect(this.page.locator('#main-content form ul')).toBeVisible();
    }



}