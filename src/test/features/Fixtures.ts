import { Browser, BrowserContext, Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { MpopSetupChanges, MpopSetupCheckin } from '../util/SetupOnlineCheckins';
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person';
import AlertsPage from '../pageObjects/alerts';

type Ctx = {
  checkIns: CheckIns,
  contact: Contact
  base: Base,
  case: Case
  alerts: Alerts
  manage: Manage
};

type CheckIns = {
  setup: MpopSetupCheckin
  changes: MpopSetupChanges
  expiredCrn: string
}
type Contact = {
  uuid: string
}
type Base = {
  page: Page,
  browser: Browser,
  context: BrowserContext
}
type Case = {
  crn: string
  person: Person
}
type Alerts = {
  alertCount: number
  alertsPage: AlertsPage
}
type Manage = {
  noteCount: number
}

export const test = base

export const testContext = base.extend<{ ctx: Ctx }, { ctxMap: Record<string, Ctx> }>({
  ctx: async ({ ctxMap }, use, testInfo) => {
    ctxMap[testInfo.file] = ctxMap[testInfo.file] || {
      checkIns: {},
      contact: {},
      base: {},
      case: {},
      alerts: {},
      manage: {}
    }
    await use(ctxMap[testInfo.file])
  },
  ctxMap: [async ({}, use) => {
    const ctxMap: Record<string,Ctx> = {};
    await use(ctxMap)
    for (const ctx of Object.values(ctxMap)) await ctx.base?.page?.close();
  }, { scope: 'worker' }]
});