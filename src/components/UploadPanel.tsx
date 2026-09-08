import { useRef, useState } from "react";

export interface Selection {
  fileName: string;
  fileSize: number | null;
  sampleId?: string;
  file?: File;
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return "Synthetic sample";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function UploadPanel({
  selection,
  onSelectFile,
  onSelectSample,
  onClear,
  onProcess,
}: {
  selection: Selection | null;
  onSelectFile: (file: File) => void;
  onSelectSample: (sampleId: string) => void;
  onClear: () => void;
  onProcess: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && file.type === "application/pdf") {
      onSelectFile(file);
    }
  }

  return (
    <section className="uploader" aria-labelledby="uploader-heading">
      <h2 id="uploader-heading" className="uploader__heading">
        Upload a batch record
      </h2>
      <p className="uploader__helper">
        Electronic and scanned PDF batch records are supported.
      </p>

      {!selection ? (
        <>
          <label
            className={`dropzone ${dragOver ? "dropzone--over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="dropzone__input"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <span className="dropzone__icon" aria-hidden="true">↑</span>
            <strong className="dropzone__title">Drag &amp; drop a batch record here</strong>
            <span className="dropzone__sub">or click to browse</span>
            <span className="dropzone__meta">PDF · Electronic or scanned</span>
            <span className="dropzone__cta">Choose PDF</span>
          </label>

          <div className="samples">
            <span className="samples__label">Or try a sample</span>
            <div className="samples__buttons">
              <button
                type="button"
                className="sample-btn"
                onClick={() => onSelectSample("DEMO-EBR-001")}
              >
                Use Electronic Batch Record sample
              </button>
              <button
                type="button"
                className="sample-btn"
                onClick={() => onSelectSample("DEMO-WS-001")}
              >
                Use Scanned Weigh Sheet sample
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="selected-file">
          <div className="selected-file__row">
            <span className="selected-file__icon" aria-hidden="true">PDF</span>
            <div className="selected-file__meta">
              <strong>{selection.fileName}</strong>
              <span>{formatSize(selection.fileSize)}</span>
            </div>
            <button
              type="button"
              className="selected-file__clear"
              onClick={onClear}
              aria-label="Remove selected document"
            >
              ×
            </button>
          </div>
          <button type="button" className="primary-btn" onClick={onProcess}>
            Process document
          </button>
        </div>
      )}

      <p className="uploader__note">
        Static demo · No file is uploaded to a server.
      </p>
    </section>
  );
}
