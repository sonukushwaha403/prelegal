export interface FormValues {
  party1Company: string
  party1Name: string
  party1Title: string
  party1Address: string
  party2Company: string
  party2Name: string
  party2Title: string
  party2Address: string
  purpose: string
  effectiveDate: string
  mndaTermType: 'expires' | 'continues'
  mndaTermYears: string
  confidentialityType: 'years' | 'perpetuity'
  confidentialityYears: string
  governingLaw: string
  jurisdiction: string
  modifications: string
}

export interface CatalogEntry {
  name: string
  description: string
  filename: string
}

export type DocFields = Record<string, string>
