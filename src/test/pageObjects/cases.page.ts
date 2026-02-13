import { expect, Page } from "@playwright/test";
import MPopPage from "./page";
import { MPOP_URL } from "../util/Data";
import { baseNavigation } from "../util/Navigation";

export default class CasesPage extends MPopPage {
    constructor(page: Page) {
        super(page, "Cases")
    }

    async goTo(){
       await this.page.goto(`${MPOP_URL}/case`)
    }

    async filterCases(text?: string, sentenceCode?: string, typeCode?: string){
        if (text){
            await this.page.getByRole('textbox').fill(text)
        }
        if (sentenceCode){
            await this.page.locator(`[name="sentenceCode"]`).selectOption(sentenceCode)
        }
        if (typeCode){
            await this.page.locator(`[name="nextContactCode"]`).selectOption(typeCode)
        }
        await this.page.getByRole('button', {name: "Filter cases"}).click()
    }

    async selectCaseByID(id: number){
        this.clickTableLink("myCasesCard", `nameOrCrnValue${id}`)
    }

    async navigateTo(page: Page) {
        await baseNavigation(page, "Cases")
    }
    
}