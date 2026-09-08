const CAPABILITIES = [
  {
    tag: "EBR",
    title: "Electronic Batch Record",
    detail: "Deterministic text & table extraction",
  },
  {
    tag: "WS",
    title: "Scanned Weigh Sheet",
    detail: "OCR/VLM + document assembly",
  },
];

export default function WorkflowCapabilities() {
  return (
    <section className="workflows" aria-labelledby="workflows-heading">
      <h2 id="workflows-heading" className="workflows__heading">
        Supported document workflows
      </h2>
      <p className="workflows__hint">
        One entry point, two extraction paths. The pipeline detects the document
        type and routes it to the right method — then normalizes both into the
        same canonical structure.
      </p>
      <div className="capability-grid">
        {CAPABILITIES.map((c) => (
          <div className="capability" key={c.tag}>
            <span className="capability__icon">{c.tag}</span>
            <div className="capability__body">
              <strong>{c.title}</strong>
              <span>{c.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
