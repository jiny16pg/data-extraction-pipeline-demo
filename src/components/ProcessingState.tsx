import type { DocumentMeta } from "../services/documentService";

export default function ProcessingState({
  meta,
  detected,
}: {
  meta: DocumentMeta;
  detected: boolean;
}) {
  return (
    <section className="processing" aria-live="polite">
      <div className="processing__card">
        <span className="processing__spinner" aria-hidden="true" />
        <div className="processing__body">
          <strong>{meta.fileName}</strong>
          <span className="processing__status">
            {detected
              ? `${meta.workflowLabel} detected`
              : "Analyzing document structure…"}
          </span>
        </div>
        {detected && (
          <span className={`chip chip--${meta.workflow === "scanned" ? "warning" : "passed"}`}>
            {meta.workflow === "scanned" ? "OCR/VLM path" : "Parser path"}
          </span>
        )}
      </div>
      <p className="processing__note">
        Static demo · No file is uploaded to a server. Pre-generated
        demonstration output.
      </p>
    </section>
  );
}
