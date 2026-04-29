import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    defaultSeo,
    navigation,
    footer
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation" && locale == $locale][0]{
    items[]{label, href, type}
  }
`;

export const localizedPageQuery = groq`
  *[_type == "page" && locale == $locale && slug.current == $slug][0]{
    title,
    seoTitle,
    description,
    template,
    hero,
    sections[],
    primaryCta,
    secondaryCta
  }
`;

export const playbooksQuery = groq`
  *[_type == "playbook" && locale == $locale] | order(orderRank asc, _createdAt desc) {
    title,
    slug,
    summary,
    formId,
    fileAsset
  }
`;

export const hubSpotConfigQuery = groq`
  *[_type == "hubSpotConfig"][0]{
    portalId,
    region,
    developerPlaybookFormId,
    agentPlaybookFormId,
    meetingUrl,
    trackingCodeId
  }
`;

export const faqItemsQuery = groq`
  *[_type == "faqItem" && locale == $locale] | order(orderRank asc, _createdAt asc) {
    question,
    answer,
    category
  }
`;

export const teamMembersQuery = groq`
  *[_type == "teamMember" && locale == $locale] | order(orderRank asc, name asc) {
    name,
    role,
    bio,
    image
  }
`;

export const legalPageQuery = groq`
  *[_type == "legalPage" && locale == $locale && key == $key][0]{
    title,
    effectiveDate,
    body
  }
`;
