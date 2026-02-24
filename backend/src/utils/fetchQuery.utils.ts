export const getTimeStamps = () => {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  const now = new Date();
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  // -------- TODAY --------
  const startOfTodayIST = new Date(nowIST);
  startOfTodayIST.setHours(0, 0, 0, 0);

  // -------- LAST 7 DAYS --------
  const last7DaysIST = new Date(nowIST);
  last7DaysIST.setDate(nowIST.getDate() - 7);
  last7DaysIST.setHours(0, 0, 0, 0);

  // -------- Start Of Month --------
const startOfMonthIST = new Date(
  nowIST.getFullYear(),
  nowIST.getMonth(),
  1
);

  return {
    todayTS: startOfTodayIST.getTime() - IST_OFFSET,
    last7DaysTS: last7DaysIST.getTime() - IST_OFFSET,
    startOfMonthTS: startOfMonthIST.getTime() - IST_OFFSET,
  };
};