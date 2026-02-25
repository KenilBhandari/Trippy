
export function formatDate(dateInput: number, compact?: boolean) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Invalid";
  return d.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short", 
    year: compact ? "2-digit" : "numeric" 
  });
}

export function formatTime(dateInput: number): string {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }) || "Invalid";
}

export function toTimestamp(dateStr?: string, dateTo?: boolean): number | undefined {
  if (!dateStr) return undefined;

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  let normalizedStr: string;
  if (isDateOnly) {
    normalizedStr = dateTo
      ? `${dateStr}T23:59:59.999+05:30`
      : `${dateStr}T00:00:00.000+05:30`;
  } else {
    normalizedStr = dateStr;
  }

  const date = new Date(normalizedStr);
  if (isNaN(date.getTime())) return undefined;

  return date.getTime();
}


