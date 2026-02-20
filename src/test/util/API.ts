import { APIResponse, Page, request } from '@playwright/test';
import * as dotenv from 'dotenv'
import { luxonString } from './DateTime';
import { photo_1_path, video_1_path } from './Data';
import { SurveyResponse } from './ReviewCheckins';
dotenv.config({ path: '.env' })

const MAS_API_URL = process.env.MAS_API_URL
const SIGN_IN_URL = process.env.SIGN_IN_URL
const E_SUPERVISION_API_URL = process.env.E_SUPERVISION_API_URL
const OUTLOOK_API_URL = process.env.OUTLOOK_API_URL

export const getClientToken = async() : Promise<string> => {
    const signin_context = await request.newContext({
        baseURL: SIGN_IN_URL,
        httpCredentials: {
            username: process.env.API_USERNAME!,
            password: process.env.API_PASSWORD!
        }
    });
    const token = await signin_context.post('/auth/oauth/token?grant_type=client_credentials')
    const body: any = await token.json()
    return await body.access_token
}

export const getCalenderEvent = async(urn: string, token: string) => {
    const context = await request.newContext({
        baseURL: OUTLOOK_API_URL,
    });
    const response: APIResponse = await context.get(`/calendar/event?supervisionAppointmentUrn=${urn}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const body : any = await response.json()
    return [response.status(), body]
}

export const getExternalReference = async(crn: string, contactId: string, token: string) => {
    const context = await request.newContext({
        baseURL: MAS_API_URL,
    });
    const response = await context.get(`/schedule/${crn}/appointment/${contactId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const body : any = await response.json()
    return body.appointment.externalReference
}

export const getProbationPractitioner = async(crn: string, token: string) => {
    const context = await request.newContext({
        baseURL: MAS_API_URL,
    });
    const response = await context.get(`/case/${crn}/probation-practitioner`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const body : any = await response.json()
    return body.username
}


export const createEsupervisionCheckin = async(practitioner: string, crn: string, date: string, token: string) : Promise<string> => {
    const context = await request.newContext({
        baseURL: E_SUPERVISION_API_URL,
    });
    const response = await context.post(`/v2/offender_checkins/crn`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            "practitioner": practitioner,
            "offender": crn,
            "dueDate": date
        }
    })
    const body = await response.json()
    console.log(body)
    return body.uuid
}

export const postEsupervisionVideo = async(page: Page, uuid: string, token: string) => {
    const context = await request.newContext({
        baseURL: E_SUPERVISION_API_URL,
    });
    const response = await context.post(`/v2/offender_checkins/${uuid}/upload_location`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            "video": 'video/mp4',
            'snapshots': ['image/jpeg','image/jpeg']
        }
    })
    const body = await response.json()

    const videoUrl = body.video.url
    const videoType = body.video.contentType
    const snapshotUrl = body.snapshots[0].url
    const snapshotType = body.snapshots[0].contentType
    await fetch(videoUrl, {
        method: 'PUT',
        body: '',
        headers: {
            'Content-Type': videoType
        }
    })
    await fetch(snapshotUrl, {
        method: 'PUT',
        body: '',
        headers: {
            'Content-Type': snapshotType
        }
    })
}

export const verifyEsupervisionVideo = async(uuid: string, token: string) => {
    const context = await request.newContext({
        baseURL: E_SUPERVISION_API_URL,
    });
    await context.post(`/v2/offender_checkins/${uuid}/video-verify`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            'numSnapshots': 1
        }
    })
}

export const submitEsupervisionCheckin = async(uuid: string, token: string, surveyResponse: SurveyResponse) => {
    const context = await request.newContext({
        baseURL: E_SUPERVISION_API_URL,
    });
    await context.post(`/v2/offender_checkins/${uuid}/submit`, {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            "survey": surveyResponse
        }
    })
}