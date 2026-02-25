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
        dateTo: toDate ? toTimestamp(toDate, true) : undefined,
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
        >
          <Calendar size={12} className="text-slate-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-wide">
            {value
              ? new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Select date"}
          </span>
        </button>
      }
    />
  );

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-300 rounded-lg">
        {/* Main row */}
        <div className="flex items-center h-11 sm:h-12">
          {/* Quick Date Selector */}
          <div className="relative h-full shrink-0">
            <button
              onClick={() => {
                setShowQuickDate(!showQuickDate);
                setShowCustomDate(false);
              }}
              className="flex items-center h-full px-4 gap-2 hover:bg-slate-50 transition-colors border-r border-slate-200"
            >
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
                {options.find((o) => o.value === quickDate)?.label}
              </span>
              <ChevronDown
                size={13}
                className={`text-slate-400 transition-transform duration-200 ${showQuickDate ? "rotate-180" : ""}`}
              />
            </button>

            {showQuickDate && (
              <Fragment>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowQuickDate(false)}
                />
                <div className="absolute top-full mt-1.5 left-0 w-40 bg-white border border-slate-200 shadow-lg rounded-lg p-1 z-20">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[11px] font-bold uppercase tracking-wide transition-colors ${quickDate === opt.value ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      {opt.label}
                      {quickDate === opt.value && (
                        <Check
                          size={12}
                          strokeWidth={2.5}
                          className="text-slate-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </Fragment>
            )}
          </div>

          {/* Search */}
          <div className="flex flex-1 items-center px-3 sm:px-4 min-w-0 gap-2">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search trips..."
              className="w-full bg-transparent border-none focus:ring-0 text-[13px] sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 px-3 shrink-0 border-l border-slate-200">
            <button
              onClick={() => {
                setShowCustomDate(!showCustomDate);
                setShowQuickDate(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wide ${showCustomDate || fromDate ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Calendar size={13} />
              <span className="hidden sm:inline">Date</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center px-2.5 py-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Inputs */}
        {showCustomDate && (
          <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <DateButtonPicker value={fromDate} onChange={setFromDate} />
              <ArrowRight size={12} className="text-slate-400 shrink-0" />
              <DateButtonPicker value={toDate} onChange={setToDate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TripFilterBar);
