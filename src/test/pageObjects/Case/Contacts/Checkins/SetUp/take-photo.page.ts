import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { photo_1_path } from "../../../../../utilities/Data";

export default class TakePhotoPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Take a photo of", crn, uuid);
    }

    async completePage() {
        // await this.takePhoto()
        await this.submit()
    }

    async takePhoto() {
        await this.page.context().grantPermissions(['camera']);
    }

}