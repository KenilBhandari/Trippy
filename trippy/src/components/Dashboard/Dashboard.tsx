import React, { useState, useEffect } from "react";
import { Search, Calendar, ChevronDown, X, Check, MapPin } from "lucide-react";

interface FilterProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSearchQuery?: (query: string) => void; // Optional if you want to filter by text too
}

const TripFilterBar = ({ setStartDate, setEndDate }: FilterProps) => {
  const [search, setSearch] = useState("");
  const [quickDate, setQuickDate] = useState("recent");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showQuickDate, setShowQuickDate] = useState(false);

  const options = [
    { value: "recent", label: "Recent" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" }
  ];

  // Sync internal state to Parent component
  useEffect(() => {
    if (fromDate || toDate) {
      setStartDate(fromDate);
      setEndDate(toDate);
    } else {
      // Handle Quick Date logic
      const now = new Date();
      let start = "";
      if (quickDate === "today") {
        start = now.toISOString().split("T")[0];
      } else if (quickDate === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        start = weekAgo.toISOString().split("T")[0];
      }
      // Note: "recent" (default) usually means no date filter/limit to 25
      setStartDate(quickDate === "recent" ? "" : start);
      setEndDate(""); 
    }
  }, [quickDate, fromDate, toDate, setStartDate, setEndDate]);

  const handleReset = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setShowCustomDate(false);
    setQuickDate("recent");
  };

  const hasActiveFilters = search || fromDate || quickDate !== "recent";

  return (
    <div className="w-full font-sans">
      <div className="relative bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex items-center h-14 sm:h-16">
          
          {/* 1. Quick Date Dropdown */}
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
                className={`text-gray-400 transition-transform duration-300 ${showQuickDate ? "rotate-180" : ""}`}
              />
            </button>

            {showQuickDate && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowQuickDate(false)} />
                <div className="absolute top-full mt-2 left-0 w-44 bg-white border border-gray-200 shadow-xl rounded-xl p-1 z-20">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setQuickDate(opt.value);
                        setFromDate(""); // Clear custom dates when picking quick option
                        setToDate("");
                        setShowQuickDate(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                        quickDate === opt.value ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                      {quickDate === opt.value && <Check size={14} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2. Search Segment */}
          <div className="flex flex-1 items-center px-2 sm:px-4 min-w-0">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination..."
              className="w-full px-2 sm:px-3 bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* 3. Custom Date Toggle */}
          <div className="flex items-center gap- px-3 shrink-0">
            <button
              onClick={() => {
                setShowCustomDate(!showCustomDate);
                setShowQuickDate(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                showCustomDate || fromDate ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-end">
                <span className={`text-[7px] font-black uppercase leading-none mb-1 ${
                  showCustomDate || fromDate ? "text-blue-400" : "text-gray-400"
                }`}>Dates</span>
                <Calendar size={15} />
              </div>
            </button>
            {hasActiveFilters && (
              <button onClick={handleReset} className="p-2 text-gray-300 hover:text-red-500 rounded-xl">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Input Panel */}
        {showCustomDate && (
          <div className="border-t border-gray-100 px-5 py-2.5 bg-gray-50/30 rounded-b-2xl">
            <div className="flex items-center gap-3 max-w-sm">
              <div className="flex flex-col gap-0.5 flex-1">
                <label className="text-[9px] text-gray-400">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-white px-2.5 py-1.5 rounded-lg text-[11px] border border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                <label className="text-[9px] text-gray-400">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-white px-2.5 py-1.5 rounded-lg text-[11px] border border-gray-200"
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