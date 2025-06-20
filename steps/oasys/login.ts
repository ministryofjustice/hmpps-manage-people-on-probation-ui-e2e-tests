import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    // await page.goto(process.env.MANAGE_PEOPLE_ON_PROBATION_URL)
    // await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.goto(process.env.OASYS_URL)
    await expect(page.locator('#loginbodyheader > h2')).toHaveText('Login')
    // await page.fill('#username', process.env.DELIUS_USERNAME!)
    // await page.fill('#password', process.env.DELIUS_PASSWORD!)
    // await page.click('#submit')
    await page.fill('#P101_USERNAME', process.env.OASYS_USERNAME!)
    await page.fill('#P101_PASSWORD', process.env.OASYS_PASSWORD!)
    await page.click('#P101_LOGIN_BTN')
    // await expect(page).toHaveTitle('Short-Term Accommodation (CAS-2)')
}


//
// import { type Page, expect } from '@playwright/test'
//
// export const login = async (page: Page, userType: UserType) => {
//     const { username, password } = oasysUserConfig(userType)
//     await page.goto(process.env.OASYS_URL)
//     await expect(page.locator('#loginbodyheader > h2')).toHaveText('Login')
//     await page.fill('#P101_USERNAME', username)
//     await page.fill('#P101_PASSWORD', password)
//     await page.click('#P101_LOGIN_BTN')
//     // await expect(page.locator('#loginbodyheader > h2')).toHaveText('Provider/Establishment')
// }
