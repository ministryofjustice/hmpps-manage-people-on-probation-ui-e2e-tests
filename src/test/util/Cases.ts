import { DataTable } from "playwright-bdd"
import { YesNoCheck } from "./ReviewCheckins"

export interface CaseFilters  {
  name_crn?: string
  sentence?: string
  type?: string
}

export const caseDataTable = (data: DataTable) : CaseFilters => {
    let name_crn: string | undefined
    let sentence: string | undefined
    let type: string | undefined
    for (const row of data.hashes()){
        if (row.label === 'text'){
            name_crn = row.value
        }
        if (row.label === 'type'){
            type = row.value
        }
        if (row.label === 'sentence'){
            sentence = row.value
        }
    }

    const caseFilters : CaseFilters = {
        name_crn,
        type,
        sentence
    }

    return caseFilters
}