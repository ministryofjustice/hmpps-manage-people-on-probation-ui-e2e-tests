import { expect, type Page } from '@playwright/test'

export const loginAndGetCookies = async (page: Page) => {
    await page.goto("http://localhost:3000")
    if (await page.title() !== 'Manage people on probation') {
        await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
        await page.fill('#username', process.env.DELIUS_USERNAME!)
        await page.fill('#password', process.env.DELIUS_PASSWORD!)
        await page.click('#submit')
    }
    await expect(page.locator('[data-qa="pageHeading"]')).toContainText('Manage people on probation')

    const cookies = await page.context().cookies()

    const appCookie = cookies.find(
        c => c.name === 'hmpps-manage-people-on-probation-ui.session'
    )

    if (!appCookie) {
        throw new Error('Session cookie not found')
    }

    return {
        appCookie,
        cookies,
        cookieHeader: cookies.map(c => `${c.name}=${c.value}`).join('; '),
    }
}