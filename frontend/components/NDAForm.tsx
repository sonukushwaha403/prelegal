'use client'

import { FormValues } from '@/app/page'

interface Props {
  values: FormValues
  onChange: (field: keyof FormValues, value: string) => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 py-4 px-5">
      <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

const textareaCls =
  'w-full px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'

const smallNumCls =
  'w-14 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-300'

export default function NDAForm({ values, onChange }: Props) {
  return (
    <div className="text-sm">
      {/* Party 1 */}
      <Section title="Party 1">
        <Field label="Company Name">
          <input
            className={inputCls}
            type="text"
            value={values.party1Company}
            onChange={e => onChange('party1Company', e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>
        <Field label="Signatory Name">
          <input
            className={inputCls}
            type="text"
            value={values.party1Name}
            onChange={e => onChange('party1Name', e.target.value)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Title">
          <input
            className={inputCls}
            type="text"
            value={values.party1Title}
            onChange={e => onChange('party1Title', e.target.value)}
            placeholder="CEO"
          />
        </Field>
        <Field label="Notice Address" hint="email or postal">
          <input
            className={inputCls}
            type="text"
            value={values.party1Address}
            onChange={e => onChange('party1Address', e.target.value)}
            placeholder="jane@acme.com"
          />
        </Field>
      </Section>

      {/* Party 2 */}
      <Section title="Party 2">
        <Field label="Company Name">
          <input
            className={inputCls}
            type="text"
            value={values.party2Company}
            onChange={e => onChange('party2Company', e.target.value)}
            placeholder="Globex Inc."
          />
        </Field>
        <Field label="Signatory Name">
          <input
            className={inputCls}
            type="text"
            value={values.party2Name}
            onChange={e => onChange('party2Name', e.target.value)}
            placeholder="John Doe"
          />
        </Field>
        <Field label="Title">
          <input
            className={inputCls}
            type="text"
            value={values.party2Title}
            onChange={e => onChange('party2Title', e.target.value)}
            placeholder="CEO"
          />
        </Field>
        <Field label="Notice Address" hint="email or postal">
          <input
            className={inputCls}
            type="text"
            value={values.party2Address}
            onChange={e => onChange('party2Address', e.target.value)}
            placeholder="john@globex.com"
          />
        </Field>
      </Section>

      {/* Agreement Terms */}
      <Section title="Agreement Terms">
        <Field label="Purpose" hint="how confidential info may be used">
          <textarea
            className={textareaCls}
            rows={3}
            value={values.purpose}
            onChange={e => onChange('purpose', e.target.value)}
            placeholder="Evaluating whether to enter into a business relationship..."
          />
        </Field>

        <Field label="Effective Date">
          <input
            className={inputCls}
            type="date"
            value={values.effectiveDate}
            onChange={e => onChange('effectiveDate', e.target.value)}
          />
        </Field>

        <Field label="MNDA Term" hint="length of agreement">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                value="expires"
                checked={values.mndaTermType === 'expires'}
                onChange={() => onChange('mndaTermType', 'expires')}
                className="text-blue-600"
              />
              <span className="text-gray-700 text-xs">Expires after</span>
              <input
                className={smallNumCls}
                type="number"
                min="1"
                value={values.mndaTermYears}
                onChange={e => onChange('mndaTermYears', e.target.value)}
                disabled={values.mndaTermType !== 'expires'}
              />
              <span className="text-gray-700 text-xs">year(s)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                value="continues"
                checked={values.mndaTermType === 'continues'}
                onChange={() => onChange('mndaTermType', 'continues')}
                className="text-blue-600"
              />
              <span className="text-gray-700 text-xs">Continues until terminated</span>
            </label>
          </div>
        </Field>

        <Field label="Term of Confidentiality" hint="how long info is protected">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityType"
                value="years"
                checked={values.confidentialityType === 'years'}
                onChange={() => onChange('confidentialityType', 'years')}
                className="text-blue-600"
              />
              <input
                className={smallNumCls}
                type="number"
                min="1"
                value={values.confidentialityYears}
                onChange={e => onChange('confidentialityYears', e.target.value)}
                disabled={values.confidentialityType !== 'years'}
              />
              <span className="text-gray-700 text-xs">year(s) from Effective Date</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityType"
                value="perpetuity"
                checked={values.confidentialityType === 'perpetuity'}
                onChange={() => onChange('confidentialityType', 'perpetuity')}
                className="text-blue-600"
              />
              <span className="text-gray-700 text-xs">In perpetuity</span>
            </label>
          </div>
        </Field>
      </Section>

      {/* Governing Law */}
      <Section title="Governing Law & Jurisdiction">
        <Field label="Governing Law" hint="state">
          <input
            className={inputCls}
            type="text"
            value={values.governingLaw}
            onChange={e => onChange('governingLaw', e.target.value)}
            placeholder="Delaware"
          />
        </Field>
        <Field label="Jurisdiction" hint="city/county and state">
          <input
            className={inputCls}
            type="text"
            value={values.jurisdiction}
            onChange={e => onChange('jurisdiction', e.target.value)}
            placeholder="courts located in New Castle, DE"
          />
        </Field>
      </Section>

      {/* Modifications */}
      <Section title="Modifications">
        <Field label="MNDA Modifications" hint="optional">
          <textarea
            className={textareaCls}
            rows={3}
            value={values.modifications}
            onChange={e => onChange('modifications', e.target.value)}
            placeholder="List any modifications to the standard terms..."
          />
        </Field>
      </Section>
    </div>
  )
}
