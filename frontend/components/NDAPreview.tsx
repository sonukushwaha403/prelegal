'use client'

import { FormValues } from '@/app/page'

interface Props {
  values: FormValues
}

/** Shows the value if set, otherwise an italic blue placeholder */
function V({ value, label }: { value: string; label: string }) {
  const trimmed = value?.trim()
  if (trimmed) {
    return <span className="font-semibold text-gray-900">{trimmed}</span>
  }
  return <span className="text-blue-500 italic font-normal">[{label}]</span>
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NDAPreview({ values }: Props) {
  const formattedDate = formatDate(values.effectiveDate)

  const mndaTerm =
    values.mndaTermType === 'expires'
      ? `${values.mndaTermYears || '1'} year(s) from Effective Date`
      : 'continues until terminated in accordance with the terms of the MNDA'

  const confidentialityTerm =
    values.confidentialityType === 'perpetuity'
      ? 'in perpetuity'
      : `${values.confidentialityYears || '1'} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`

  return (
    <div className="bg-white shadow-md max-w-3xl mx-auto print:shadow-none print:max-w-none print:mx-0">
      <div className="px-14 py-10 font-serif text-[13.5px] leading-relaxed text-gray-900 print:px-0 print:py-0">

        {/* ── TITLE ── */}
        <h1 className="text-center text-xl font-bold uppercase mb-8 tracking-wide font-sans">
          Mutual Non-Disclosure Agreement
        </h1>

        {/* ── USING THIS AGREEMENT ── */}
        <div className="mb-6">
          <h2 className="text-[12.5px] font-bold font-sans mb-2">
            USING THIS MUTUAL NON-DISCLOSURE AGREEMENT
          </h2>
          <p className="text-[12.5px]">
            This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
            (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms
            Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{' '}
            commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be made on
            the Cover Page, which will control over conflicts with the Standard Terms.
          </p>
        </div>

        {/* ── COVER PAGE FIELDS ── */}
        <div className="space-y-4 mb-6">

          {/* Purpose */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">Purpose</h3>
            <p className="text-[11px] text-gray-500 italic mb-0.5">
              How Confidential Information may be used
            </p>
            <p><V value={values.purpose} label="Purpose" /></p>
          </div>

          {/* Effective Date */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">Effective Date</h3>
            <p><V value={formattedDate} label="Effective Date" /></p>
          </div>

          {/* MNDA Term */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">MNDA Term</h3>
            <p className="text-[11px] text-gray-500 italic mb-0.5">The length of this MNDA</p>
            <p>
              {values.mndaTermType === 'expires' ? '☑' : '☐'}&nbsp;&nbsp;Expires{' '}
              <V value={values.mndaTermYears} label="X" /> year(s) from Effective Date.
            </p>
            <p>
              {values.mndaTermType === 'continues' ? '☑' : '☐'}&nbsp;&nbsp;Continues until terminated in
              accordance with the terms of the MNDA.
            </p>
          </div>

          {/* Term of Confidentiality */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">Term of Confidentiality</h3>
            <p className="text-[11px] text-gray-500 italic mb-0.5">
              How long Confidential Information is protected
            </p>
            <p>
              {values.confidentialityType === 'years' ? '☑' : '☐'}&nbsp;&nbsp;
              <V value={values.confidentialityYears} label="X" /> year(s) from Effective Date, but in the case
              of trade secrets until Confidential Information is no longer considered a trade secret under
              applicable laws.
            </p>
            <p>
              {values.confidentialityType === 'perpetuity' ? '☑' : '☐'}&nbsp;&nbsp;In perpetuity.
            </p>
          </div>

          {/* Governing Law & Jurisdiction */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">Governing Law &amp; Jurisdiction</h3>
            <p>
              Governing Law: <V value={values.governingLaw} label="State" />
            </p>
            <p>
              Jurisdiction: <V value={values.jurisdiction} label="City/county and state" />
            </p>
          </div>

          {/* Modifications */}
          <div>
            <h3 className="font-bold font-sans text-[13px]">MNDA Modifications</h3>
            <p>
              {values.modifications.trim() ? (
                <span>{values.modifications}</span>
              ) : (
                <span className="text-gray-400 italic text-[12px]">None</span>
              )}
            </p>
          </div>
        </div>

        {/* ── SIGNING LINE ── */}
        <p className="mb-4 text-[12.5px]">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>

        {/* ── SIGNATURE TABLE ── */}
        <table className="w-full border-collapse mb-4 text-[12px]">
          <thead>
            <tr>
              <th className="border border-gray-400 px-3 py-2 text-left font-normal w-[23%] bg-gray-50" />
              <th className="border border-gray-400 px-3 py-2 text-center font-semibold bg-gray-50">
                PARTY 1
              </th>
              <th className="border border-gray-400 px-3 py-2 text-center font-semibold bg-gray-50">
                PARTY 2
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">Signature</td>
              <td className="border border-gray-400 px-3 py-10" />
              <td className="border border-gray-400 px-3 py-10" />
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">Print Name</td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party1Name} label="Name" />
              </td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party2Name} label="Name" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">Title</td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party1Title} label="Title" />
              </td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party2Title} label="Title" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">Company</td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party1Company} label="Company" />
              </td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party2Company} label="Company" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">
                Notice Address
                <p className="text-[10px] font-normal text-gray-500 italic">
                  Use either email or postal address
                </p>
              </td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party1Address} label="Address" />
              </td>
              <td className="border border-gray-400 px-3 py-2">
                <V value={values.party2Address} label="Address" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2 font-semibold">Date</td>
              <td className="border border-gray-400 px-3 py-6" />
              <td className="border border-gray-400 px-3 py-6" />
            </tr>
          </tbody>
        </table>

        <p className="text-[11px] text-gray-400 mb-8">
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
        </p>

        {/* ── PAGE BREAK ── */}
        <div className="border-t-2 border-gray-300 my-10 print:break-before-page" />

        {/* ── STANDARD TERMS ── */}
        <h2 className="text-center text-base font-bold font-sans uppercase mb-6 tracking-wide">
          Standard Terms
        </h2>

        <div className="space-y-4 text-[13px]">

          {/* 1. Introduction */}
          <p>
            <strong>1. Introduction.</strong>{' '}
            This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page
            (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party (&ldquo;
            <strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in connection
            with the <V value={values.purpose} label="Purpose" /> which (1) the Disclosing Party identifies to
            the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
            &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or
            proprietary due to its nature and the circumstances of its disclosure (&ldquo;
            <strong>Confidential Information</strong>&rdquo;). Each party&apos;s Confidential Information also
            includes the existence and status of the parties&apos; discussions and information on the Cover
            Page. Confidential Information includes technical or business information, product designs or
            roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and
            know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these
            Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover
            Page and capitalized terms have the meanings given herein or on the Cover Page.
          </p>

          {/* 2. Use and Protection */}
          <p>
            <strong>2. Use and Protection of Confidential Information.</strong>{' '}
            The Receiving Party shall: (a) use Confidential Information solely for the{' '}
            <V value={values.purpose} label="Purpose" />; (b) not disclose Confidential Information to third
            parties without the Disclosing Party&apos;s prior written approval, except that the Receiving Party
            may disclose Confidential Information to its employees, agents, advisors, contractors and other
            representatives having a reasonable need to know for the{' '}
            <V value={values.purpose} label="Purpose" />, provided these representatives are bound by
            confidentiality obligations no less protective of the Disclosing Party than the applicable terms in
            this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c)
            protect Confidential Information using at least the same protections the Receiving Party uses for
            its own similar information but no less than a reasonable standard of care.
          </p>

          {/* 3. Exceptions */}
          <p>
            <strong>3. Exceptions.</strong>{' '}
            The Receiving Party&apos;s obligations in this MNDA do not apply to information that it can
            demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it
            rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality
            restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions;
            or (d) it independently developed without using or referencing the Confidential Information.
          </p>

          {/* 4. Disclosures Required by Law */}
          <p>
            <strong>4. Disclosures Required by Law.</strong>{' '}
            The Receiving Party may disclose Confidential Information to the extent required by law, regulation
            or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it
            provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably
            cooperates, at the Disclosing Party&apos;s expense, with the Disclosing Party&apos;s efforts to
            obtain confidential treatment for the Confidential Information.
          </p>

          {/* 5. Term and Termination */}
          <p>
            <strong>5. Term and Termination.</strong>{' '}
            This MNDA commences on the <V value={formattedDate} label="Effective Date" /> and expires at the
            end of the <strong>{mndaTerm}</strong>. Either party may terminate this MNDA for any or no reason
            upon written notice to the other party. The Receiving Party&apos;s obligations relating to
            Confidential Information will survive for the <strong>{confidentialityTerm}</strong>, despite any
            expiration or termination of this MNDA.
          </p>

          {/* 6. Return or Destruction */}
          <p>
            <strong>6. Return or Destruction of Confidential Information.</strong>{' '}
            Upon expiration or termination of this MNDA or upon the Disclosing Party&apos;s earlier request,
            the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the
            Disclosing Party&apos;s written request, destroy all Confidential Information in the Receiving
            Party&apos;s possession or control or return it to the Disclosing Party; and (c) if requested by
            the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to
            subsection (b), the Receiving Party may retain Confidential Information in accordance with its
            standard backup or record retention policies or as required by law, but the terms of this MNDA will
            continue to apply to the retained Confidential Information.
          </p>

          {/* 7. Proprietary Rights */}
          <p>
            <strong>7. Proprietary Rights.</strong>{' '}
            The Disclosing Party retains all of its intellectual property and other rights in its Confidential
            Information and its disclosure to the Receiving Party grants no license under such rights.
          </p>

          {/* 8. Disclaimer */}
          <p>
            <strong>8. Disclaimer.</strong>{' '}
            ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT
            WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR
            PURPOSE.
          </p>

          {/* 9. Governing Law and Jurisdiction */}
          <p>
            <strong>9. Governing Law and Jurisdiction.</strong>{' '}
            This MNDA and all matters relating hereto are governed by, and construed in accordance with, the
            laws of the State of <V value={values.governingLaw} label="Governing Law" />, without regard to
            the conflict of laws provisions of such{' '}
            <V value={values.governingLaw} label="Governing Law" />. Any legal suit, action, or proceeding
            relating to this MNDA must be instituted in the federal or state courts located in{' '}
            <V value={values.jurisdiction} label="Jurisdiction" />. Each party irrevocably submits to the
            exclusive jurisdiction of such <V value={values.jurisdiction} label="Jurisdiction" /> in any such
            suit, action, or proceeding.
          </p>

          {/* 10. Equitable Relief */}
          <p>
            <strong>10. Equitable Relief.</strong>{' '}
            A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient
            remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable
            relief, including an injunction, in addition to its other remedies.
          </p>

          {/* 11. General */}
          <p>
            <strong>11. General.</strong>{' '}
            Neither party has an obligation under this MNDA to disclose Confidential Information to the other
            or proceed with any proposed transaction. Neither party may assign this MNDA without the prior
            written consent of the other party, except that either party may assign this MNDA in connection
            with a merger, reorganization, acquisition or other transfer of all or substantially all its assets
            or voting securities. Any assignment in violation of this Section is null and void. This MNDA will
            bind and inure to the benefit of each party&apos;s permitted successors and assigns. Waivers must
            be signed by the waiving party&apos;s authorized representative and cannot be implied from conduct.
            If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent
            necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page)
            constitutes the entire agreement of the parties with respect to its subject matter, and supersedes
            all prior and contemporaneous understandings, agreements, representations, and warranties, whether
            written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or
            supplemented by an agreement in writing signed by both parties. Notices, requests and approvals
            under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are
            deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic
            copies, each of which is deemed an original and which together form the same agreement.
          </p>
        </div>

        <p className="text-[11px] text-gray-400 mt-8">
          Common Paper Mutual Non-Disclosure Agreement Version 1.0 free to use under CC BY 4.0.
        </p>
      </div>
    </div>
  )
}
