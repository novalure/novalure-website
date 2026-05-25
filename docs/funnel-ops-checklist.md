# NovaLure Funnel Ops Checklist

This file documents the HubSpot, tracking and workflow tasks that cannot be fully confirmed from the repository alone.

## HubSpot fields to create or verify

- `requested_playbook`
- `segment`
- `lead_source`
- `project_market_area`
- `lead_problem`
- `current_crm`
- `monthly_lead_volume`
- `sales_bottleneck`
- `available_assets`
- `desired_start_timing`
- `budget_readiness`
- `decision_status`
- `why_now`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

## HubSpot form mapping

Playbook form currently submits:

- email
- firstname
- company
- phone
- requested_playbook
- segment
- UTM fields

Pipeline audit form currently sends the complete qualification payload by email through Resend. Manual HubSpot mapping is still required unless a dedicated audit HubSpot form ID or private app endpoint is added.

## Playbook follow-up sequence

Tag 0
Subject: Ihr NovaLure Playbook / Your NovaLure Playbook
Text: Hier ist der Leitfaden. Lesen Sie zuerst die Seiten zu CRM-Handover und Intent-Filter. Genau dort verlieren viele Immobilien-Funnels ihre wirtschaftliche Wirkung.
CTA: Playbook öffnen

Tag 1
Subject: Wo verliert Ihre Pipeline zuerst Qualität? / Where does your pipeline first lose quality?
Text: Eine harte Frage: Kommen Ihre Leads mit Verkaufs- oder Kaufkontext im CRM an - oder nur als Name, E-Mail und Telefonnummer?
CTA: Pipeline-Audit prüfen

Tag 3
Subject: Beispiel: ein CRM-fähiger Immobilienlead / Example: a CRM-ready real estate lead
Text: Ein CRM-fähiger Lead enthält Quelle, Interesse, Timing, Budgetnähe, Objekt-/Projektbezug und nächsten Schritt. Ohne diese Daten filtert Ihr Vertrieb manuell.
CTA: Beispiel-Handover ansehen

Tag 5
Subject: Der häufigste Fehler: Leads ohne Vertriebslogik / The common mistake: leads without sales logic
Text: Viele Teams optimieren Kampagnen, bevor klar ist, was Sales wirklich braucht. Dann entsteht Volumen, aber keine nutzbare Pipeline.
CTA: 3-Leak-Check machen

Tag 7
Subject: Sollten wir Ihr Lead-System prüfen? / Should we review your lead system?
Text: Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, prüfen wir in 30 Minuten, ob ein Build+Run sinnvoll ist.
CTA: Pipeline-Audit buchen

Tag 10
Subject: Wir haben schon Marketing reicht nicht / We already have marketing is not enough
Text: Marketing ist nicht das Problem. Die Frage ist, ob Ihre Leads qualifiziert, priorisiert und CRM-fähig übergeben werden.
CTA: Handover-Beispiel ansehen

Tag 14
Subject: Letzter klarer Schritt / Last clear step
Text: Wenn Ihr Vertrieb aktuell Leads sortiert statt Chancen zu bearbeiten, ist jetzt der richtige Zeitpunkt für eine Diagnose. Wenn kein konkretes Problem existiert, ist kein Audit nötig.
CTA: Audit anfragen

## Tracking events implemented in code

- `page_view`, consent-gated
- `cta_click`, consent-gated, reads `data-track`
- `proof_section_view`, consent-gated, reads `data-track-section="proof"`
- `playbook_submit`, consent-gated through custom event
- `audit_submit`, consent-gated through custom event

## Tracking tasks still requiring external configuration

- Verify GA4 receives all events in DebugView.
- Configure conversions for `playbook_submit` and `audit_submit`.
- Configure retargeting audiences for playbook visitors, audit visitors and proof-section viewers.
- Confirm GTM, Meta Pixel, LinkedIn Insight Tag and HubSpot tracking IDs before activation.
- Confirm cookie categories and vendor list with legal review.

## Internal notifications and CRM tasks

- Resend email notification to `hello@novalure.eu` is implemented for audit requests.
- Follow-up CRM task creation is not confirmed because no HubSpot private app token or task endpoint is configured.
- No-show reminder workflow is not confirmed because calendar workflow configuration is outside this repository.

## Manual QA before launch

- Submit developer playbook form with HubSpot form IDs configured.
- Submit agent playbook form with HubSpot form IDs configured.
- Submit audit form with a qualified request.
- Submit audit form with `Budget: Nein / No` or `Ich recherchiere nur / only researching` and verify soft-fit path.
- Verify Danke/thank-you pages are noindexed.
- Verify old routes redirect or return 410.
