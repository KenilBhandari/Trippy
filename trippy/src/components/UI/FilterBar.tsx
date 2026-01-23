import React, { useEffect, useState, Fragment } from "react";
import { Search, Calendar, ChevronDown, X, Check, ArrowRight } from "lucide-react";
import { toTimestamp } from "../../utils/FormatDate";
import { useDataContext } from "../../context/TripContext";
import type { TripFilter } from "../../types";
import DatePicker from "react-datepicker";

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
  const [localSearch, setLocalSearch] = useState(search);


  const options = [
    { value: "recent", label: "Recent" },
    { value: "today", label: "Today" },
    { value: "month", label: "This month" },
  ];


  const handleReset = () => {
    setSearch("");
    setLocalSearch("");
    setFromDate("");
    setToDate("");
    setShowCustomDate(false);
    setQuickDate("recent");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = localSearch.trim();

      onFilter({
        limit: 100,
        sort: fromDate || toDate ? "tripdate_asc" : "tripdate_desc",
        recent: quickDate,
        searchString: trimmed || undefined,
        dateFrom: fromDate ? toTimestamp(fromDate) : undefined,
        dateTo: toDate ? toTimestamp(toDate) : undefined,
      });

      setSearch(trimmed);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, fromDate, toDate, quickDate]);

  const hasActiveFilters = !!search || !!fromDate || quickDate !== "recent";

  const DateButtonPicker = ({
    value,
    onChange,
    maxDate = new Date(),
  }: {
    value: string | null;
    onChange: (val: string) => void;
    maxDate?: Date;
  }) => (
    <DatePicker
      selected={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        if (date) onChange(date.toISOString().split("T")[0]);
      }}
      maxDate={maxDate}
      popperPlacement="bottom-start"
      customInput={
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl text-sm font-medium text-gray-700 border-2 border-gray-200 shadow-sm hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <span className="text-blue-500 text-base">●</span>
          {value
            ? new Date(value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Select date"}
        </button>
      }
    />
  );

  return (
    <div className="w-full font-sans">
      {/* Main Filter Bar */}
      <div className="relative bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex items-center h-12 sm:h-16">
          {/* Quick Date Selector */}
          <div className="relative h-full shrink-0">
            <button
              onClick={() => {
                setShowQuickDate(!showQuickDate);
                setShowCustomDate(false);
              }}
              className="flex items-center h-full md:px-5 px-4 gap-2 md:gap-2.5 hover:bg-gray-50 transition-colors rounded-l-2xl border-r border-gray-100 group"
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
                        const filter = {
                          limit: 100,
                          sort: "tripdate_desc",
                          recent: opt.value,
                          searchString: localSearch.trim() || undefined,
                          dateFrom: undefined,
                          dateTo: undefined,
                        };

                        setQuickDate(opt.value);
                        setFromDate("");
                        setToDate("");
                        setShowQuickDate(false);

                        if (opt.value !== "recent") {
                          onFilter(filter);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        quickDate === opt.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                      {quickDate === opt.value && (
                        <Check size={14} strokeWidth={2.5} />
                      )}
                    </button>
                  ))}
                </div>
              </Fragment>
            )}
          </div>

          {/* Search Input */}
          <div className="flex flex-1 items-center md:px-2 px-4 min-w-0">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
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
              <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 w-fit">
                <DateButtonPicker value={fromDate} onChange={setFromDate} />

                <span className="text-gray-400 font-semibold select-none">
                  <ArrowRight size={14}/>
                </span>

                <DateButtonPicker value={toDate} onChange={setToDate} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TripFilterBar);
