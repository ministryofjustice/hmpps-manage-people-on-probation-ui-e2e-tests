import { Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";

export default class HomePage extends MPopPage {
    constructor(page: Page) {
        super(page, "Manage people on probation")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/`)
    }

    async logMoreOutcomes(){
        await this.getQA('homepage-outcomes').getByRole('link', {name: "Log more outcomes"}).click()
    }

    async viewUpcoming(){
        await this.getQA('homepage-appointments').getByRole('link', {name: "View all upcoming appointments"}).click()
    } 

    async checkSections(){
        await this.getClass('dps-homepage-search').isVisible()
        await this.getQA('homepage-appointments').isVisible()
        await this.getQA('homepage-outcomes').isVisible()
        await this.getQA('homepage-services-section').isVisible()
    }

    async returnToPage(){
        await this.usePrimaryNavigation('Home')
    }

    async checkLinks(){
        await this.getQA('search-submit').click()
        await this.returnToPage()
        await this.page.getByRole('link', {name: 'View your cases'}).click()
        await this.returnToPage()
    }
}