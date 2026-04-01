import { substituteFields, preprocessTemplate } from '../../lib/utils'

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

describe('preprocessTemplate', () => {
  it('converts top-level header_2 spans to ## headings', () => {
    const content = '1. <span class="header_2" id="1">Service</span>'
    const result = preprocessTemplate(content)
    expect(result).toContain('## 1. Service')
    expect(result).not.toContain('<span')
  })

  it('converts header_3 spans to bold subsection headings', () => {
    const content = '    1. <span class="header_3" id="1.1">Access and Use.</span>  Body text.'
    const result = preprocessTemplate(content)
    expect(result).toContain('**1.1 Access and Use.**')
    expect(result).toContain('Body text.')
    expect(result).not.toContain('<span class="header_3"')
  })

  it('strips bare id-only spans', () => {
    const content = '        a. <span id="5.3.a">if</span> the other party fails'
    const result = preprocessTemplate(content)
    expect(result).toContain('if')
    expect(result).not.toContain('<span id=')
  })

  it('leaves cover-page style content unchanged', () => {
    const content = "### Effective Date\n[Today's date]"
    const result = preprocessTemplate(content)
    expect(result).toBe(content)
  })
})
