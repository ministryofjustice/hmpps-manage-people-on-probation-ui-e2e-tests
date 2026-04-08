import { chromium } from 'playwright'
import { loginAndGetCookies } from './login'
import { execSync } from 'child_process'

async function main() {
    const browser = await chromium.launch()

    try {
        const page = await browser.newPage()

        const cookie = await loginAndGetCookies(page)

        console.log('Got session cookie')

        execSync(
            `PERF_SESSION_COOKIE=${cookie} npm run perf:home`,
            { stdio: 'inherit' }
        )
    } finally {
        await browser.close()
    }
}

main()