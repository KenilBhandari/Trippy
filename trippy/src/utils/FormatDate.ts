
export function formatDate(dateInput: number) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Invalid";
  return d.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
}
export function formatTime(dateInput: number): string {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }) || "Invalid";
}


export function toTimestamp(dateStr?: string): number | undefined {
    if (!dateStr) return undefined; // if empty, return undefined
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return undefined; // invalid date
    return date.getTime(); // returns timestamp in milliseconds
}
