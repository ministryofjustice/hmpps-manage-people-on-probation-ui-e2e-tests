import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { photo_1_path } from "../../../../../utilities/Data";

export default class UploadPhotoPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, undefined, crn, uuid);
    }

    fileUploadInput() {
        return this.page.locator('#photoUpload-input');
    }

    async uploadPhoto() {
        console.log(photo_1_path);
        await this.fileUploadInput().setInputFiles(photo_1_path);
    }

}