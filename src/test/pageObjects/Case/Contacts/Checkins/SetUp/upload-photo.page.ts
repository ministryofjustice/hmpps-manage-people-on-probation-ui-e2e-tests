import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { photo_1_path } from "../../../../../util/Data";

export default class UploadPhotoPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Upload a photo of", crn, uuid);
    }

    async completePage() {
        await this.uploadPhoto()
        await this.submit()
    }

    fileUploadInput() {
        return this.page.locator('#photoUpload-input');
    }

    async uploadPhoto() {
        await this.fileUploadInput().setInputFiles(photo_1_path);
    }

}