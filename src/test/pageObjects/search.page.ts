import { expect, Page } from "@playwright/test";
import * as dotenv from 'dotenv'
import { baseNavigation } from "../utilities/Navigation";
import MPopPage from "./Page";

dotenv.config({ path: '.env' })
const MPOP_URL = process.env.MANAGE_PEOPLE_ON_PROBATION_URL

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

    async selectCaseByID(id: number){
        await this.page.getByRole("table").getByRole("row").nth(id).getByRole("link").click()
    }

    async navigateTo(page: Page) {
        await baseNavigation(page, "Search")
    }
    
}