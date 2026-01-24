import React, { useEffect, useMemo } from "react";
import { TrendingUp, Truck, BarChart3, IndianRupee } from "lucide-react";
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
    colorClass,
    isWeekly = false,
  }: {
    revenue: number;
    max: number;
    label: string;
    colorClass: string;
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
          <span
            className={`mb-1 text-[10px] md:text-[11px] font-bold "text-black" whitespace-nowrap`}
          >
            {displayVal}
          </span>
        )}
        <div className="w-full max-w-[28px] bg-slate-100 rounded-lg overflow-hidden ring-1 ring-slate-200 relative h-3/4">
          <div
            className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-1000 ease-out ${colorClass.replace("text", "bg")}`}
            style={{ height: `${revenue > 0 ? Math.max(barHeight, 8) : 0}%` }}
          />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-2 uppercase tracking-tighter">
          {label}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-2 mt-2">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
        <header>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-sm"
            >
              <div
                className={`${card.bgColor} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}
              >
                <card.icon
                  size={16}
                  className={card.iconColor}
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm">
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">
              Weekly Revenue
            </h2>
            <div className="flex items-end justify-between h-56 sm:h-64 gap-2">
              {stats.last7Days.map((day, i) => (
                <RenderBar
                  key={i}
                  revenue={day.totalRevenue}
                  max={stats.maxDaily}
                  label={formatDayLabel(day._id)}
                  colorClass="text-blue-500"
                  isWeekly={true}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm">
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">
              Annual Growth
            </h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-end justify-between h-56 sm:h-64 gap-2 min-w-[480px] sm:min-w-full">
                {stats.monthlyTotals.map((item, i) => (
                  <RenderBar
                    key={i}
                    revenue={item.totalRevenue}
                    max={stats.maxMonthly}
                    label={getMonthName(i).substring(0, 3)}
                    colorClass="text-indigo-600"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
