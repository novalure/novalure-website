import { legalPage } from "@/sanity/schemas/legalPage";
import { ctaBlock } from "@/sanity/schemas/ctaBlock";
import { faqItem } from "@/sanity/schemas/faqItem";
import { footer } from "@/sanity/schemas/footer";
import { heroSection } from "@/sanity/schemas/heroSection";
import { hubSpotConfig } from "@/sanity/schemas/hubSpotConfig";
import { navigation } from "@/sanity/schemas/navigation";
import { page } from "@/sanity/schemas/page";
import { playbook } from "@/sanity/schemas/playbook";
import { processStep } from "@/sanity/schemas/processStep";
import { seoMetadata } from "@/sanity/schemas/seoMetadata";
import { siteSettings } from "@/sanity/schemas/siteSettings";
import { teamBlock } from "@/sanity/schemas/teamBlock";
import { teamMember } from "@/sanity/schemas/teamMember";

export const schemaTypes = [
  siteSettings,
  navigation,
  page,
  heroSection,
  ctaBlock,
  playbook,
  hubSpotConfig,
  processStep,
  teamBlock,
  faqItem,
  seoMetadata,
  footer,
  teamMember,
  legalPage
];
