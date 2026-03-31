import 'dotenv/config'
import { chromium } from 'playwright'
import { loginAndGetCookies } from './login' // adjust path

async function main() {
    const browser = await chromium.launch({ headless: false })
    const page = await browser.newPage()

    try {
        await loginAndGetCookies(page)
        const { cookieHeader } = await loginAndGetCookies(page)

        process.stdout.write(cookieHeader)
    } finally {
        await browser.close()
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})