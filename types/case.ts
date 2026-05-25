export type CaseMetricSet = {
  leadsPerMonth: number;
  qualifiedShare: number;
  [metric: string]: number;
};

export type Case = {
  id: string;
  anonymized: boolean;
  industry: "bautraeger" | "makler";
  region: string;
  units?: number;
  beforeMetrics: CaseMetricSet;
  afterMetrics: CaseMetricSet;
  diagnosis: string;
  measures: string[];
  resultSummary: string;
  logoUrl?: string;
  clientName?: string;
  releaseConfirmed: boolean;
};
