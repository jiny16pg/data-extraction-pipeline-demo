import type { DemoDocument, DocumentSelection } from "../types";
import UploadSessionPanel from "./UploadSessionPanel";
import ProcessingProgress from "./ProcessingProgress";
import SessionSummary from "./SessionSummary";
import StructuredTables from "./StructuredTables";
import BatchAnalytics from "./BatchAnalytics";

interface BatchRecordDashboardProps {
  selection: DocumentSelection | null;
  result: DemoDocument | null;
  progress: number;
  onClear: () => void;
  onFile: (file: File) => void;
  onSample: (sampleId: string) => void;
}

export default function BatchRecordDashboard({
  selection,
  result,
  progress,
  onClear,
  onFile,
  onSample,
}: BatchRecordDashboardProps) {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Batch Record Data Extraction</h1>
        <p>Upload WS or EBR PDFs to create structured tables for review and download.</p>
      </header>

      <UploadSessionPanel
        selection={selection}
        documentType={result?.docType}
        onClear={onClear}
        onFile={onFile}
        onSample={onSample}
      />

      {selection && (
        <>
          <div className="status-message" role="status">
            {selection.fileName} {progress === 100 ? "is ready." : "is being processed."}
          </div>
          <ProcessingProgress progress={progress} />
        </>
      )}

      {result && (
        <div className="dashboard-results">
          <SessionSummary document={result} />
          <StructuredTables document={result} fileName={selection?.fileName ?? "demo-record.pdf"} />
          <BatchAnalytics document={result} key={result.id} />
        </div>
      )}
    </main>
  );
}
