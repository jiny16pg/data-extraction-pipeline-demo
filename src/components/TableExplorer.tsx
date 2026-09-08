import { useState } from "react";
import type { DemoDocument, MaterialRow } from "../types";
import { formatNumber, statusLabel } from "../format";

type TabKey = "records" | "sections" | "material_rows" | "quality";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "records", label: "Records" },
  { key: "sections", label: "Sections" },
  { key: "material_rows", label: "Material Rows" },
  { key: "quality", label: "Quality Checks" },
];

const RECORD_COLUMNS: Array<[keyof DemoDocument["records"][number], string]> = [
  ["record_instance_id", "Record ID"],
  ["record_ordinal", "Ordinal"],
  ["document_code", "Document Code"],
  ["description", "Description"],
  ["production_date", "Production Date"],
  ["manufacturing_site", "Site"],
  ["batch_size_g", "Batch Size (g)"],
  ["source_page_start", "Page Start"],
  ["source_page_end", "Page End"],
];

const SECTION_COLUMNS: Array<[keyof DemoDocument["sections"][number], string]> = [
  ["section_instance_id", "Section ID"],
  ["record_instance_id", "Record ID"],
  ["section_ordinal", "Ordinal"],
  ["batch_id", "Batch ID"],
  ["formula_descriptor", "Formula Descriptor"],
  ["variant", "Variant"],
  ["target_weight_g", "Target Weight (g)"],
  ["target_ph", "Target pH"],
  ["final_actual_ph", "Actual pH"],
  ["target_viscosity", "Target Viscosity"],
  ["final_actual_viscosity", "Actual Viscosity"],
  ["source_pages", "Source Pages"],
];

const MATERIAL_COLUMNS: Array<[keyof MaterialRow, string]> = [
  ["material_line_id", "Material Line ID"],
  ["section_instance_id", "Section ID"],
  ["row_ordinal", "Row #"],
  ["raw_material_name", "Raw Material"],
  ["material_reference", "Reference"],
  ["nominal_w_w_pct", "Nominal % w/w"],
  ["target_weight_g", "Target (g)"],
  ["actual_weight_g", "Actual (g)"],
  ["source_page", "Page"],
];

function cell(value: unknown): string {
  return typeof value === "number" ? formatNumber(value) : String(value);
}

export default function TableExplorer({
  document,
  onSelectRow,
  selectedRowId,
}: {
  document: DemoDocument;
  onSelectRow: (row: MaterialRow) => void;
  selectedRowId: string | null;
}) {
  const [tab, setTab] = useState<TabKey>("records");

  const counts: Record<TabKey, number> = {
    records: document.records.length,
    sections: document.sections.length,
    material_rows: document.materialRows.length,
    quality: document.qualityChecks.length,
  };

  return (
    <section className="explorer">
      <div className="tabs" role="tablist" aria-label="Table explorer">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`tab ${tab === t.key ? "tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="tab__count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {tab === "records" && (
        <BasicTable columns={RECORD_COLUMNS} rows={document.records} />
      )}
      {tab === "sections" && (
        <BasicTable columns={SECTION_COLUMNS} rows={document.sections} />
      )}
      {tab === "material_rows" && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {MATERIAL_COLUMNS.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {document.materialRows.map((row) => (
                <tr
                  key={row.material_line_id}
                  className={`clickable ${
                    selectedRowId === row.material_line_id ? "row--active" : ""
                  }`}
                  onClick={() => onSelectRow(row)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRow(row);
                    }
                  }}
                >
                  {MATERIAL_COLUMNS.map(([key]) => (
                    <td key={String(key)}>{cell(row[key])}</td>
                  ))}
                  <td>
                    <span className={`chip chip--${row.validation_status}`}>
                      {statusLabel(row.validation_status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-hint">Select a material row to view its provenance.</p>
        </div>
      )}
      {tab === "quality" && (
        <div className="quality-list">
          {document.qualityChecks.map((check) => (
            <div className="quality-item" key={check.name}>
              <div className="quality-item__main">
                <strong>{check.name}</strong>
                <p>{check.detail}</p>
              </div>
              <span className={`chip chip--${check.status}`}>{check.result}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function BasicTable<T>({
  columns,
  rows,
}: {
  columns: Array<[keyof T, string]>;
  rows: T[];
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map(([, label]) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(([key]) => (
                <td key={String(key)}>{cell(row[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
