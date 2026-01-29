import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { MPOP_URL } from "../../../../../utilities/Data";

export default class PhotoOptionsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, undefined, crn, uuid);
    }

    async goTo(crn?: string, uuid?: string){
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/photo-options/`)
    }

    async selectTakeAPhotoNowUsingLaptop(){
        await this.clickRadio("uploadOptions", 0)
        await this.submit()
    }

    async selectUploadAPhoto(){
        await this.clickRadio("uploadOptions", 1)
        await this.submit()
    }
}