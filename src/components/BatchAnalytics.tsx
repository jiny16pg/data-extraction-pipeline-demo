import { useState } from "react";
import type { DemoDocument, MaterialRow } from "../types";
import {
  getComparisonRows,
  getMeasurementSeries,
  type MeasurementSeries,
} from "../data/dashboardData";

function formatMeasurement(value: number, unit: string): string {
  return unit === "cps" ? value.toLocaleString() : value.toFixed(2);
}

function CompositionPanel({ materials }: { materials: MaterialRow[] }) {
  const largestTarget = Math.max(...materials.map((row) => row.target_weight_g), 1);

  return (
    <div className="analytics-card panel">
      <h3>Composition</h3>
      <div className="composition-list">
        {materials.map((material) => {
          const delta = material.actual_weight_g - material.target_weight_g;
          return (
            <div className="composition-row" key={material.material_line_id}>
              <div className="composition-copy">
                <strong>{material.raw_material_name}</strong>
                <span>
                  {material.target_weight_g.toLocaleString()} g target · {delta >= 0 ? "+" : ""}
                  {delta.toFixed(2)} g Δ
                </span>
              </div>
              <div className="bar" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.max(6, (material.target_weight_g / largestTarget) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeasurementBlock({ series }: { series: MeasurementSeries }) {
  const minimum = Math.min(...series.values);
  const maximum = Math.max(...series.values);
  const observationLabel = series.values.length === 1 ? "observation" : "observations";

  return (
    <div className="measurement-block">
      <div className="measurement-title">
        <strong>{series.label}</strong>
        <b>
          {formatMeasurement(series.finalValue, series.unit)}
          {series.unit && <small>{series.unit}</small>}
        </b>
      </div>
      <p>
        {series.values.length} {observationLabel}
        <span>Range {formatMeasurement(minimum, series.unit)}–{formatMeasurement(maximum, series.unit)}</span>
        <span>Final</span>
      </p>
      <div className="observation-values">
        {series.values.map((value, index) => (
          <span key={`${series.label}-${index}`}>
            {formatMeasurement(value, series.unit)}
          </span>
        ))}
      </div>
    </div>
  );
}

function MeasurementsPanel({ series }: { series: MeasurementSeries[] }) {
  return (
    <div className="analytics-card panel">
      <h3>Measurements</h3>
      <div className="measurement-list">
        {series.map((measurement) => (
          <MeasurementBlock series={measurement} key={measurement.label} />
        ))}
      </div>
    </div>
  );
}

export default function BatchAnalytics({ document }: { document: DemoDocument }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSection = document.sections[selectedIndex] ?? document.sections[0];
  if (!selectedSection) return null;

  const materials = document.materialRows.filter(
    (row) => row.section_instance_id === selectedSection.section_instance_id
  );
  const measurements = getMeasurementSeries(selectedSection);
  const comparisonRows = getComparisonRows(document);
  const productionDate = document.records[0]?.production_date ?? "2026-03-24";

  return (
    <section className="dashboard-section" aria-labelledby="analytics-title">
      <div className="section-heading">
        <h2 id="analytics-title">Batch Analytics</h2>
        <label className="batch-select">
          Batch
          <select
            value={selectedIndex}
            onChange={(event) => setSelectedIndex(Number(event.target.value))}
          >
            {document.sections.map((section, index) => (
              <option value={index} key={section.section_instance_id}>
                {section.batch_id}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="batch-summary panel">
        <div className="batch-title">
          <strong>{selectedSection.formula_descriptor}</strong>
          <span>{productionDate}</span>
        </div>
        <div className="metric-grid">
          {[
            ["Batch ID", selectedSection.batch_id],
            ["Batch Size", `${selectedSection.target_weight_g.toLocaleString()} g`],
            ["Materials", String(materials.length)],
            ["pH", selectedSection.final_actual_ph.toFixed(2)],
            ["Viscosity", `${selectedSection.final_actual_viscosity.toLocaleString()} cps`],
          ].map(([label, value]) => (
            <div className="metric-block" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        <CompositionPanel materials={materials} />
        <MeasurementsPanel series={measurements} />
      </div>

      <div className="comparison" aria-labelledby="comparison-title">
        <h2 id="comparison-title">Batch Comparison</h2>
        <div className="table-frame comparison-frame">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Batch Size (g)</th>
                  <th>Materials</th>
                  <th>pH</th>
                  <th>Viscosity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr
                    className={index === selectedIndex ? "comparison-selected" : ""}
                    key={`${row.batchId}-${index}`}
                  >
                    <td>{row.batchId}</td>
                    <td>{row.section}</td>
                    <td>{row.date}</td>
                    <td>{row.batchSize.toLocaleString()}</td>
                    <td>{row.materials}</td>
                    <td>{row.ph == null ? "—" : row.ph.toFixed(2)}</td>
                    <td>{row.viscosity == null ? "—" : row.viscosity.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
