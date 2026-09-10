import { useState, type DragEvent } from "react";
import type { DocumentSelection } from "../types";

function formatFileSize(bytes: number | null): string {
  if (bytes == null) return "Synthetic sample · loaded";
  if (bytes < 1024) return `${bytes} B · loaded`;
  const kilobytes = bytes / 1024;
  return kilobytes < 1024
    ? `${kilobytes.toFixed(0)} KB · loaded`
    : `${(kilobytes / 1024).toFixed(1)} MB · loaded`;
}

function inferDocumentType(selection: DocumentSelection): "EBR" | "WS" {
  const descriptor = `${selection.sampleId ?? ""} ${selection.fileName}`;
  return /(ws|weigh|scan|hand)/i.test(descriptor) ? "WS" : "EBR";
}

interface UploadSessionPanelProps {
  selection: DocumentSelection | null;
  documentType?: string;
  onClear: () => void;
  onFile: (file: File) => void;
  onSample: (sampleId: string) => void;
}

export default function UploadSessionPanel({
  selection,
  documentType,
  onClear,
  onFile,
  onSample,
}: UploadSessionPanelProps) {
  const [dragOver, setDragOver] = useState(false);

  function acceptFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      onFile(file);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragOver(false);
    acceptFiles(event.dataTransfer.files);
  }

  return (
    <section className="upload-session panel" aria-label="Upload and current session">
      <label
        className={dragOver ? "dropzone dropzone--over" : "dropzone"}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            acceptFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="upload-icon" aria-hidden="true">↑</span>
        <strong>Upload PDF</strong>
        <span>Drop a file here or browse</span>
        <small>Files remain in this browser session</small>
      </label>

      <div className="session-pane">
        <p className="panel-kicker">Current file</p>
        {selection ? (
          <div className="file-row">
            <span className="pdf-mark" aria-hidden="true">PDF</span>
            <div className="file-copy">
              <strong>{selection.fileName}</strong>
              <span>{formatFileSize(selection.fileSize)}</span>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Remove file"
              title="Remove file"
              onClick={onClear}
            >
              ×
            </button>
          </div>
        ) : (
          <p className="empty-copy">No document selected.</p>
        )}

        <div className="divider" />
        <div className="session-heading">
          <strong>Session</strong>
          <span>{selection ? "1 file" : "0 files"}</span>
          <button type="button" className="text-button" onClick={onClear} disabled={!selection}>
            Clear
          </button>
        </div>

        {selection && (
          <div className="session-file">
            <span>{documentType ?? inferDocumentType(selection)}</span>
            <strong>{selection.fileName}</strong>
          </div>
        )}

        <div className="sample-actions">
          <span>Sample data</span>
          <button type="button" onClick={() => onSample("DEMO-EBR-001")}>
            Load EBR sample
          </button>
          <button type="button" onClick={() => onSample("DEMO-WS-001")}>
            Load WS sample
          </button>
        </div>
      </div>
    </section>
  );
}
