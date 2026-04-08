import 'dotenv/config'
import { chromium } from 'playwright'
import { loginAndGetCookies } from './login'
import { execSync } from 'node:child_process'

async function main() {
    const browser = await chromium.launch()

    try {
        const page = await browser.newPage()

        const { cookieHeader }  = await loginAndGetCookies(page)

        if (!cookieHeader?.trim()) throw new Error('cookieHeader is empty')

        execSync('npm run perf:home', {
            stdio: 'inherit',
            env: {
                ...process.env,
                PERF_COOKIE_HEADER: cookieHeader,
            },
        })
    } finally {
        await browser.close()
    }
}

await main()