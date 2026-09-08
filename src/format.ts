export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function statusLabel(status: string): string {
  switch (status) {
    case "passed":
      return "Validated";
    case "warning":
      return "Needs Review";
    case "flagged":
      return "Flagged";
    default:
      return status;
  }
}
