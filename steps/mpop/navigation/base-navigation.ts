import { Page } from "@playwright/test"
import CasesPage from "../pages/cases.page"
import SearchPage from "../pages/search.page"
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login.mjs'
import AlertsPage from "../pages/alerts"
import HomePage from "../pages/home.page"

export const navigateToAlerts = async(page: Page): Promise<AlertsPage> => {
    await loginToManageMySupervision(page)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Alerts")
    const alertsPage = new AlertsPage(page)
    return alertsPage
}

export const navigateToCases = async(page: Page): Promise<CasesPage> => {
     await loginToManageMySupervision(page)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Cases")
    const casesPage = new CasesPage(page)
    return casesPage
}

export const navigateToSearch = async(page: Page): Promise<SearchPage> => {
     await loginToManageMySupervision(page)
    const homePage = new HomePage(page)
    await homePage.usePrimaryNavigation("Search")
    const searchPage = new SearchPage(page)
    return searchPage
}

