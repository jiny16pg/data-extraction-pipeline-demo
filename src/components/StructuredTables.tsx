import { useMemo, useState } from "react";
import type { DemoDocument } from "../types";
import {
  getTableRows,
  tableDefinitions,
  type TableKey,
  type TableRow,
} from "../data/dashboardData";

function downloadCsv(rows: TableRow[], table: TableKey) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const csv = [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => JSON.stringify(row[column] ?? "")).join(",")
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
  );
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${table}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface StructuredTablesProps {
  document: DemoDocument;
  fileName: string;
}

export default function StructuredTables({ document, fileName }: StructuredTablesProps) {
  const [activeTable, setActiveTable] = useState<TableKey>("documents");
  const [search, setSearch] = useState("");
  const rows = useMemo(
    () => getTableRows(document, activeTable, fileName),
    [activeTable, document, fileName]
  );
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(query))
    );
  }, [rows, search]);
  const columns = filteredRows[0] ? Object.keys(filteredRows[0]) : [];

  return (
    <section className="dashboard-section" aria-labelledby="tables-title">
      <div className="section-heading section-heading--tools">
        <h2 id="tables-title">Structured Tables</h2>
        <div className="table-tools">
          <input
            type="search"
            aria-label="Search current table"
            placeholder="Search table"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            className="download-button"
            disabled={!rows.length}
            onClick={() => downloadCsv(rows, activeTable)}
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Structured table selection">
        {tableDefinitions.map(([table, label]) => {
          const count = getTableRows(document, table, fileName).length;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={activeTable === table}
              className={activeTable === table ? "tab tab--active" : "tab"}
              key={table}
              onClick={() => {
                setActiveTable(table);
                setSearch("");
              }}
            >
              {label} <small>{count}</small>
            </button>
          );
        })}
      </div>

      <div className="table-frame">
        <p className="table-count">
          {filteredRows.length} row{filteredRows.length === 1 ? "" : "s"}
        </p>
        {filteredRows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column.split("_").join(" ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, rowIndex) => (
                  <tr key={`${activeTable}-${rowIndex}`}>
                    {columns.map((column) => (
                      <td key={column}>{String(row[column] ?? "—")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="table-empty">No matching rows.</p>
        )}
      </div>
    </section>
  );
}
