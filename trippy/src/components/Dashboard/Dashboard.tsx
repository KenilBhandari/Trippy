import type { DashboardProps, Trip } from "../../types";
import { TrendingUp, Calendar, BarChart3, IndianRupee } from "lucide-react";

const Dashboard = ({ trips, monthTrips, monthTotal }: DashboardProps) => {
  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  
  const avgFare =
    monthTrips.length > 0 ? Math.round(monthTotal / monthTrips.length) : 0;

  // Get last 7 days data
  const getDailyData = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTrips = trips.filter((t) => {
        const tripDate = new Date(t.createdAt);
        tripDate.setHours(0, 0, 0, 0);
        return tripDate.getTime() === date.getTime();
      });
      
      const dayTotal = dayTrips.reduce((sum, t) => sum + t.fare, 0);

      last7Days.push({
        date: date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
        }),
        amount: dayTotal,
        trips: dayTrips.length,
      });
    }

    return last7Days;
  };

  // Get last 7 days total
  const dailyData = getDailyData();
  const last7DaysTotal = dailyData.reduce((sum, d) => sum + d.amount, 0);
  const maxDailyAmount = Math.max(...dailyData.map((d) => d.amount), 1);

  // Get monthly data for current year
  const getMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let month = 0; month < 12; month++) {
      const monthTrips = trips.filter((t) => {
        const tripDate = new Date(t.createdAt);
        return tripDate.getFullYear() === currentYear && tripDate.getMonth() === month;
      });
      
      const monthTotal = monthTrips.reduce((sum, t) => sum + t.fare, 0);
      
      monthlyData.push({
        month: monthNames[month],
        amount: monthTotal,
        trips: monthTrips.length,
      });
    }
    
    return monthlyData;
  };

  const monthlyData = getMonthlyData();
  const maxMonthlyAmount = Math.max(...monthlyData.map((m) => m.amount), 1);

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Stats Cards - Clean & Light */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* This Month Revenue */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="bg-blue-50 p-1.5 md:p-2 rounded-lg">
              <IndianRupee size={16} className="text-blue-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">This Month</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            ₹{monthTotal.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Last 7 Days Revenue */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="bg-green-50 p-1.5 md:p-2 rounded-lg">
              <TrendingUp size={16} className="text-green-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Last 7 Days</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            ₹{last7DaysTotal.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Total Trips This Month */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="bg-purple-50 p-1.5 md:p-2 rounded-lg">
              <Calendar size={16} className="text-purple-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Trips</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {monthTrips.length}
          </p>
        </div>

        {/* Average Fare */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="bg-orange-50 p-1.5 md:p-2 rounded-lg">
              <BarChart3 size={16} className="text-orange-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Avg Fare</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            ₹{avgFare.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Last 7 Days Chart - Minimal & Clean */}
   <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-4 md:mb-5">
    Last 7 Days Performance
  </h3>

  {/* Vertical bars container */}
  <div className="flex items-end justify-between h-40 md:h-52 gap-2 md:gap-3">
    {dailyData.map((day, idx) => {
      const barHeight = day.amount > 0 ? Math.max((day.amount / maxDailyAmount) * 100, 10) : 0; // min height 10% for visibility
      return (
        <div key={idx} className="flex flex-col items-center flex-1">
          {/* Amount label on top */}
          <div className="text-xs md:text-sm font-semibold text-gray-700 mb-1">
            {day.amount > 0 ? `₹${day.amount.toLocaleString("en-IN")}` : ""}
          </div>

          {/* Vertical bar */}
          <div className="w-6 md:w-8 bg-gray-50 rounded-lg relative flex items-end overflow-hidden h-full">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-lg transition-all duration-700 ease-out"
              style={{ height: `${barHeight}%` }}
            />
          </div>

          {/* Date label */}
          <div className="text-xs md:text-sm text-gray-600 mt-2">
            {day.date}
          </div>

          {/* Trips count */}
          <div className="text-xs md:text-sm text-gray-500">
            {day.trips} trips
          </div>
        </div>
      );
    })}
  </div>
</div>

      {/* Monthly Trends Chart - Clean Vertical Bars */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-4 md:mb-6">
          Monthly Revenue Trends ({new Date().getFullYear()})
        </h3>
        
        <div className="flex items-end justify-between gap-1 md:gap-2 h-48 md:h-64">
          {monthlyData.map((month, idx) => {
            const heightPercent = month.amount > 0 
              ? Math.max((month.amount / maxMonthlyAmount) * 100, 3)
              : 0;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Bar */}
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div className="relative w-full flex flex-col items-center">
                    {/* Amount Label on Hover */}
                    {month.amount > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        <div className="bg-gray-900 text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                          ₹{month.amount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    )}
                    
                    {/* Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md md:rounded-t-lg transition-all duration-700 ease-out hover:from-indigo-600 hover:to-indigo-500 cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                </div>
                
                {/* Month Label */}
                <div className="text-[10px] md:text-xs font-semibold text-gray-600">
                  {month.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;