import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import MPopPage from "../page"
import {photo_1_path} from "../../../test-data";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL



export default class UploadPhotoPage extends MPopPage {
    constructor(page: Page) {
        super(page);
    }

    fileUploadInput() {
        return this.page.locator('#photoUpload-input');
    }

    async uploadPhoto() {
        console.log(photo_1_path);
        await this.fileUploadInput().setInputFiles(photo_1_path);
    }

}