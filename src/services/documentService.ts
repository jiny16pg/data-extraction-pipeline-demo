import type { DemoDocument } from "../types";
import { documents } from "../documents";

export type WorkflowKind = "electronic" | "scanned";
export type DocumentStatus = "processing" | "completed" | "error";

export interface DocumentMeta {
  documentId: string;
  fileName: string;
  fileSize: number | null;
  workflow: WorkflowKind;
  workflowLabel: string;
  title: string;
  sampleId: string;
}

/**
 * Mirrors the shape of the real internal document API, but every method here
 * resolves against bundled synthetic data. No network, no backend, no secrets.
 * A real implementation could swap these functions out one-for-one.
 */
const registry = new Map<string, { meta: DocumentMeta; result: DemoDocument }>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveSampleId(fileName: string, explicit?: string): string {
  if (explicit) return explicit;
  const name = fileName.toLowerCase();
  if (/(ws|weigh|scan|hand)/.test(name)) return "DEMO-WS-001";
  return "DEMO-EBR-001";
}

export async function createDocument(input: {
  file?: File;
  sampleId?: string;
}): Promise<DocumentMeta> {
  await delay(120);
  const sampleId = resolveSampleId(input.file?.name ?? "", input.sampleId);
  const result = documents.find((d) => d.id === sampleId);
  if (!result) throw new Error("Sample not found");

  const workflow: WorkflowKind = result.docType === "WS" ? "scanned" : "electronic";
  const fallbackName =
    workflow === "scanned"
      ? "demo-scanned-weigh-sheet.pdf"
      : "demo-electronic-batch-record.pdf";

  const meta: DocumentMeta = {
    documentId: `doc_${Math.random().toString(36).slice(2, 9)}`,
    fileName: input.file?.name ?? fallbackName,
    fileSize: input.file?.size ?? null,
    workflow,
    workflowLabel: result.title,
    title: result.title,
    sampleId,
  };
  registry.set(meta.documentId, { meta, result });
  return meta;
}

export async function processDocument(documentId: string): Promise<void> {
  await delay(1400);
  if (!registry.has(documentId)) throw new Error("Unknown document");
}

export async function getDocumentStatus(
  documentId: string
): Promise<DocumentStatus> {
  return registry.has(documentId) ? "completed" : "error";
}

export async function getDocumentResult(
  documentId: string
): Promise<DemoDocument> {
  const entry = registry.get(documentId);
  if (!entry) throw new Error("Unknown document");
  return entry.result;
}

export async function getDocumentTable(
  documentId: string,
  tableName: "records" | "sections" | "materialRows" | "qualityChecks"
): Promise<unknown[]> {
  const entry = registry.get(documentId);
  if (!entry) throw new Error("Unknown document");
  return entry.result[tableName];
}

/** Static catalog used by the All Documents view. */
export function listSampleDocuments(): DemoDocument[] {
  return documents;
}
