export const getTimeStamps = () => {
  const toMidnightUTC = (date: Date): number => {
    // Get midnight IST as a UTC timestamp
    const istMidnight = new Date(
      date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30"
    );
    return istMidnight.getTime();
  };

  const now = new Date();

  // -------- TODAY --------
  const todayTS = toMidnightUTC(now);

  // -------- LAST 7 DAYS --------
  const last7DaysDate = new Date(now);
  last7DaysDate.setDate(now.getDate() - 7);
  const last7DaysTS = toMidnightUTC(last7DaysDate);

  // -------- START OF MONTH --------
  const istDateStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [year, month] = istDateStr.split("-").map(Number);
  const startOfMonthTS = new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00+05:30`).getTime();


  
  return {
    todayTS,
    last7DaysTS,
    startOfMonthTS,
  };
};