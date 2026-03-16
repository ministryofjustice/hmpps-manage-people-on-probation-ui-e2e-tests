import { DataTable } from "playwright-bdd"
import { YesNoCheck } from "./ReviewCheckins"

export interface ContactFilters  {
  keywords?: string
  from?: string
  to?: string
  hide_system_generated: boolean
  compliance_filters: number[]
  category_filters: number[]
}

export const contactDataTable = (data: DataTable) : ContactFilters => {
    let keywords: string | undefined
    let from: string | undefined
    let to: string | undefined
    let hide_system_generated: boolean = false
    let compliance_filters: number[] = []
    let category_filters: number[] = []
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
        if (row.label === 'system_generated'){
            hide_system_generated = row.value === 'YES' ? true : false
        }
        if (row.label === 'compliance_filters'){
            const strings = row.value.split(',')
            for (let i=0; i<strings.length; i++){
                if (strings[i] !== ''){
                    compliance_filters.push(Number(strings[i]))
                }
            }
        }
        if (row.label === 'category_filters'){
            const strings = row.value.split(',')
            for (let i=0; i<strings.length; i++){
                if (strings[i] !== ''){
                    category_filters.push(Number(strings[i]))
                }
            }
        }
    }

    const contactFilters : ContactFilters = {
        keywords,
        from,
        to,
        hide_system_generated,
        compliance_filters,
        category_filters
    }

    return contactFilters
}