import { listSampleDocuments } from "../services/documentService";
import type { DemoDocument } from "../types";

export default function DocumentList({
  onOpen,
}: {
  onOpen: (doc: DemoDocument) => void;
}) {
  const docs = listSampleDocuments();

  return (
    <section className="doclist">
      <h1 className="report__title">All documents</h1>
      <p className="report__subtitle">
        Synthetic sample documents available in this demo.
      </p>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Pages</th>
              <th>Records</th>
              <th>Status</th>
              <th>Last processed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.title}</td>
                <td>{doc.docType === "WS" ? "Scanned" : "Electronic"}</td>
                <td>{doc.overview.pages}</td>
                <td>{doc.overview.records}</td>
                <td>
                  <span
                    className={`chip chip--${
                      doc.overview.validationStatus.includes("warning")
                        ? "warning"
                        : "passed"
                    }`}
                  >
                    {doc.overview.validationStatus}
                  </span>
                </td>
                <td>Demo</td>
                <td>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onOpen(doc)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
