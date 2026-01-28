import { MpopDateTime } from "./DateTime"

export interface MpopArrangeAppointment {
  sentenceId: number
  typeId: number
  attendee?: MpopAttendee
  isVisor?: boolean
  dateTime: MpopDateTime
  locationId: number
  note?: string
  sensitivity: boolean
}

export interface MpopAttendee {
  provider?: string
  team?: string
  user?: string
}