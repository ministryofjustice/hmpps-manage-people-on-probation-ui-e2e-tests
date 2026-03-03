import { Page } from "@playwright/test";
import CasePage from "../../casepage";
import ContactPage from "../contactpage";
import { Address } from "../../../../util/PersonalDetails";

export const addressFields = [
    'buildingName',
    'buildingNumber',
    'streetName',
    'district',
    'town',
    'county',
    'postcode'
]

export default class UpdateAddressPage extends ContactPage {
    constructor(page: Page, crn?: string, uuid?: string) {
        super(page, "Edit main address for", crn, uuid);
    }

    async completePage(address: Address){
        if (address.address != undefined && address.address.length > 0){
           const addressString = address.address
           await this.getQA('noFixedAddress').uncheck()
           for (let i=0; i<addressString.length; i++){
             await this.fillText(addressFields[i], addressString[i].trim())
           } 
        } else {
            await this.getQA('noFixedAddress').check()
        }
        await this.getClass('govuk-select govuk-select--width-30', this.getQA('addressType')).selectOption(address.type)
        await this.clickRadio('verified', address.verified)
        await this.fillText('startDate', address.start)
        if (address.end){
            await this.fillText('endDate', address.end)
        }
        if (address.note){
            await this.fillText('notes', address.note)
        }
        if (address.end){
            await this.continueButton() //valiadtion warning
        }
        await this.continueButton()
    }
}