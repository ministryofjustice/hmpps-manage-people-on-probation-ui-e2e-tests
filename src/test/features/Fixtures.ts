import { Browser, BrowserContext, Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { MpopSetupChanges, MpopSetupCheckin } from '../utilities/SetupOnlineCheckins';
import { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person';
import AlertsPage from '../pageObjects/alerts';

type Ctx = {
  checkIns: CheckIns,
  contact: Contact
  base: Base,
  case: Case
  alerts: Alerts
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

export const test = base

export const testContext = base.extend<{ ctx: Ctx }>({
  ctx: async ({}, use) => {
    const ctx = {
      checkIns: {},
      contact: {},
      base: {},
      case: {},
      alerts: {}
    } as Ctx;
    await use(ctx);
  },
});