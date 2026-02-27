import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import { caseNavigation, navigateToCase } from "../../util/Navigation";
import { AddressDetails, ContactDetails, Details } from "../../features/Fixtures";
import ContactDetailsPage from "./Contacts/Checkins/SetUp/update-contact-details.page";
import { Address } from "../../util/PersonalDetails";
import UpdateAddressPage from "./Contacts/Checkins/update-address.page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class PersonalDetailsPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Personal details", crn)
    }

    async goTo(crn?: string){
       await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/personal-details/`)
    }

    async navigateTo(crn?: string){
        await navigateToCase(this.page, (crn ?? this.crn)!)
        await this.getQA("personalDetailsTab").getByRole('link').first().click()
    }

    async updateContactDetails(details: ContactDetails){
        console.log(details)
        if (details.phone){
            await this.getQA('telephoneNumberAction').click()
        } else if (details.mobile) {
            await this.getQA('mobileNumberAction').click()
        } else if (details.email) {
            await this.getQA('emailAddressAction').click()
        } else {
            console.log('no details')
            return 
        }
        const contactDetailsPage = new ContactDetailsPage(this.page)
        await contactDetailsPage.checkOnPage()
        await contactDetailsPage.completePage(details)
    }

    async updateMainAddress(details: Address){
        await this.getQA('mainAddressAction').click()
        const updateAddressPage = new UpdateAddressPage(this.page)
        await updateAddressPage.checkOnPage()
        await updateAddressPage.completePage(details)
    }

    async getContactDetails(): Promise<ContactDetails>{
        const phone = await this.getQA('telephoneNumberValue').textContent()
        const mobile = await this.getQA('mobileNumberValue').textContent()
        const email = await this.getQA('emailAddressValue').textContent()
        return {
            phone: phone ? phone : undefined,
            mobile: mobile ? mobile : undefined,
            email: email ? email : undefined,
        }
    }

    async getAddressDetails(): Promise<AddressDetails>{
        const address = await this.getQA('mainAddressValue').textContent()
        if (address?.trim() === 'No main address'){
            return {
                address: address.trim(),
                type: '',
                startDate: '',
                note: 'No notes'
            }
        }
        const type = await this.getQA('addressTypeValue').textContent()
        const start = await this.getQA('mainAddressStartDateValue').textContent()
        let note = await this.getQA('mainAddressNotesValue').textContent()
        if (note?.trim() === ''){
            note = await this.getClass('app-note text-break', this.getQA('mainAddressValue')).textContent()
        }
        return {
            address: address ? address.trim().split('\n')[0] : undefined,
            type: type ? type.trim() : undefined,
            startDate: start ? start.trim() : undefined, 
            note: note ? note.trim().split('\n')[0] : undefined

        }
    }

    async noteDetails(): Promise<Details>{
        const contactDetails = await this.getContactDetails()
        const addressDetails = await this.getAddressDetails()
        return {
            contactDetails,
            addressDetails
        }
    }

    async checkForPractitioner(): Promise<boolean>{
        try {
            expect(await this.getSummaryRowByKey('Probation practitioner')).toBeDefined()
            await expect((await this.getSummaryRowValue(await this.getSummaryRowByKey('Probation practitioner')))).not.toHaveText('Unallocated', {timeout: 1000})
            return true
        } catch {
            return false
        }
       
    }
}