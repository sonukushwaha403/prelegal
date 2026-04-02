import { render, screen } from '@testing-library/react'
import DocPreview from '@/components/DocPreview'

const sampleTemplate = `# Test Agreement

1. <span class="header_2" id="1">Service</span>
    1. <span class="header_3" id="1.1">Access.</span> During the period, <span class="coverpage_link">Customer</span> may access the service provided by <span class="coverpage_link">Provider</span>.

2. <span class="header_2" id="2">Terms</span>
    1. The <span class="keyterms_link">Effective Date</span> marks the start. Governed by <span class="orderform_link">Governing Law</span>.`

describe('DocPreview', () => {
  it('renders empty field placeholders in blue', () => {
    render(<DocPreview templateContent={sampleTemplate} fields={{}} docName="Test" />)
    expect(screen.getByText('[Customer]')).toBeInTheDocument()
    expect(screen.getByText('[Provider]')).toBeInTheDocument()
    expect(screen.getByText('[Effective Date]')).toBeInTheDocument()
    expect(screen.getByText('[Governing Law]')).toBeInTheDocument()
  })

  it('renders filled field values as bold text', () => {
    render(
      <DocPreview
        templateContent={sampleTemplate}
        fields={{ Customer: 'Acme Corp', Provider: 'Globex Inc' }}
        docName="Test"
      />
    )
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex Inc')).toBeInTheDocument()
    // Unfilled fields still show placeholders
    expect(screen.getByText('[Effective Date]')).toBeInTheDocument()
  })

  it('renders the document title', () => {
    render(<DocPreview templateContent={sampleTemplate} fields={{}} docName="Test" />)
    expect(screen.getByText('Test Agreement')).toBeInTheDocument()
  })
})
