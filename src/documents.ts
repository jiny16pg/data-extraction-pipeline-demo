import type { DemoDocument } from "./types";
import ebr from "./data/ebr.json";
import weighsheet from "./data/weighsheet.json";

export const documents: DemoDocument[] = [
  ebr as DemoDocument,
  weighsheet as DemoDocument,
];
