import { DataTable } from "playwright-bdd"
import { YesNoCheck } from "./ReviewCheckins"

export interface ContactFilters  {
  keywords?: string
  from?: string
  to?: string
  outcome: boolean
  complied: boolean
  not_complied: boolean
}

export const contactDataTable = (data: DataTable) : ContactFilters => {
    let keywords: string | undefined
    let from: string | undefined
    let to: string | undefined
    let outcome: boolean = false
    let complied: boolean = false
    let not_complied: boolean = false

    for (const row of data.hashes()){
        if (row.label === 'date_from'){
            from = row.value
        }
        if (row.label === 'date_to'){
            to = row.value
        }
        if (row.label === 'keywords'){
            keywords = row.value
        }
        if (row.label === 'outcomes'){
            outcome = row.value === 'YES' ? true : false
        }
        if (row.label === 'complied'){
            complied = row.value === 'YES' ? true : false
        }
        if (row.label === 'not_complied'){
            not_complied = row.value === 'YES' ? true : false
        }
    }

    const contactFilters : ContactFilters = {
        keywords,
        from,
        to,
        outcome,
        complied,
        not_complied
    }

    return contactFilters
}