import { DataTable } from "playwright-bdd"
import { YesNoCheck } from "./ReviewCheckins"

export interface ContactFilters  {
  keywords?: string
  from?: string
  to?: string
  hide_system_generated: boolean
  compliance_filters: string[]
  category_filters: string[]
}
const parseList = (value?: string): string[] => {
    if (!value) return []

    const result: string[] = []
    for (const item of value.split(',')) {
        const cleaned = item.trim()
        if (cleaned && cleaned !== 'NaN' && !result.includes(cleaned)) {
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
