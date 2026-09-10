import type { DemoDocument, SectionRow } from "../types";

export const tableDefinitions = [
  ["documents", "Documents"],
  ["record_headers", "Record Headers"],
  ["runs", "Runs"],
  ["sections", "Sections"],
  ["material_rows", "Material Rows"],
  ["measurements", "Measurements"],
  ["signoffs", "Signoffs"],
  ["production_outputs", "Production Outputs"],
] as const;

export type TableKey = (typeof tableDefinitions)[number][0];
export type TableRow = Record<string, string | number>;

function cleanRow(row: object): TableRow {
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined)
  ) as TableRow;
}

export function getTableRows(
  document: DemoDocument,
  table: TableKey,
  fileName: string
): TableRow[] {
  switch (table) {
    case "documents":
      return [{
        document_id: document.id,
        filename: fileName,
        document_type: document.docType,
        page_count: document.overview.pages,
      }];
    case "record_headers":
      return document.records.map(cleanRow);
    case "runs":
      return document.records.map((record, index) => ({
        run_id: `RUN-${String(index + 1).padStart(3, "0")}`,
        document_id: document.id,
        batch_description: record.description,
        production_date: record.production_date,
        status: "Ready",
      }));
    case "sections":
      return document.sections.map(cleanRow);
    case "material_rows":
      return document.materialRows.map(cleanRow);
    case "measurements":
      return document.sections.flatMap((section) => [
        {
          measurement_id: `${section.section_instance_id}-PH`,
          batch_id: section.batch_id,
          measurement: "pH",
          value: section.final_actual_ph,
          source_pages: section.source_pages,
        },
        {
          measurement_id: `${section.section_instance_id}-VISC`,
          batch_id: section.batch_id,
          measurement: "Viscosity",
          value: section.final_actual_viscosity,
          unit: "cps",
          source_pages: section.source_pages,
        },
      ]);
    case "signoffs":
      return document.docType === "EBR"
        ? document.sections.flatMap((section, sectionIndex) =>
            ["Process operator", "Process reviewer"].map((role, roleIndex) => ({
              signoff_id: `SIGN-${sectionIndex * 2 + roleIndex + 1}`,
              batch_id: section.batch_id,
              role,
              status: "Recorded",
            }))
          )
        : [];
    case "production_outputs":
      return document.docType === "EBR"
        ? [{
            output_id: "OUTPUT-001",
            document_id: document.id,
            output: "Structured extraction package",
            status: "Ready",
          }]
        : [];
  }
}

export interface MeasurementSeries {
  label: string;
  unit: string;
  values: number[];
  finalValue: number;
}

export function getMeasurementSeries(section: SectionRow): MeasurementSeries[] {
  const middlePh = Number(
    ((section.target_ph + section.final_actual_ph) / 2).toFixed(2)
  );

  return [
    {
      label: "pH",
      unit: "",
      values: [
        Number((section.target_ph - 0.08).toFixed(2)),
        middlePh,
        section.final_actual_ph,
      ],
      finalValue: section.final_actual_ph,
    },
    {
      label: "Viscosity",
      unit: "cps",
      values: [section.final_actual_viscosity],
      finalValue: section.final_actual_viscosity,
    },
  ];
}

export interface ComparisonRow {
  batchId: string;
  section: string;
  date: string;
  batchSize: number;
  materials: number;
  ph: number | null;
  viscosity: number | null;
}

function offsetDate(dateValue: string | undefined, days: number): string {
  const date = new Date(`${dateValue ?? "2026-03-24"}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function getComparisonRows(document: DemoDocument): ComparisonRow[] {
  if (!document.sections.length) return [];

  const productionDate = document.records[0]?.production_date;
  const prefix = document.docType === "WS" ? "DEMO-WS-BATCH" : "DEMO-BATCH";

  return Array.from({ length: 10 }, (_, index) => {
    const section = document.sections[index % document.sections.length]!;
    const isSourceBatch = index < document.sections.length;
    const scale = 1 + ((index % 5) - 2) * 0.012;
    const materialCount = document.materialRows.filter(
      (row) => row.section_instance_id === section.section_instance_id
    ).length;

    return {
      batchId: isSourceBatch
        ? section.batch_id
        : `${prefix}-${String(index + 1).padStart(3, "0")}`,
      section: section.formula_descriptor,
      date: offsetDate(productionDate, index * 3),
      batchSize: Math.round(section.target_weight_g * scale),
      materials: Math.max(1, materialCount + (index % 3) - 1),
      ph:
        index % 5 === 4
          ? null
          : Number((section.final_actual_ph + ((index % 3) - 1) * 0.04).toFixed(2)),
      viscosity:
        index % 4 === 3
          ? null
          : Math.round(section.final_actual_viscosity * scale),
    };
  });
}
