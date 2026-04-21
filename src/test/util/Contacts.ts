import {DataTable} from "playwright-bdd";


export interface ContactFilters {
    keywords?: string
    from?: string
    to?: string
    hide_system_generated: boolean
    compliance_filters: string[]
    category_filters: string[]
}
export interface ContactData{
    contact: string
    relation_to: string
    title?: string
    date: string
    time: string
    contact_details: string
    visor_report: boolean
    sensitive_info: boolean
    alert_practitioner: boolean
}

const parseList = (value?: string): string[] => {
    if (!value) return []

    const result: string[] = []

    for (const item of value.split(',')) {
        const cleaned = item.trim()

        if (cleaned && !result.includes(cleaned)) {
            result.push(cleaned)
        }
    }

    return result
}

const parseBoolean = (value?: string): boolean => {
    if (!value) return false
    return value.trim().toUpperCase() === 'YES'
}

export const contactDataTable = (data: DataTable): ContactFilters => {
    const filters: ContactFilters = {
        hide_system_generated: false,
        compliance_filters: [],
        category_filters: [],
    }

    for (const row of data.hashes()) {
        const label = row.label?.trim()
        const value = row.value?.trim()

        switch (label) {
            case 'keywords':
                filters.keywords = value
                break

            case 'date_from':
                filters.from = value
                break

            case 'date_to':
                filters.to = value
                break

            case 'system_generated':
                filters.hide_system_generated = parseBoolean(value)
                break

            case 'compliance_filters':
                filters.compliance_filters = parseList(value)
                break

            case 'category_filters':
                filters.category_filters = parseList(value)
                break
        }
    }

    return filters
}

export const addContactDataTable = (data: DataTable): ContactData => {
    const newContactData : ContactData = {
        alert_practitioner: false,
        contact_details: "",
        relation_to: "",
        date: "",
        contact: "",
        sensitive_info: false,
        time: "",
        visor_report: false
    }

    for (const row of data.hashes()) {
        const label = row.label?.trim()
        const value = row.value?.trim()

        switch (label) {
            case 'contact':
                newContactData.contact = value
                break

            case 'relation_to':
                newContactData.relation_to = value
                break

            case 'title':
                newContactData.title = value
                break
            case 'date':
                newContactData.date = value
                break
            case 'time':
                newContactData.time = value
                break
            case 'contact_details':
                newContactData.contact_details = value
                break

            case 'visor_report':
                newContactData.visor_report = parseBoolean(value)
                break

            case 'sensitive_info':
                newContactData.sensitive_info = parseBoolean(value)
                break

            case 'alert_practitioner':
                newContactData.alert_practitioner = parseBoolean(value)
                break

        }
    }

    return newContactData
}

