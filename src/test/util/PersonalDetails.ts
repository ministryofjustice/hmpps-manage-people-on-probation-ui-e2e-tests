import { DataTable } from "playwright-bdd"
import { AddressDetails, AddressType, ContactDetails, Details } from "../features/Fixtures"
import { YesNoCheck } from "./ReviewCheckins"
import { dateTimeMapping, dateWithLongMonth, luxonString, stringToDate } from "./DateTime"

export interface Address {
    address?: string[]
    type: string
    verified: YesNoCheck
    start: string
    end?: string
    note?: string
}

export const contactDetailsDataTable = (data: DataTable) : ContactDetails => {
    let phone: string | undefined
    let mobile: string | undefined
    let email: string | undefined
    for (const row of data.hashes()){
        if (row.label === 'phone'){
            phone = row.value
        }
        if (row.label === 'mobile'){
            mobile = row.value
        }
        if (row.label === 'email'){
            email = row.value
        }
    }

    const contactDetails = {
        phone, 
        mobile,
        email
    }

    return contactDetails
}

export const getUpdatedContactDetails = (current: ContactDetails, updates: ContactDetails): ContactDetails => {
     const contactDetails : ContactDetails = {
       mobile: updates.mobile !== '' ? updates.mobile : current.mobile,
       phone: updates.phone !== '' ? updates.phone : current.phone,
       email: updates.email !== '' ? updates.email : current.email
     }
     return contactDetails 
}

export const getUpdatedAddressDetails = (current: AddressDetails, updates: Address, typeMapping: AddressType[]): AddressDetails => {
    if (updates.end && updates.end !== ''){
        return {
            address: 'No main address',
            type: '',
            startDate: '',
            note: 'No notes'
        }
       
    }
    let address: string = updates.address?.join('')!
    if (address === ''){
        address = 'No fixed address'
    }
    const startDate = dateWithLongMonth(updates.start)
    let type = ''
    for (let i = 0; i<typeMapping.length; i++){
        if (typeMapping[i].code === updates.type){
            type = typeMapping[i].description
            break
        }
    }
    const addressDetails : AddressDetails = {
       address: address !== '' ? address : current.address,
       type: type + (updates.verified === YesNoCheck.YES ? ' (verified)' : ' (not verified)'),
       startDate: startDate ?? current.startDate,
       note: updates.note !== '' ? updates.note : current.note
     }
     return addressDetails
}

export const addressDataTable = (data: DataTable) : Address => {
    let address: string[] = []
    let type: string 
    let verified: YesNoCheck 
    let start: string 
    let end: string | undefined
    let note: string | undefined

    for (const row of data.hashes()){
        if (row.label === 'address'){
            address = row.value.split(',')
            if (address.length >= 2){
                address[1] = address[1] + ' '
            }
            if (address.length === 1 && address[0] === ''){
                address = []
            }
        }
        if (row.label === 'type'){
            type = row.value
        }
        if (row.label === 'verified'){
            verified = YesNoCheck[row.value as keyof typeof YesNoCheck]
        }
        if (row.label === 'startDate'){
            start = luxonString(dateTimeMapping[row.value])
        }
        if (row.label === 'endDate'){
            if (row.value !== ''){
                end = luxonString(dateTimeMapping[row.value])
            }
        }
        if (row.label === 'note'){
            note = row.value
        }
    }

    const addressDetails = {
        address,
        type: type!,
        verified: verified!,
        start: start!,
        end,
        note
    }

    return addressDetails
}