import { MpopDateTime } from "../util/DateTime";

export interface MpopArrangeAppointment {
  sentence: string;
  type: string;
  attendee?: MpopAttendee;
  isVisor?: string;
  dateTime: MpopDateTime;
  location: string;
  text: string;
  mobile?: string;
  note?: string;
  sensitivity: string;
  sensitivityLocked?: boolean;
  appointmentType: string;
  outcomeType: string;
}

export interface MpopAppointmentChanges {
  sentenceId?: number | "person";
  typeId?: number;
  attendee?: MpopAttendee;
  isVisor?: boolean;
  dateTime?: MpopDateTime;
  locationId?: number | "not needed" | "not in list";
  text?: TextMessageOption;
  mobile?: string;
  note?: string;
  sensitivity?: boolean;
}

export interface MpopAttendee {
  provider?: string;
  team?: string;
  user?: string;
}

export interface RescheduleDetails {
  user: number;
  reason: string;
  sensitivity: boolean;
}

// SMS messages options
export const textMap = {
  Yes: "yes",
  "Yes, add a mobile number": "yes-add",
  "Yes, update their mobile number": "yes-update",
  No: "no",
} as const;

type TextMapKey = keyof typeof textMap;
export type TextMessageOption = (typeof textMap)[TextMapKey];
