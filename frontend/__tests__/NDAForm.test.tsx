import { render, screen, fireEvent } from '@testing-library/react'
import NDAForm from '@/components/NDAForm'
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
  purpose: '',
  effectiveDate: '',
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityType: 'years',
  confidentialityYears: '1',
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
}

describe('NDAForm', () => {
  it('renders all section headings', () => {
    render(<NDAForm values={baseValues} onChange={jest.fn()} />)
    expect(screen.getByText('Party 1')).toBeInTheDocument()
    expect(screen.getByText('Party 2')).toBeInTheDocument()
    expect(screen.getByText('Agreement Terms')).toBeInTheDocument()
    expect(screen.getByText('Governing Law & Jurisdiction')).toBeInTheDocument()
    expect(screen.getByText('Modifications')).toBeInTheDocument()
  })

  it('calls onChange with correct field and value when party1Company changes', () => {
    const onChange = jest.fn()
    render(<NDAForm values={baseValues} onChange={onChange} />)
    const input = screen.getByPlaceholderText('Acme Corp')
    fireEvent.change(input, { target: { value: 'Test Corp' } })
    expect(onChange).toHaveBeenCalledWith('party1Company', 'Test Corp')
  })

  it('calls onChange with correct field and value when party2Company changes', () => {
    const onChange = jest.fn()
    render(<NDAForm values={baseValues} onChange={onChange} />)
    const input = screen.getByPlaceholderText('Globex Inc.')
    fireEvent.change(input, { target: { value: 'Rival Co' } })
    expect(onChange).toHaveBeenCalledWith('party2Company', 'Rival Co')
  })

  it('calls onChange when MNDA Term radio is switched to continues', () => {
    const onChange = jest.fn()
    render(<NDAForm values={baseValues} onChange={onChange} />)
    const radio = screen.getByDisplayValue('continues')
    fireEvent.click(radio)
    expect(onChange).toHaveBeenCalledWith('mndaTermType', 'continues')
  })

  it('calls onChange when confidentiality radio is switched to perpetuity', () => {
    const onChange = jest.fn()
    render(<NDAForm values={baseValues} onChange={onChange} />)
    const radio = screen.getByDisplayValue('perpetuity')
    fireEvent.click(radio)
    expect(onChange).toHaveBeenCalledWith('confidentialityType', 'perpetuity')
  })

  it('disables the mndaTermYears input when mndaTermType is continues', () => {
    render(
      <NDAForm values={{ ...baseValues, mndaTermType: 'continues' }} onChange={jest.fn()} />
    )
    // The years number input is inside the expires radio row; it should be disabled
    const yearsInputs = screen.getAllByRole('spinbutton')
    expect(yearsInputs[0]).toBeDisabled()
  })

  it('labels are associated with their inputs via label wrapping', () => {
    render(<NDAForm values={baseValues} onChange={jest.fn()} />)
    // Party 1 and Party 2 both have "Company Name" — getAllByRole confirms label association works
    const companyInputs = screen.getAllByRole('textbox', { name: /Company Name/i })
    expect(companyInputs).toHaveLength(2)
    // Single governing law field
    expect(screen.getByRole('textbox', { name: /Governing Law/i })).toBeInTheDocument()
  })
})
