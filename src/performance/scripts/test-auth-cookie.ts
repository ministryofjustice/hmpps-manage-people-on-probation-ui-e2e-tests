import 'dotenv/config'
import { chromium } from 'playwright'
import { loginAndGetCookies } from './login'

const browser = await chromium.launch({ headless: false })
const page = await browser.newPage()

try {
    const { cookieHeader } = await loginAndGetCookies(page)

    process.stdout.write(cookieHeader)
} catch (err) {
    console.error(err)
    process.exitCode = 1
} finally {
    await browser.close()
}
