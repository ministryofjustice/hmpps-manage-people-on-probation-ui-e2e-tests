import { expect, Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { photo_1_path } from "../../../../../utilities/Data";

export default class TakePhotoPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Take a photo of", crn, uuid);
    }

    async completePage() {
        await this.takePhoto()
        await this.page.waitForTimeout(1000)
        await this.submit()
    }

    async takePhoto() {
        await this.page.evaluate(async() => {
            const takePhotoButton = document.getElementById('take-photo')
            takePhotoButton?.removeAttribute('disabled')
            takePhotoButton?.removeAttribute('aria-disabled')
        })
    }
}