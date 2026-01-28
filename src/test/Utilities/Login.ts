import { expect, type Page } from '@playwright/test'
import HomePage from './pages/home.page'

export const login = async (page: Page) => {
    await page.goto(process.env.MANAGE_PEOPLE_ON_PROBATION_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page.locator('[data-qa="pageHeading"]')).toContainText('Manage people on probation')
}

export const loginIfNotAlready = async(page: Page) => {
    try {
        await login(page)
    } catch {
        const homePage = new HomePage(page)
        await homePage.checkOnPage()
    }
}