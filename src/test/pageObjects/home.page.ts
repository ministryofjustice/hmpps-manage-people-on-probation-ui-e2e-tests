import { Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";
import UpcomingAppointmentsPage from "./upcoming.page";
import LogOutcomesPage from "./log-outcomes.page";

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
        await this.assertOnPage()
    }

    async showUpcoming(){
        await this.getQA('homepage-appointments').getByRole('button').click({position: {x:0, y:0}})
    }
    async noteUpcoming(): Promise<string[]> {
        await this.showUpcoming()
        const text = await this.getQA('homepage-appointments').getByRole('link', {name: /,/}).allTextContents()
        return text.map(i => i.trim())
    }
    async checkUpcoming(){
        const upcoming = await this.noteUpcoming()
        await this.page.getByRole('link', {name: 'View all upcoming appointments'}).click()
        const upcomingPage = new UpcomingAppointmentsPage(this.page)
        await upcomingPage.assertOnPage()
        await upcomingPage.checkTop5(upcoming)
        await this.returnToPage()
    }

    async showOutcomes(){
        await this.getQA('homepage-outcomes').getByRole('button').click({position: {x:0, y:0}})
    }
    async noteOutcomes(): Promise<string[]> {
        await this.showOutcomes()
        const text = await this.getQA('homepage-outcomes').getByRole('link', {name: /,/}).allTextContents()
        return text.map(i => i.trim())
    }
    async checkOutcomes(){
        const outcomes = await this.noteOutcomes()
        await this.page.getByRole('link', {name: 'Log more outcomes'}).click()
        const outcomesPage = new LogOutcomesPage(this.page)
        await outcomesPage.assertOnPage()
        await outcomesPage.checkTop5(outcomes)
        await this.returnToPage()
    }

    async checkLinks(){
        await this.getQA('search-submit').click()
        await this.returnToPage()
        await this.page.getByRole('link', {name: 'View your cases'}).click()
        await this.returnToPage()
        await this.checkUpcoming()
        await this.checkOutcomes()
       

    }
}