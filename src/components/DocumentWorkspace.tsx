import { useState } from "react";
import type { DemoDocument, MaterialRow } from "../types";
import PipelineDiagram from "./PipelineDiagram";
import TableExplorer from "./TableExplorer";
import ProvenancePanel from "./ProvenancePanel";

export default function DocumentWorkspace({
  document,
  fileName,
  onBack,
}: {
  document: DemoDocument;
  fileName?: string;
  onBack: () => void;
}) {
  const [selectedRow, setSelectedRow] = useState<MaterialRow | null>(null);
  const o = document.overview;

  const metrics: Array<[string, string]> = [
    ["Document Type", o.documentType],
    ["Processing Method", o.processingMethod],
    ["Pages", String(o.pages)],
    ["Records", String(o.records)],
    ["Sections", String(o.sections)],
    ["Material Rows", String(o.materialRows)],
    ["Validation Status", o.validationStatus],
  ];

  const isScanned = document.docType === "WS";

  return (
    <section className="report">
      <div className="report__top">
        <button type="button" className="back-link" onClick={onBack}>
          ← All documents
        </button>
        <span className="disclaimer-note">{document.disclaimer}</span>
      </div>

      <div className="report__headline">
        <h1 className="report__title">{document.title}</h1>
        <span className={`badge ${isScanned ? "badge--warn" : ""}`}>
          {document.overview.documentType}
        </span>
      </div>
      <p className="report__subtitle">
        {fileName ? `${fileName} · ` : ""}
        {document.records[0]?.description}
      </p>

      <div className="overview-grid">
        {metrics.map(([label, value]) => (
          <div className="metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="block">
        <h2 className="block__title">Pipeline</h2>
        <PipelineDiagram stages={document.pipeline} />
      </div>

      <div className="block">
        <h2 className="block__title">Structured Tables</h2>
        <TableExplorer
          document={document}
          onSelectRow={setSelectedRow}
          selectedRowId={selectedRow?.material_line_id ?? null}
        />
      </div>

      {selectedRow && (
        <ProvenancePanel row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </section>
  );
}
