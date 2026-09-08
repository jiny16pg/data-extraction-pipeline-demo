import { useState } from "react";
import type { DemoDocument } from "./types";
import UploadPanel, { type Selection } from "./components/UploadPanel";
import WorkflowCapabilities from "./components/WorkflowCapabilities";
import ProcessingState from "./components/ProcessingState";
import DocumentWorkspace from "./components/DocumentWorkspace";
import DocumentList from "./components/DocumentList";
import {
  createDocument,
  processDocument,
  getDocumentResult,
  type DocumentMeta,
} from "./services/documentService";

type Screen = "home" | "processing" | "workspace" | "documents";

function sampleFileName(sampleId: string): string {
  return sampleId === "DEMO-WS-001"
    ? "demo-scanned-weigh-sheet.pdf"
    : "demo-electronic-batch-record.pdf";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [meta, setMeta] = useState<DocumentMeta | null>(null);
  const [detected, setDetected] = useState(false);
  const [result, setResult] = useState<DemoDocument | null>(null);
  const [workspaceFile, setWorkspaceFile] = useState<string | undefined>();

  function goHome() {
    setScreen("home");
    setSelection(null);
    setMeta(null);
    setResult(null);
    setDetected(false);
  }

  async function runProcessing() {
    if (!selection) return;
    setScreen("processing");
    setDetected(false);
    const createdMeta = await createDocument({
      file: selection.file,
      sampleId: selection.sampleId,
    });
    setMeta(createdMeta);
    setWorkspaceFile(createdMeta.fileName);
    window.setTimeout(() => setDetected(true), 700);
    await processDocument(createdMeta.documentId);
    const doc = await getDocumentResult(createdMeta.documentId);
    setResult(doc);
    setScreen("workspace");
  }

  function openFromList(doc: DemoDocument) {
    setResult(doc);
    setWorkspaceFile(sampleFileName(doc.id));
    setScreen("workspace");
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <button type="button" className="brand" onClick={goHome}>
            Data Extraction Pipeline
          </button>
          <nav className="app-nav">
            <button
              type="button"
              className={`nav-link ${screen === "home" ? "nav-link--active" : ""}`}
              onClick={goHome}
            >
              Upload
            </button>
            <button
              type="button"
              className={`nav-link ${
                screen === "documents" ? "nav-link--active" : ""
              }`}
              onClick={() => setScreen("documents")}
            >
              All documents
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {screen === "home" && (
          <section className="home">
            <div className="hero">
              <h1>Data Extraction Pipeline</h1>
              <p className="hero__subtitle">
                Transforming complex batch records into structured, traceable
                data.
              </p>
              <span className="badge">Public Demo · Synthetic Data</span>
            </div>

            <UploadPanel
              selection={selection}
              onSelectFile={(file) =>
                setSelection({ fileName: file.name, fileSize: file.size, file })
              }
              onSelectSample={(sampleId) =>
                setSelection({
                  fileName: sampleFileName(sampleId),
                  fileSize: null,
                  sampleId,
                })
              }
              onClear={() => setSelection(null)}
              onProcess={runProcessing}
            />

            <WorkflowCapabilities />
          </section>
        )}

        {screen === "processing" && meta && (
          <ProcessingState meta={meta} detected={detected} />
        )}

        {screen === "workspace" && result && (
          <DocumentWorkspace
            document={result}
            fileName={workspaceFile}
            onBack={() => setScreen("documents")}
          />
        )}

        {screen === "documents" && <DocumentList onOpen={openFromList} />}
      </main>

      <footer className="app-footer">
        <p>
          Static public demonstration using synthetic data only. This site runs
          entirely in the browser and does not connect to any production system.
        </p>
      </footer>
    </div>
  );
}
