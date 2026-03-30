import {expect, Page} from "@playwright/test";
import * as dotenv from 'dotenv'
import CasePage from "./casepage";
import {caseNavigation, navigateToCase} from "../../util/Navigation";
import {AddressDetails, ContactDetails, Details} from "../../features/Fixtures";
import ContactDetailsPage from "./Contacts/Checkins/SetUp/update-contact-details.page";
import {Address} from "../../util/PersonalDetails";
import UpdateAddressPage from "./Contacts/Checkins/update-address.page";
import {DataTable} from "playwright-bdd";

dotenv.config({path: '.env'})
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

export default class PersonalDetailsPage extends CasePage {
    constructor(page: Page, crn?: string) {
        super(page, "Personal details", crn)
    }

    async goTo(crn?: string) {
        await this.page.goto(`${MPOP_URL}/case/${(crn ?? this.crn)!}/personal-details/`)
    }

    async navigateTo(crn?: string) {
        await caseNavigation(this.page, (crn ?? this.crn)!, "personalDetailsTab")
    }

    async updateContactDetails(details: ContactDetails) {
        if (details.phone) {
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
        await contactDetailsPage.assertOnPage()
        await contactDetailsPage.completePage(details)
    }

    async updateMainAddress(details: Address) {
        await this.getQA('mainAddressAction').click()
        const updateAddressPage = new UpdateAddressPage(this.page)
        await updateAddressPage.assertOnPage()
        await updateAddressPage.completePage(details)
    }

    async getContactDetails(): Promise<ContactDetails> {
        const phone = await this.getQA('telephoneNumberValue').textContent()
        const mobile = await this.getQA('mobileNumberValue').textContent()
        const email = await this.getQA('emailAddressValue').textContent()
        return {
            phone: phone ? phone : undefined,
            mobile: mobile ? mobile : undefined,
            email: email ? email : undefined,
        }
    }

    async getAddressDetails(): Promise<AddressDetails> {
        const address = await this.getQA('mainAddressValue').textContent()
        if (address?.trim() === 'No main address') {
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
        if (note?.trim() === '') {
            note = await this.getClass('app-note text-break', this.getQA('mainAddressValue')).textContent()
        }
        return {
            address: address ? address.trim().split('\n')[0] : undefined,
            type: type ? type.trim() : undefined,
            startDate: start ? start.trim() : undefined,
            note: note ? note.trim().split('\n')[0] : undefined

        }
    }

    async noteDetails(): Promise<Details> {
        const contactDetails = await this.getContactDetails()
        const addressDetails = await this.getAddressDetails()
        return {
            contactDetails,
            addressDetails
        }
    }

    async checkForPractitioner(): Promise<boolean> {
        try {
            expect(await this.getSummaryRowByKey('Probation practitioner')).toBeDefined()
            await expect((await this.getSummaryRowValue(await this.getSummaryRowByKey('Probation practitioner')))).not.toHaveText('Unallocated')
            return true
        } catch {
            return false
        }

    }

    async assertPersonalDetailsTitle(expectedTitle: string) {
        const actualTitle = await this.page.title()
        expect(actualTitle).toEqual(expectedTitle)
    }

    async assertSections(data: DataTable) {
        for (const row of data.rows()) {
            const label = row[0]

            switch (label) {
                case 'Phone number':
                    await expect(this.getQA('telephoneNumberLabel')).toContainText('Phone number')
                    break;
                case 'Mobile number':
                    await expect(this.getQA('mobileNumberLabel')).toContainText('Mobile number')
                    break;
                case 'Email Address':
                    await expect(this.getQA('emailAddressLabel')).toContainText('Email address')
                    break;
                case 'Main Address':
                    await expect(this.getQA('mainAddressLabel')).toContainText('Main address')
                    break;
                case 'Other addresses':
                    await expect(this.getQA('otherAddressesLabel')).toContainText('Other addresses')
                    break;
                case 'Contacts':
                    await expect(this.getQA('contactsLabel')).toContainText('Contacts')
                    break;
                case 'Name':
                    await expect(this.getQA('nameLabel')).toContainText('Name')
                    break;
                case 'Date of birth':
                    await expect(this.getQA('dateOfBirthLabel')).toContainText('Date of birth')
                    break;
                case 'Preferred name/Known as':
                    await expect(this.getQA('preferredNameLabel')).toContainText('Preferred name/Known as')
                    break;
                case 'Aliases':
                    await expect(this.getQA('aliasesLabel')).toContainText('Aliases')
                    break;
                case 'Previous name':
                    await expect(this.getQA('previousSurnameLabel')).toContainText('Previous name')
                    break;
                case 'Preferred language':
                    await expect(this.getQA('preferredLanguageLabel')).toContainText('Preferred language')
                    break;
                case 'Current circumstances':
                    await expect(this.getQA('currentCircumstancesLabel')).toContainText('Current circumstances')
                    break;
                case 'Disabilities':
                    await expect(this.getQA('disabilitiesLabel')).toContainText('Disabilities')
                    break;
                case 'Adjustments':
                    await expect(this.getQA('adjustmentsLabel')).toContainText('Adjustments')
                    break;
                case 'Personal documents':
                    await expect(this.getQA('documentsLabel')).toContainText('Personal documents')
                    break;
                case 'CRN':
                    await expect(this.getQA('crnLabel')).toContainText('CRN')
                    break;
                case 'PNC number':
                    await expect(this.getQA('pncLabel')).toContainText('PNC number')
                    break;
                case 'Prison number':
                    await expect(this.getQA('nomsLabel')).toContainText('Prison number')
                    break;
                case 'Probation practitioner':
                    await expect(this.getQA('staffContactRoleLabel').first()).toContainText('Probation practitioner')
                    break;
                case 'Prison offender manager (POM)':
                    await expect(this.getQA('staffContactRoleLabel').last()).toContainText('Prison offender manager (POM)')
                    break;
                case 'Religion or belief':
                    await expect(this.getQA('religionOrBeliefLabel')).toContainText('Religion or belief')
                    break;
                case 'Sex':
                    await expect(this.getQA('sexLabel')).toContainText('Sex')
                    break;
                case 'Gender identity':
                    await expect(this.getQA('genderIdentityLabel')).toContainText('Gender identity')
                    break;
                case 'Self-described gender':
                    await expect(this.getQA('selfDescribedGenderLabel')).toContainText('Self-described gender')
                    break;
                case 'Sexual orientation':
                    await expect(this.getQA('sexualOrientationLabel')).toContainText('Sexual orientation')
                    break;
            }
        }
    }

}