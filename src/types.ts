export type ValidationStatus = "passed" | "warning" | "flagged";

export interface DocumentSelection {
  fileName: string;
  fileSize: number | null;
  sampleId?: string;
  file?: File;
}

export interface RecordRow {
  record_instance_id: string;
  record_ordinal: number;
  document_code: string;
  description: string;
  production_date: string;
  manufacturing_site: string;
  batch_size_g: number;
  source_page_start: number;
  source_page_end: number;
}

export interface SectionRow {
  record_instance_id: string;
  section_instance_id: string;
  section_ordinal: number;
  batch_id: string;
  formula_descriptor: string;
  variant: string;
  target_weight_g: number;
  target_ph: number;
  target_viscosity: number;
  final_actual_ph: number;
  final_actual_viscosity: number;
  source_pages: string;
}

export interface MaterialRow {
  record_instance_id: string;
  section_instance_id: string;
  material_line_id: string;
  row_ordinal: number;
  raw_material_name: string;
  material_reference: string;
  nominal_w_w_pct: number;
  target_weight_g: number;
  actual_weight_g: number;
  source_page: number;
  raw_value: string;
  normalized_value: string;
  validation_status: ValidationStatus;
  review_reason?: string;
}

export interface QualityCheck {
  name: string;
  result: string;
  status: ValidationStatus;
  detail: string;
}

export interface PipelineStage {
  label: string;
  detail: string;
}

export interface OverviewMetrics {
  documentType: string;
  processingMethod: string;
  pages: number;
  records: number;
  sections: number;
  materialRows: number;
  validationStatus: string;
}

export interface DemoDocument {
  id: string;
  title: string;
  docType: string;
  cardSubtitle: string;
  tag: string;
  disclaimer: string;
  overview: OverviewMetrics;
  pipeline: PipelineStage[];
  records: RecordRow[];
  sections: SectionRow[];
  materialRows: MaterialRow[];
  qualityChecks: QualityCheck[];
}
