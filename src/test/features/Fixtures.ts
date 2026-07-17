import { Browser, BrowserContext, Page } from "@playwright/test";
import { test as base } from "playwright-bdd";
import {
  MpopSetupChanges,
  MpopSetupCheckin,
  MpopSetupRestart,
} from "../util/SetupOnlineCheckins";
import { Person } from "@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person.mjs";
import AlertsPage from "../pageObjects/alerts";
import { MpopArrangeAppointment } from "../util/ArrangeAppointment";
import MPopPage from "../pageObjects/page";

export interface Ctx {
  checkIns: CheckIns;
  contact: Contact;
  contacts: Contacts;
  base: Base;
  case: CaseType;
  cases: Cases;
  alerts: Alerts;
  manage: Manage;
  appointments: MpopArrangeAppointment[];
  details: Details;
  addressTypes: AddressType[];
  documents: Documents;
}
export interface Documents {
  count: number;
}
export interface Contacts {
  contacts: Activity[];
  count: string;
}
export interface AddressType {
  code: string;
  description: string;
}
export interface CheckIns {
  setup: MpopSetupCheckin;
  changes: MpopSetupChanges;
  expiredCrn: string;
  restart?: MpopSetupRestart;
}
export interface Contact {
  uuid?: string;
  contactId: string;
}
export interface Cases {
  count: number;
}
export interface Base {
  page: Page;
  browser: Browser;
  context: BrowserContext;
  currentPage?: MPopPage;
  currentCrn?: string;
  currentContactId?: string;
}
export interface CaseType {
  crn: string;
  person: Person;
  created: boolean;
}
export interface Alerts {
  alertCount: number;
  alertsPage: AlertsPage;
}
export interface Manage {
  noteCount: number;
  note: string;
}
export interface Activity {
  type: string;
  startDateTime: string;
  endDateTime?: string;
  appointmentNotes?: Note[];
  appointmentNote?: Note;
  isSensitive?: boolean;
  hasOutcome?: boolean;
}
export interface Note {
  id: number;
  createdBy?: string;
  createdByDate?: string;
  note: string;
  hasNotesBeenTruncated?: boolean;
}
export interface Details {
  contactDetails?: ContactDetails;
  addressDetails?: AddressDetails;
}
export interface ContactDetails {
  phone?: string;
  mobile?: string;
  email?: string;
}
export interface AddressDetails {
  address?: string;
  type?: string;
  startDate?: string;
  note?: string;
}

export const test = base;

export const testContext = base.extend<
  { ctx: Ctx },
  { ctxMap: Record<string, Ctx> }
>({
  ctx: async ({ ctxMap }, use, testInfo) => {
    ctxMap[testInfo.file] = ctxMap[testInfo.file] || {
      checkIns: {},
      contact: {},
      contacts: {},
      base: {},
      case: {},
      cases: {},
      alerts: {},
      manage: {},
      appointments: [],
      details: {},
      documents: {},
    };
    await use(ctxMap[testInfo.file]);
  },
  ctxMap: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const ctxMap: Record<string, Ctx> = {};
      await use(ctxMap);
      for (const ctx of Object.values(ctxMap)) await ctx.base?.page?.close();
    },
    { scope: "worker" },
  ],
});
