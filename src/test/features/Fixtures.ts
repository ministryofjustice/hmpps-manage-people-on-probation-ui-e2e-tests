import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { MpopSetupChanges, MpopSetupCheckin } from '../util/SetupOnlineCheckins';

type Ctx = {
  setup: MpopSetupCheckin
  changes: MpopSetupChanges
  uuid: string
};

export const test = base

export const checkInTest = base.extend<{ ctx: Ctx }>({
  ctx: async ({}, use) => {
    const ctx = {} as Ctx;
    await use(ctx);
  },
});