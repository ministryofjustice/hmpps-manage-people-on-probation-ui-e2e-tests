import {Page} from "@playwright/test"
import CasesPage from "../pages/cases.page"
import SearchPage from "../pages/search.page"
import AlertsPage from "../pages/alerts"
import HomePage from "../pages/home.page"
import {loginIfNotAlready} from "../login"

export const navigateToAlerts = async(page: Page): Promise<AlertsPage> => {
    await page.goto(process.env.MANAGE_PEOPLE_ON_PROBATION_URL)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Alerts")
    return new AlertsPage(page)
}

export const navigateToCases = async(page: Page): Promise<CasesPage> => {
    await loginIfNotAlready(page)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Cases")
    const casesPage = new CasesPage(page)
    return casesPage
}

export const navigateToSearch = async(page: Page): Promise<SearchPage> => {
    await loginIfNotAlready(page)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Search")
    const searchPage = new SearchPage(page)
    return searchPage
}

