import { substituteFields } from '../../lib/utils'

describe('substituteFields', () => {
  it('replaces a filled span field with bold value', () => {
    const content = '<span class="keyterms_link">Governing Law</span>'
    const result = substituteFields(content, { 'Governing Law': 'Delaware' })
    expect(result).toContain('Delaware')
    expect(result).toContain('<strong')
    expect(result).not.toContain('keyterms_link')
  })

  it('renders empty field as italic placeholder', () => {
    const content = '<span class="coverpage_link">Customer</span>'
    const result = substituteFields(content, {})
    expect(result).toContain('[Customer]')
    expect(result).toContain('<em')
  })

  it('strips header spans, keeping their text', () => {
    const content = '<span class="header_2" id="1">Service</span>'
    const result = substituteFields(content, {})
    expect(result).toBe('Service')
  })

  it('handles multiple fields in one template', () => {
    const content =
      'Between <span class="coverpage_link">Provider</span> and <span class="coverpage_link">Customer</span>.'
    const result = substituteFields(content, { Provider: 'Acme', Customer: 'Globex' })
    expect(result).toContain('Acme')
    expect(result).toContain('Globex')
    expect(result).not.toContain('coverpage_link')
  })

  it('handles different link class types', () => {
    const cases = ['coverpage_link', 'keyterms_link', 'orderform_link', 'businessterms_link']
    for (const cls of cases) {
      const content = `<span class="${cls}">Field</span>`
      const result = substituteFields(content, { Field: 'Value' })
      expect(result).toContain('Value')
    }
  })

  it('returns content unchanged if no span fields present', () => {
    const content = '# Plain markdown\n\nSome text with no placeholders.'
    const result = substituteFields(content, {})
    expect(result).toBe(content)
  })
})
