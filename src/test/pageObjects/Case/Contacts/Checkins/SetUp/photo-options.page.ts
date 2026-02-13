import { Page } from "@playwright/test";
import ContactPage from "../../contactpage";
import { MPOP_URL } from "../../../../../util/Data";

export enum PhotoOptions {
  TAKE = 0,
  UPLOAD = 1
}

export default class PhotoOptionsPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Take a photo of", crn, uuid);
    }

    async goTo(crn?: string, uuid?: string){
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/appointments/${(uuid ?? this.uuid)!}/check-in/photo-options/`)
    }

    async completePage(optionId: PhotoOptions){
        await this.changePage(optionId)
    }

    async changePage(optionId?: PhotoOptions){
        if (optionId !== undefined){
            await this.clickRadio("uploadOptions", optionId)
        }
        await this.submit()
    }

    async selectTakeAPhotoNowUsingLaptop(){
        await this.clickRadio("uploadOptions", PhotoOptions.TAKE)
        await this.submit()
    }

    async selectUploadAPhoto(){
        await this.clickRadio("uploadOptions", PhotoOptions.UPLOAD)
        await this.submit()
    }
}