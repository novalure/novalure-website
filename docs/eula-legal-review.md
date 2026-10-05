# LEGAL_REVIEW_SUMMARY

Status: `OWNER_LEGAL_REVIEW_REQUIRED`

This review gate applies before publishing the EULA to production. The implementation is suitable for an engineering Preview, but it is not legal advice and has not been approved by Irish counsel.

## Verified source material

- Legal entity: NovaLure CLG, described by the existing Imprint as a company limited by guarantee incorporated under Irish law.
- Registration: Companies Registration Office (Ireland), company number 796735.
- Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland.
- Contact: hello@novalure.eu and the contact details already published in the Imprint.
- Existing governing-law statement: the English Imprint states that Irish law applies to the extent legally permitted and preserves mandatory rights.
- Canonical repository pages: `/en/legal/imprint`, `/en/legal/privacy`, `/en/legal/cookies`.

No company fact, SLA, price, warranty, certification, insurance term or monetary liability cap was added from an unverified source.

## Material clauses requiring Owner/legal approval

1. **User obligations and restrictions (sections 5-9 and 14):** authorised-use, security, credential, automated-access and integration-scope duties.
2. **Suspension and termination (section 18):** rights to suspend or terminate for breach, unlawful use, security risk, non-payment, service harm or legal requirements, with a reasonable notice/remedy qualifier.
3. **Warranty disclaimer (section 19):** services are provided on an “as available” basis except where a separate written agreement or mandatory law provides otherwise.
4. **Limitation of liability (section 20):** limited exclusion of indirect/consequential and specified economic losses, an explicit statement that this EULA creates no monetary cap, and broad savings clauses for non-excludable liability and statutory rights.
5. **Business indemnity (section 21):** narrow third-party-claim indemnity for unlawful use, infringing user material or deliberate security/access breaches; excludes NovaLure-caused matters and mandatory consumer rights.
6. **Governing law and jurisdiction (section 24):** Republic of Ireland law; venue is left to applicable law or a separate agreement so the EULA does not invent a court location.
7. **Order of precedence (section 26):** separately signed agreements, orders, proposals and data-processing agreements control where they conflict with the public EULA for the relevant service.

## Publication gate

- Preview deployment and technical verification are authorised.
- Production publication at `https://www.novalure.eu/en/eula` requires explicit Owner approval after review of the clauses above.
- After approval, promote the verified exact-SHA Preview or merge the approved Draft PR through the repository's normal production workflow, then verify public HTTP 200, HTTPS, canonical metadata and the footer link.
