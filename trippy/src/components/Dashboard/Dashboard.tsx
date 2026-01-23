import React, { useEffect } from "react";
import { useDataContext } from "../../context/TripContext";
import { TrendingUp, Calendar, BarChart3, IndianRupee } from "lucide-react";
import { loadDashboard } from "../../api/dashboard.service";
import { formatCurrency, formatDayLabel, getMonthName } from "../../utils/dashboard.utils";

const Dashboard = () => {
  const { setDashboardData, dashboardData } = useDataContext();


  const monthStats = dashboardData?.monthStats || {
    totalRevenue: 0,
    totalTrips: 0,
    avgFare: 0,
  };

  const last7Days = Array.isArray(dashboardData?.last7Days)
    ? dashboardData.last7Days
    : [];

  const monthlyTotals = Array.isArray(dashboardData?.monthlyTotals)
    ? dashboardData.monthlyTotals
    : [];

  const weeklyRevenue = Array.isArray(dashboardData?.thisWeek)
    ? dashboardData.thisWeek[0].thisWeekRevenue
    : [];

  const maxDailyAmount =
    last7Days.length > 0
      ? Math.max(...last7Days.map((d) => d?.totalRevenue || 0), 1)
      : 1;

  const maxMonthlyAmount =
    monthlyTotals.length > 0
      ? Math.max(...monthlyTotals.map((m) => m?.totalRevenue || 0), 1)
      : 1;




  const statCards = [
    {
      icon: IndianRupee,
      label: "This Month",
      value: `₹${formatCurrency(monthStats.totalRevenue)}`,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Calendar,
      label: "Total Trips",
      value: monthStats.totalTrips || 0,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: BarChart3,
      label: "Avg Fare",
      value: `₹${formatCurrency(monthStats.avgFare)}`,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: `₹${formatCurrency(weeklyRevenue)}`,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];


useEffect(() => {
  if (!dashboardData) {
    loadDashboard(setDashboardData);
  }
}, [dashboardData]);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
            >
              <div
                className={`${card.bgColor} w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4`}
              >
                <card.icon
                  size={18}
                  className={card.iconColor}
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 md:mb-2">
                {card.label}
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
          <div className="mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Last 7 Days
            </h2>
          </div>

          {/* Empty State */}
          {last7Days.length === 0 ? (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <BarChart3 size={24} className="text-gray-400" />
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  No data available
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between h-48 md:h-64 gap-1.5 md:gap-3">
              {last7Days.map((day, idx) => {
                const revenue = day?.totalRevenue || 0;
                const barHeight =
                  maxDailyAmount > 0 ? (revenue / maxDailyAmount) * 100 : 0;

                const dateDisplay = formatDayLabel(day?._id);

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center min-w-0"
                  >
                    {/* Revenue */}
                    {revenue > 0 && (
                      <div className="mb-1 md:mb-2 text-[10px] md:text-xs font-semibold text-gray-700">
                        ₹{formatCurrency(revenue)}
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full max-w-[28px] md:max-w-[40px] h-36 md:h-48 bg-gray-100 rounded-t-lg flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all duration-700 ease-out"
                        style={{
                          height: `${Math.max(barHeight, revenue > 0 ? 5 : 0)}%`,
                        }}
                      />
                    </div>

                    {/* Date label */}
                    <p className="text-[10px] md:text-xs font-semibold text-gray-600 mt-2 md:mt-3 truncate w-full text-center">
                      {dateDisplay}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-100">
          <div className="mb-3 md:mb-6">
            <h2 className="text-sm md:text-lg font-bold text-gray-900">
              Monthly Trends
            </h2>
          </div>

          {/* Empty State */}

          {monthlyTotals.length === 0 ? (
            <div className="h-40 md:h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
                <BarChart3 size={20} className="text-gray-300 mx-auto mb-2" />
                <p className="text-[10px] md:text-sm text-gray-400">
                  No data for this period
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex items-end justify-between h-44 md:h-64 min-w-full gap-1 md:gap-1.5">
                {monthlyTotals.map((item, idx) => {
                  const revenue = item?.totalRevenue || 0;
                  const height =
                    maxMonthlyAmount > 0
                      ? (revenue / maxMonthlyAmount) * 100
                      : 0;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center min-w-0"
                    >
                      {/* Revenue Tooltip */}
                      <div className="h-4 flex items-end justify-center mb-1">
                        {revenue > 0 && (
                          <span className="text-[8px] md:text-xs font-bold text-gray-600">
                            {revenue >= 1000
                              ? `${(revenue / 1000).toFixed(1)}k`
                              : revenue}
                          </span>
                        )}
                      </div>

                      <div className="w-full max-w-[13px] md:max-w-[28px] h-32 md:h-52 bg-gray-50 rounded-t-lg flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 transition-all duration-1000 ease-out"
                          style={{
                            height: `${Math.max(height, revenue > 0 ? 4 : 0)}%`,
                          }}
                        />
                      </div>

                      <p className="text-[8px] md:text-xs font-bold text-gray-400 mt-1.5 md:mt-2 uppercase tracking-tight">
                        {getMonthName(idx)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
