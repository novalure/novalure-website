import { defineField, defineType } from "sanity";

export const hubSpotConfig = defineType({
  name: "hubSpotConfig",
  title: "HubSpot Configuration",
  type: "document",
  fields: [
    defineField({ name: "portalId", title: "Portal ID", type: "string" }),
    defineField({ name: "region", title: "Region", type: "string", description: "Example: eu1 or na1" }),
    defineField({ name: "developerPlaybookFormId", title: "Developer Playbook Form ID", type: "string" }),
    defineField({ name: "agentPlaybookFormId", title: "Agent Playbook Form ID", type: "string" }),
    defineField({ name: "meetingUrl", title: "Meeting Scheduler URL", type: "url" }),
    defineField({ name: "trackingCodeId", title: "HubSpot Tracking Code ID", type: "string" })
  ]
});
