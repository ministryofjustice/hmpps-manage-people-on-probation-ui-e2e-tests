import { BrowserContext, BrowserContextOptions, Page } from '@playwright/test'

export const getUuid = (page: Page) => {
    const url = page.url()
    const split = url.split('?')[0].split('/')
    return split[split.length - 3]
}

export const getBrowserContext = (test: string) : BrowserContextOptions | undefined => {
    return process.env.LOCAL ? { recordVideo: { dir: `videos/${test}`}} : undefined
}