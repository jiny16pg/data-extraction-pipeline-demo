import { useRef, useState } from "react";
import type { DemoDocument, DocumentSelection } from "./types";
import BatchRecordDashboard from "./components/BatchRecordDashboard";
import {
  createDocument,
  processDocument,
  getDocumentResult,
} from "./services/documentService";

export default function App() {
  const [selection, setSelection] = useState<DocumentSelection | null>(null);
  const [result, setResult] = useState<DemoDocument | null>(null);
  const [progress, setProgress] = useState(0);
  const processingId = useRef(0);

  async function processSelection(nextSelection: DocumentSelection) {
    const currentProcessingId = ++processingId.current;
    setSelection(nextSelection);
    setResult(null);
    setProgress(10);
    const createdMeta = await createDocument({
      file: nextSelection.file,
      sampleId: nextSelection.sampleId,
    });
    if (currentProcessingId !== processingId.current) return;
    const doc = await getDocumentResult(createdMeta.documentId);
    setResult(doc);
    setProgress(25);
    window.setTimeout(() => currentProcessingId === processingId.current && setProgress(50), 260);
    window.setTimeout(() => currentProcessingId === processingId.current && setProgress(75), 520);
    await processDocument(createdMeta.documentId);
    if (currentProcessingId !== processingId.current) return;
    setProgress(100);
  }

  function clearSession() {
    processingId.current += 1;
    setSelection(null);
    setResult(null);
    setProgress(0);
  }

  return (
    <div className="app">
      <BatchRecordDashboard
        selection={selection}
        result={result}
        progress={progress}
        onClear={clearSession}
        onFile={(file) => void processSelection({ fileName: file.name, fileSize: file.size, file })}
        onSample={(sampleId) => void processSelection({ fileName: sampleId === "DEMO-WS-001" ? "demo-weigh-sheet.pdf" : "demo-batch-record.pdf", fileSize: null, sampleId })}
      />
    </div>
  );
}
