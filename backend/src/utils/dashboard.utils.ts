export const getTimeStamps = (): {
  startOfMonthTS: number;
  endOfMonthTS: number;
  startOfWeekTS: number;
  endOfWeekTS: number;
} => {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  const now = new Date();
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  // IST
  const startOfMonthIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), 1);

  const endOfMonthIST = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const day = nowIST.getDay(); // 0 = Sunday
  const adjustedDay = day === 0 ? 7 : day; // For monday based

  const startOfWeekIST = new Date(nowIST);
  startOfWeekIST.setDate(nowIST.getDate() - (adjustedDay - 1));
  startOfWeekIST.setHours(0, 0, 0, 0);

  const endOfWeekIST = new Date(startOfWeekIST);
  endOfWeekIST.setDate(startOfWeekIST.getDate() + 6);
  endOfWeekIST.setHours(23, 59, 59, 999);

  const startOfMonthTS = startOfMonthIST.getTime() - IST_OFFSET;
  const endOfMonthTS = endOfMonthIST.getTime() - IST_OFFSET;

  const startOfWeekTS = startOfWeekIST.getTime() - IST_OFFSET;
  const endOfWeekTS = endOfWeekIST.getTime() - IST_OFFSET;

  return { startOfMonthTS, endOfMonthTS, startOfWeekTS, endOfWeekTS };
};
