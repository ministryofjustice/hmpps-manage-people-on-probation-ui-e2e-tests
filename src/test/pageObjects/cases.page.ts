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
        await this.clickTableLink("myCasesCard", `nameOrCrnValue${id}`)
    }

    async getCount(): Promise<number>{
        const text = await this.getQA('pagination').textContent()
        console.log(text)
        const count = text?.match(/\d+(,\d+)*/g) as unknown as number[]
        console.log(count)
        return parseInt(count[2].toString().replace(/\,/g,''),10)
    }

    async navigateTo() {
        await baseNavigation(this.page, "Cases")
    }
    
}