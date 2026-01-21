import React, { useEffect, useState, Fragment } from "react";
import { Search, Calendar, ChevronDown, X, Check } from "lucide-react";
import { toTimestamp } from "../../utils/FormatDate";
import { useDataContext } from "../../context/TripContext";
import type { TripFilter } from "../../types";

type TripFilterBarProps = {
  onFilter: (filters: TripFilter) => void;
};

const TripFilterBar: React.FC<TripFilterBarProps> = ({ onFilter }) => {
  const {
    quickDate,
    setQuickDate,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useDataContext();

  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showQuickDate, setShowQuickDate] = useState(false);

  const options = [
    { value: "recent", label: "Recent" },
    { value: "today", label: "Today" },
    { value: "month", label: "This month" },
  ];

  const buildTripFilter = (): TripFilter => ({
    limit: 100,
    sort: fromDate || toDate ? "tripdate_asc" : "tripdate_desc",
    recent: quickDate,
    searchString: search.trim() || undefined,
    dateFrom: fromDate ? toTimestamp(fromDate) : undefined,
    dateTo: toDate ? toTimestamp(toDate) : undefined,
  });

  const handleReset = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setShowCustomDate(false);
    setQuickDate("recent");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilter(buildTripFilter());
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fromDate, toDate]);

  const hasActiveFilters = !!search || !!fromDate || quickDate !== "recent";

  return (
    <div className="w-full font-sans">
      {/* Main Filter Bar */}
      <div className="relative bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex items-center h-14 sm:h-16">
          {/* Quick Date Selector */}
          <div className="relative h-full shrink-0">
            <button
              onClick={() => {
                setShowQuickDate(!showQuickDate);
                setShowCustomDate(false);
              }}
              className="flex items-center h-full px-5 sm:px-6 gap-2.5 hover:bg-gray-50 transition-colors rounded-l-2xl border-r border-gray-100 group"
            >
              <span className="text-xs font-bold text-gray-900">
                {options.find((o) => o.value === quickDate)?.label}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-300 ${
                  showQuickDate ? "rotate-180" : ""
                }`}
              />
            </button>

            {showQuickDate && (
              <Fragment>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowQuickDate(false)}
                />
                <div className="absolute top-full mt-2 left-0 w-44 bg-white border border-gray-200 shadow-xl rounded-xl p-1 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setQuickDate(opt.value);
                        setShowQuickDate(false);
                        onFilter({
                          ...buildTripFilter(),
                          recent: opt.value,
                          dateFrom: undefined,
                          dateTo: undefined,
                        });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        quickDate === opt.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                      {quickDate === opt.value && <Check size={14} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </Fragment>
            )}
          </div>

          {/* Search Input */}
          <div className="flex flex-1 items-center px-2 sm:px-4 min-w-0">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 sm:px-3 bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Custom Date Selector & Reset */}
          <div className="flex items-center gap-2 px-3 shrink-0">
            <button
              onClick={() => {
                setShowCustomDate(!showCustomDate);
                setShowQuickDate(false);
              }}
              className={`flex items-center gap-2 px-2 py-2 md:px-3 rounded-xl transition-all duration-300 ${
                showCustomDate || fromDate
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50 border-2"
              }`}
            >
              <Calendar size={15} />
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="p-2 text-red-500 bg-red-50 rounded-xl transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Inputs */}
        {showCustomDate && (
          <div className="border-t border-gray-100 px-5 py-4 bg-gradient-to-b from-gray-50/50 to-white rounded-b-2xl animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-center md:justify-start gap-3 max-w-sm">
              <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 w-fit">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2.5 bg-white [&::-webkit-calendar-picker-indicator]:brightness-0 rounded-xl text-sm font-medium text-gray-700 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none shadow-sm hover:border-gray-300 appearance-none"
                />
                <span className="text-gray-400 font-semibold select-none">→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2.5 bg-white [&::-webkit-calendar-picker-indicator]:brightness-0 rounded-xl text-sm font-medium text-gray-700 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none shadow-sm hover:border-gray-300 appearance-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripFilterBar;
