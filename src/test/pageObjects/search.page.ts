import { expect, Page } from "@playwright/test";
import { baseNavigation } from "../utilities/Navigation";
import MPopPage from "./page";
import { MPOP_URL } from "../utilities/Data";

export default class SearchPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Find a person on probation")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/search`)
    }

    async searchCases(text: string){
        await this.getClass("moj-search").getByRole("searchbox").fill(text)
        await this.page.getByRole("button", {name: "Search"}).click()
    }

    async countCases(){
        return await this.page.getByRole("table").getByRole("row").count()
    }

    async selectCaseByID(id: number){
        await this.page.getByRole("table").getByRole("row").nth(id).getByRole("link").click()
    }

    async navigateTo(page: Page) {
        await baseNavigation(page, "Search")
    }
    
}