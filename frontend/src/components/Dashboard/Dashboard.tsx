import React, { useEffect, useMemo } from "react";
import { TrendingUp, Truck, BarChart3, IndianRupee, Database } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { loadDashboard } from "../../api/dashboard.service";
import {
  formatCurrency,
  formatDayLabel,
  getMonthName,
} from "../../utils/dashboard.utils";

interface DayData {
  _id: string | number;
  totalRevenue: number;
}

const Dashboard = () => {
  const {
    setDashboardData,
    dashboardData,
    activeTab,
    dashboardNeedsRefresh,
    setDashboardNeedsRefresh,
  } = useDataContext();



  const stats = useMemo(() => {
    const monthStats = dashboardData?.monthStats || {
      totalRevenue: 0,
      totalTrips: 0,
      avgFare: 0,
    };
    const last7Days: DayData[] = dashboardData?.last7Days ?? [];
    const monthlyTotals: DayData[] = dashboardData?.monthlyTotals ?? [];
    const weeklyRevenue = Array.isArray(dashboardData?.thisWeek)
      ? (dashboardData?.thisWeek[0]?.thisWeekRevenue ?? 0)
      : 0;

    const getMax = (data: DayData[]) =>
      data.length > 0
        ? Math.max(...data.map((d) => d?.totalRevenue || 0), 1)
        : 1;

    return {
      monthStats,
      last7Days,
      monthlyTotals,
      weeklyRevenue,
      maxDaily: getMax(last7Days),
      maxMonthly: getMax(monthlyTotals),
    };
  }, [dashboardData]);

  const statCards = useMemo(
    () => [
      {
        icon: IndianRupee,
        label: "This Month",
        value: `₹${formatCurrency(stats.monthStats.totalRevenue)}`,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        icon: Truck,
        label: "Total Trips",
        value: stats.monthStats.totalTrips || 0,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        icon: BarChart3,
        label: "Avg Fare",
        value: `₹${formatCurrency(stats.monthStats.avgFare)}`,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        icon: TrendingUp,
        label: "This Week",
        value: `₹${formatCurrency(stats.weeklyRevenue)}`,
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
      },
    ],
    [stats],
  );

  useEffect(() => {
    if (!dashboardData) loadDashboard(setDashboardData);
  }, [dashboardData, setDashboardData]);

  useEffect(() => {
    if (activeTab === "dashboard" && dashboardNeedsRefresh) {
      loadDashboard(setDashboardData).finally(() =>
        setDashboardNeedsRefresh(false),
      );
    }
  }, [
    activeTab,
    dashboardNeedsRefresh,
    setDashboardData,
    setDashboardNeedsRefresh,
  ]);

const RenderBar = ({
  revenue,
  max,
  label,
  isWeekly = false,
}: {
  revenue: number;
  max: number;
  label: string;
  isWeekly?: boolean;
}) => {
  const barHeight = (revenue / max) * 100;

  const displayVal = isWeekly
    ? `₹${formatCurrency(revenue)}`
    : revenue >= 1000
      ? `₹${(revenue / 1000).toFixed(1)}k`
      : `₹${revenue}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-end h-full">
      {revenue > 0 && (
        <span className="mb-1 text-[10px] sm:text-[11px] font-medium text-slate-700 tabular-nums">
          {displayVal}
        </span>
      )}

      <div className="w-full max-w-[18px] sm:max-w-[22px] bg-slate-100 border rounded-sm border-slate-300 h-3/4 relative">
        <div
          className="absolute bottom-0 w-full bg-blue-600  rounded-sm transition-all duration-500"
          style={{ height: `${revenue > 0 ? Math.max(barHeight, 6) : 0}%` }}
        />
      </div>

      <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center w-full h-full py-8 text-slate-500">
    <Database size={22} className="mb-2 text-slate-300" />
    <p className="text-xs sm:text-sm">{message}</p>
  </div>
);

return (
  <div className="max-w-7xl mx-auto space-y-5">
    {/* Header */}
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
        Dashboard
      </h1>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-300 px-3 py-3 sm:px-4 sm:py-4"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
              {card.label}
            </p>
            <card.icon
              size={15}
              className="text-slate-400"
              strokeWidth={2}
            />
          </div>

          <p className="text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
            {card.value}
          </p>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {/* Weekly Revenue */}
      <div className="bg-white border border-slate-300">
        <div className="px-3 sm:px-4 py-2 border-b border-slate-300">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-700">
            Weekly Revenue
          </h2>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-5">
          <div className="flex items-end justify-between h-52 sm:h-64 gap-2 sm:gap-3">
            {stats.last7Days.length > 0 ? (
              stats.last7Days.map((day, i) => (
                <RenderBar
                  key={i}
                  revenue={day.totalRevenue}
                  max={stats.maxDaily}
                  label={formatDayLabel(day._id)}
                  isWeekly={true}
                />
              ))
            ) : (
              <EmptyState message="No weekly data available" />
            )}
          </div>
        </div>
      </div>

      {/* Annual Growth */}
      <div className="bg-white border border-slate-300">
        <div className="px-3 sm:px-4 py-2 border-b border-slate-300">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-700">
            Annual Growth
          </h2>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-5 overflow-x-auto">
          <div
            className={`flex items-end justify-between h-52 sm:h-64 gap-2 sm:gap-3 sm:min-w-full ${
              stats.monthlyTotals.length > 0 ? "min-w-[480px]" : ""
            }`}
          >
            {stats.monthlyTotals.length > 0 ? (
              stats.monthlyTotals.map((item, i) => (
                <RenderBar
                  key={i}
                  revenue={item.totalRevenue}
                  max={stats.maxMonthly}
                  label={getMonthName(i).substring(0, 3)}
                />
              ))
            ) : (
              <EmptyState message="No monthly data available" />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default React.memo(Dashboard);
