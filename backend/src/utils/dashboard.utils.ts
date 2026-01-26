export const getWeekTimestamp = (): {startTimeStamp: number, endTimeStamp: number} => {
  const currentDate = new Date();
const dayOfWeek = currentDate.getDay();

// Start of week in IST
const startDate = new Date(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(currentDate.getDate() - dayOfWeek).padStart(2,'0')}T00:00:00+05:30`);

// End of week in IST
const endDate = new Date(`${startDate.getFullYear()}-${String(startDate.getMonth()+1).padStart(2,'0')}-${String(startDate.getDate()+6).padStart(2,'0')}T23:59:59+05:30`);

const startTimeStamp = startDate.getTime();
const endTimeStamp = endDate.getTime();

return { startTimeStamp, endTimeStamp };

}
