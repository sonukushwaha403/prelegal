import { render, screen } from '@testing-library/react'
import NDAPreview from '@/components/NDAPreview'
import { FormValues } from '@/lib/types'

const baseValues: FormValues = {
  party1Company: '',
  party1Name: '',
  party1Title: '',
  party1Address: '',
  party2Company: '',
  party2Name: '',
  party2Title: '',
  party2Address: '',
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '2026-04-01',
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityType: 'years',
  confidentialityYears: '1',
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
}

describe('NDAPreview', () => {
  it('renders the document title', () => {
    render(<NDAPreview values={baseValues} />)
    expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument()
  })

  it('shows blue placeholder for empty governing law', () => {
    render(<NDAPreview values={baseValues} />)
    // Empty governingLaw → should render [Governing Law] placeholder text
    const placeholders = screen.getAllByText('[Governing Law]')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('substitutes party company name when provided', () => {
    render(<NDAPreview values={{ ...baseValues, party1Company: 'Acme Corp' }} />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('renders the formatted effective date', () => {
    render(<NDAPreview values={baseValues} />)
    // Date appears in both the cover page and section 5 of the standard terms
    const dates = screen.getAllByText('April 1, 2026')
    expect(dates.length).toBeGreaterThan(0)
  })

  it('renders mndaTerm correctly for expires type', () => {
    render(<NDAPreview values={{ ...baseValues, mndaTermType: 'expires', mndaTermYears: '2' }} />)
    expect(screen.getByText('2 year(s) from Effective Date')).toBeInTheDocument()
  })

  it('renders mndaTerm correctly for continues type', () => {
    render(<NDAPreview values={{ ...baseValues, mndaTermType: 'continues' }} />)
    expect(
      screen.getByText('continues until terminated in accordance with the terms of the MNDA')
    ).toBeInTheDocument()
  })

  it('renders all 11 standard terms sections', () => {
    render(<NDAPreview values={baseValues} />)
    for (let i = 1; i <= 11; i++) {
      // Each section heading starts with the number
      expect(screen.getByText(new RegExp(`^${i}\\.`))).toBeInTheDocument()
    }
  })
})
