import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page.ts"
import path from "node:path";

import {photo_1_path} from "../../../test-data.ts";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL



export default class PhotoOptionsPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    async goTo(crn: string){
        await this.page.goto(`${MPOP_URL}/case/${crn}/appointments\\/[0-9a-fA-F-]{36}\\/check-in\\/photo-options/`)
    }

    async selectTakeAPhotoNowUsingLaptop(){
        await this.clickRadio("uploadOptions", 0)
        await this.submit()
    }

    async selectUploadAPhoto(){
        await this.clickRadio("uploadOptions", 1)
        await this.submit()
    }
    //
    // fileUploadInput() {
    //     return this.page.locator('#photoUpload-input');
    // }
    //
    // async uploadPhoto() {
    //     console.log(photo_1_path);
    //     await this.fileUploadInput().setInputFiles(photo_1_path);
    // }

}