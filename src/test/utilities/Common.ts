import { Page } from '@playwright/test'

export const getUuid = (page: Page) => {
    const url = page.url()
    const split = url.split('?')[0].split('/')
    return split[split.length - 2]
}