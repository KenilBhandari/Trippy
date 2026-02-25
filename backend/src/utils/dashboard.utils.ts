export const getTimeStamps = (): {
  startOfMonthTS: number;
  endOfMonthTS: number;
  startOfWeekTS: number;
  endOfWeekTS: number;
} => {
  const toISTTimestamp = (dateStr: string, time: string): number => {
    return new Date(`${dateStr}T${time}+05:30`).getTime();
  };

  const now = new Date();

  // Get current date parts in IST
  const istDateStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [year, month, day] = istDateStr.split("-").map(Number);

  // -------- START OF MONTH --------
  const startOfMonthTS = toISTTimestamp(
    `${year}-${String(month).padStart(2, "0")}-01`,
    "00:00:00.000"
  );

  // -------- END OF MONTH --------
  const lastDay = new Date(year, month, 0).getDate(); // last date of current month
  const endOfMonthTS = toISTTimestamp(
    `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    "23:59:59.999"
  );

  // -------- START OF WEEK (Monday-based) --------
  const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const dayOfWeek = istDate.getDay(); // 0 = Sunday
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Monday = 1 ... Sunday = 7
  const mondayDate = day - (adjustedDay - 1);
  const mondayDatePadded = new Date(year, month - 1, mondayDate);

  const startOfWeekTS = toISTTimestamp(
    mondayDatePadded.toLocaleDateString("en-CA"),
    "00:00:00.000"
  );

  // -------- END OF WEEK (Sunday) --------
  const sundayDatePadded = new Date(year, month - 1, mondayDate + 6);

  const endOfWeekTS = toISTTimestamp(
    sundayDatePadded.toLocaleDateString("en-CA"),
    "23:59:59.999"
  );

  return { startOfMonthTS, endOfMonthTS, startOfWeekTS, endOfWeekTS };
};