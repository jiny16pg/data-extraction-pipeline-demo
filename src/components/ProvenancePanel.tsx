import type { MaterialRow } from "../types";
import { formatNumber, statusLabel } from "../format";

export default function ProvenancePanel({
  row,
  onClose,
}: {
  row: MaterialRow;
  onClose: () => void;
}) {
  const fields: Array<[string, string]> = [
    ["Record ID", row.record_instance_id],
    ["Section ID", row.section_instance_id],
    ["Material Line ID", row.material_line_id],
    ["Material", row.raw_material_name],
    ["Source Page", String(row.source_page)],
    ["Raw Value", row.raw_value],
    ["Normalized Value", `${formatNumber(row.actual_weight_g)} g`],
    ["Validation Status", statusLabel(row.validation_status)],
  ];

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Provenance detail">
        <div className="drawer__head">
          <div>
            <span className="drawer__eyebrow">Provenance</span>
            <h3>{row.raw_material_name}</h3>
          </div>
          <button
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <span className={`chip chip--${row.validation_status}`}>
          {statusLabel(row.validation_status)}
        </span>

        {row.review_reason && (
          <div className="review-reason">
            <strong>Reason</strong>
            <p>{row.review_reason}</p>
          </div>
        )}

        <dl className="drawer__list">
          {fields.map(([label, value]) => (
            <div className="drawer__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="drawer__preview">
          <span className="drawer__preview-label">
            Synthetic source snippet · page {row.source_page}
          </span>
          <div className="doc-snippet">
            <span className="doc-snippet__line" />
            <span className="doc-snippet__line doc-snippet__line--short" />
            <div className="doc-snippet__value">
              {row.raw_material_name} … {row.raw_value}
            </div>
            <span className="doc-snippet__line" />
            <span className="doc-snippet__line doc-snippet__line--short" />
          </div>
        </div>
      </aside>
    </>
  );
}
