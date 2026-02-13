import { Page } from "@playwright/test"
import HomePage from "../pageObjects/home.page"
import SearchPage from "../pageObjects/search.page"
import OverviewPage from "../pageObjects/Case/overview.page"

export const baseNavigation = async(page: Page, target: string) => {
    const homePage = new HomePage(page)
    await homePage.goTo()
    await homePage.usePrimaryNavigation(target)
}

export const caseNavigation = async(page: Page, crn: string, target: string) => {
    const overviewPage = new OverviewPage(page)
    await navigateToCase(page, crn)
    await overviewPage.useSubNavigation(target)
}

export const navigateToCase = async(page: Page, crn: string) => {
    const searchPage = new SearchPage(page)
    await searchPage.navigateTo(page)
    await searchPage.searchCases(crn)
    await searchPage.selectCaseByID(1)
}
