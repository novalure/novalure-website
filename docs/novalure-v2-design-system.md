# NovaLure V2 design system

## Concept

NovaLure V2 presents the company as one connected real-estate sales, media and technology operation. The experience uses editorial scale, hard tonal transitions and large project media to move from attention to qualified sales conversation. SERHANT. informed the confidence, page rhythm and media scale only; NovaLure's structure, language, palette and interface are original.

## Foundation

- Deep Blue `#001A72`
- Light Blue `#599AD7`
- Paper `#F8F8F8`
- White `#FFFFFF`
- Black `#000000`
- Graphite `#141414`
- Maximum content width: 1600px
- Responsive gutter: 20–72px
- Section rhythm: 96–210px

The existing framework-hosted grotesk remains self-hosted through `next/font`. Display type uses tight tracking and line heights around 0.82–0.92 for large statements. Body copy stays restrained and readable.

## Layout and content architecture

The homepage sequence is: cinematic static hero, verified proof, selected work, six disciplines, Studios/Demand/Systems, interactive pipeline demonstration, Evelyn technology preview, GRASL reference, text-only founder statement, Playbook and Project Check. The static hero is deliberate: no new video is shipped without a documented usage basis.

Supporting routes cover Solutions, Work, System, Evelyn and Insights in all three language namespaces. Existing Developers, Agents, Playbooks, Project Check and legal routes remain available.

## Motion

Motion is limited to opacity/transform reveals, media scale on hover and a subtle abstract Evelyn signal. Reduced-motion disables animation and shortens transitions. There is no scroll hijacking, WebGL, particle system or decorative 3D runtime.

## Components

- Fixed global header and accessible full-screen menu
- Localized language navigation
- V2 hero, proof stats and selected-work sequence
- Six discipline rows
- Product-world panels
- Demo-only pipeline interface
- Abstract Evelyn system identity
- Text-only founder block
- Existing validated Playbook and Project Check forms
- Consent-gated HubSpot meeting embed
- Editorial footer and legal navigation

## Responsive and accessibility rules

Large layouts use split grids; below 900px they become purposeful single-column compositions. Mobile hero content remains inside `100svh`, actions are available above the fold, and headings use fluid clamps. Focus states, semantic headings, native links/buttons, dialog focus trapping, Escape handling and consent semantics remain in place. The interface is designed to remain complete with motion disabled.

## Truth and media rules

Only the existing GRASL values (15–20 qualified enquiries/month and EUR 110k+ commission volume) are presented as quantified proof. CRM data is demonstrative and labelled as such. Evelyn is labelled as an internal operating-system technology preview. No self-service CRM access, future technology availability, guarantee, invented project, testimonial or award is claimed.
