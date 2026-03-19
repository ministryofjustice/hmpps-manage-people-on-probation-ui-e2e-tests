import { DataTable } from "playwright-bdd"

export interface DocFilters {
    keywords?: string
    from?: string
    to?: string
    level?: string
}

export const documentsDataTable = (data: DataTable): DocFilters => {
    const filters: DocFilters = {
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

            case 'level':
                filters.level = value
                break
        }
    }

    return filters
}