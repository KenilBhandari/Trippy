import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Truck,
  BarChart3,
  IndianRupee,
  Database,
  type LucideIcon,
} from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { loadDashboard } from "../../api/dashboard.service";
import {
  formatCurrency,
  formatDayLabel,
  getMonthName,
} from "../../utils/dashboard.utils";
import type { DashboardSummary } from "../../types";
import Skeleton from "../UI/Skeleton";

type StatCardItem = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

type RevenueBar = {
  key: string;
  label: string;
  revenue: number;
};

const EMPTY_SUMMARY = {
  trips: 0,
  avgFare: 0,
  monthRevenue: 0,
  weekRevenue: 0
};

const getMaxRevenue = (bars: RevenueBar[]) => {
  if (bars.length === 0) return 1;
  return Math.max(...bars.map((bar) => bar.revenue), 1);
};

const StatCard = ({ icon: Icon, label, value }: StatCardItem) => {
  return (
    <div className="bg-white border border-slate-300 px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <Icon size={15} className="text-slate-400" strokeWidth={2} />
      </div>

      <p className="text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
        {value}
      </p>
    </div>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-300 px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-20 rounded-sm" />
        <Skeleton className="h-4 w-4 rounded-sm" />
      </div>
      <Skeleton className="h-6 w-24 rounded-sm" />
    </div>
  );
};

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
  const displayValue = isWeekly
    ? `₹${formatCurrency(revenue)}`
    : revenue >= 1000
      ? `₹${(revenue / 1000).toFixed(1)}k`
      : `₹${revenue}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-end h-full">
      {revenue > 0 && (
        <span className="mb-1 text-[10px] sm:text-[11px] font-medium text-slate-700 tabular-nums">
          {displayValue}
        </span>
      )}

      <div className="w-full max-w-[18px] sm:max-w-[22px] bg-slate-100 border rounded-sm border-slate-300 h-3/4 relative">
        <div
          className="absolute bottom-0 w-full bg-blue-600 rounded-sm transition-all duration-500"
          style={{ height: `${revenue > 0 ? Math.max(barHeight, 6) : 0}%` }}
        />
      </div>

      <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8 text-slate-500">
      <Database size={22} className="mb-2 text-slate-300" />
      <p className="text-xs sm:text-sm">{message}</p>
    </div>
  );
};

const getMonthlyLabel = (yearMonth: string) => {
  const monthIndex = Number(yearMonth.split("-")[1]) - 1;
  if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return yearMonth;
  }
  return getMonthName(monthIndex).substring(0, 3);
};

const Dashboard = () => {
  const {
    setDashboardData,
    dashboardData,
    activeTab,
    dashboardNeedsRefresh,
    setDashboardNeedsRefresh,
  } = useDataContext();
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const summary: DashboardSummary = dashboardData?.summary ?? EMPTY_SUMMARY;

  const weeklyBars = useMemo<RevenueBar[]>(
    () =>
      (dashboardData?.series.last7DaysSeries ?? []).map((day) => ({
        key: day._id,
        label: formatDayLabel(day._id),
        revenue: day.dailyRevenue,
      })),
    [dashboardData],
  );

  const monthlyBars = useMemo<RevenueBar[]>(
    () =>
      (dashboardData?.series.monthlySeries ?? []).map((month) => ({
        key: month._id,
        label: getMonthlyLabel(month._id),
        revenue: month.monthlyRevenue,
      })),
    [dashboardData],
  );

  const maxWeeklyRevenue = useMemo(
    () => getMaxRevenue(weeklyBars),
    [weeklyBars],
  );
  const maxMonthlyRevenue = useMemo(
    () => getMaxRevenue(monthlyBars),
    [monthlyBars],
  );

  const statCards = useMemo<StatCardItem[]>(
    () => [
      {
        icon: IndianRupee,
        label: "This Month",
        value: `₹${formatCurrency(summary.monthRevenue)}`,
      },
      {
        icon: Truck,
        label: "Total Trips",
        value: summary.trips,
      },
      {
        icon: BarChart3,
        label: "Avg Fare",
        value: `₹${formatCurrency(summary.avgFare)}`,
      },
      {
        icon: TrendingUp,
        label: "This Week",
        value: `₹${formatCurrency(summary.weekRevenue)}`,
      },
    ],
    [summary],
  );

  useEffect(() => {
    if (!dashboardData) {
      setDashboardLoading(true);
      loadDashboard(setDashboardData)
        .catch(() => null)
        .finally(() => setDashboardLoading(false));
    }
  }, [dashboardData, setDashboardData]);

  useEffect(() => {
    if (activeTab === "dashboard" && dashboardNeedsRefresh) {
      setDashboardLoading(true);
      loadDashboard(setDashboardData)
        .catch(() => null)
        .finally(() => {
          setDashboardNeedsRefresh(false);
          setDashboardLoading(false);
        });
    }
  }, [
    activeTab,
    dashboardNeedsRefresh,
    setDashboardData,
    setDashboardNeedsRefresh,
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {dashboardLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={`stat-skeleton-${index}`} />
            ))
          : statCards.map((card) => (
              <StatCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                value={card.value}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-300">
          <div className="px-3 sm:px-4 py-2 border-b border-slate-300">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-700">
              Weekly Revenue
            </h2>
          </div>

          <div className="px-3 sm:px-4 py-4 sm:py-5">
            <div className="flex items-end justify-between h-52 sm:h-64 gap-2 sm:gap-3">
              {dashboardLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={`weekly-skeleton-${index}`}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <Skeleton className="mb-2 h-3 w-10 rounded-sm" />
                    <Skeleton className="w-full max-w-[18px] sm:max-w-[22px] rounded-sm h-32" />
                    <Skeleton className="mt-2 h-3 w-6 rounded-sm" />
                  </div>
                ))
              ) : weeklyBars.length > 0 ? (
                weeklyBars.map((day) => (
                  <RenderBar
                    key={day.key}
                    revenue={day.revenue}
                    max={maxWeeklyRevenue}
                    label={day.label}
                    isWeekly={true}
                  />
                ))
              ) : (
                <EmptyState message="No weekly data available" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-300">
          <div className="px-3 sm:px-4 py-2 border-b border-slate-300">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-700">
              Annual Growth
            </h2>
          </div>

          <div className="px-3 sm:px-4 py-4 sm:py-5 overflow-x-auto">
            <div
              className={`flex items-end justify-between h-52 sm:h-64 gap-2 sm:gap-3 sm:min-w-full ${
                monthlyBars.length > 0 ? "min-w-[480px]" : ""
              }`}
            >
              {dashboardLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={`monthly-skeleton-${index}`}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <Skeleton className="mb-2 h-3 w-10 rounded-sm" />
                    <Skeleton className="w-full max-w-[18px] sm:max-w-[22px] rounded-sm h-32" />
                    <Skeleton className="mt-2 h-3 w-6 rounded-sm" />
                  </div>
                ))
              ) : monthlyBars.length > 0 ? (
                monthlyBars.map((month) => (
                  <RenderBar
                    key={month.key}
                    revenue={month.revenue}
                    max={maxMonthlyRevenue}
                    label={month.label}
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
