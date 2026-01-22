export const getMonthName = (monthNum: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNum] || `M${monthNum + 1}`;
};

export const formatCurrency = (amount: number) => {
  if (!amount || isNaN(amount)) return "0";
  return Math.round(amount).toLocaleString("en-IN");
};

export const formatDayLabel = (dateStr?: string) => {
  if (!dateStr) return "—";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};
