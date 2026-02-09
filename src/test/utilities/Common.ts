import { BrowserContext, BrowserContextOptions, Page } from '@playwright/test'

export const getUuid = (page: Page) => {
    const url = page.url()
    const split = url.split('?')[0].split('/')
    return split[split.length - 3]
}

export const getBrowserContext = (test: string) : BrowserContextOptions | undefined => {
    return process.env.LOCAL ? { recordVideo: { dir: `videos/${test}`}} : undefined
}

export const randomPicker = <T>(array: T[]): T => {
    return array[Math.floor(Math.random()*array.length)]
}

export const chance = () => {
 return Math.random() < 0.5
}

export const randomEnum = <T>(anEnum: any): T[keyof T] => {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  return randomPicker(enumValues)
}