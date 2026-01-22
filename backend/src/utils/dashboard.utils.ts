export const getWeekTimestamp = (): {startTimeStamp: number, endTimeStamp: number} => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); 

  const dayOfWeek = currentDate.getDay();
  
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - dayOfWeek); 

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999); 

  const startTimeStamp = startDate.getTime();
  const endTimeStamp = endDate.getTime();

  return {
    startTimeStamp,
    endTimeStamp
  };
}
