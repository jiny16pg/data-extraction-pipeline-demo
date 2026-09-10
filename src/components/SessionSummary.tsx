import type { DemoDocument } from "../types";
import { getTableRows } from "../data/dashboardData";

export default function SessionSummary({ document }: { document: DemoDocument }) {
  const metrics = [
    ["Documents", 1],
    ["Source Pages", document.overview.pages],
    ["Runs", getTableRows(document, "runs", "").length],
    ["Material Rows", document.materialRows.length],
    ["Measurements", getTableRows(document, "measurements", "").length],
  ];

  return (
    <section className="dashboard-section" aria-labelledby="summary-title">
      <h2 id="summary-title">Session Summary</h2>
      <div className="summary-grid">
        {metrics.map(([label, value]) => (
          <div className="summary-card panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
