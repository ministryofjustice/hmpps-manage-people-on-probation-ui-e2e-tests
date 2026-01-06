import { Page } from "@playwright/test"
import CasesPage from "../pages/cases.page"
import SearchPage from "../pages/search.page"
import AlertsPage from "../pages/alerts"
import HomePage from "../pages/home.page"

export const navigateToAlerts = async(page: Page): Promise<AlertsPage> => {
    const homePage = new HomePage(page)
    await homePage.goTo()
    await homePage.usePrimaryNavigation("Alerts")
    return new AlertsPage(page)
}

export const navigateToCases = async(page: Page): Promise<CasesPage> => {
    const homePage = new HomePage(page)
    await homePage.goTo()
    await homePage.usePrimaryNavigation("Cases")
    return new CasesPage(page)
}

export const navigateToSearch = async(page: Page): Promise<SearchPage> => {
    const homePage = new HomePage(page)
    await homePage.goTo()
    await homePage.usePrimaryNavigation("Search")
    return new SearchPage(page)
}

