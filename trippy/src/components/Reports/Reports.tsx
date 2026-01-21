import { useState } from "react";
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useDataContext } from "../../context/TripContext";
import { fetchReports } from "../../utils/BasicFetch";
import { MonthlyReportPDF } from "../../utils/MonthlyReportPrint";
import ViewReport from "../ViewReport/ViewReport";

const ReportsTab = () => {
  const { monthlyReport, setMonthlyReport } = useDataContext();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState<{ name: string; index: number } | null>(null);
  const [viewReport, setViewReport] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

const isDataValid = () => {
  if (!monthlyReport.length || !activeMonth) return false;

  return monthlyReport.every((trip) => {
    const d = new Date(trip.tripDate);
    return (
      d.getMonth() === activeMonth.index &&
      d.getFullYear() === selectedYear
    );
  });
};

  const loadReportData = async () => {
    if (!activeMonth) return false;
    if (isDataValid()) return true;

    setIsFetching(true);

    const startOfMonth = new Date(selectedYear, activeMonth.index, 1).getTime();
    const endOfMonth = new Date(selectedYear, activeMonth.index + 1, 0, 23, 59, 59).getTime();
    
    const filter = {
      limit: -1,
      sort: "tripdate_asc",
      dateFrom: startOfMonth,
      dateTo: endOfMonth,
    };
    // console.log(formatDate(startOfMonth), formatDate(endOfMonth));
    
    try {
      await fetchReports(filter, { setMonthlyReport });
      return true;
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      return false;
    } finally {
      setIsFetching(false);
    }
  };

  const handleOpenView = async () => {
    const ready = await loadReportData();
    if (ready) setViewReport(true);
  };

  return (
    <>
      {viewReport && activeMonth ? (
        <div className="w-full mx-auto">
          <ViewReport
            title={`${activeMonth.name} ${selectedYear}`}
            onBack={() => {
              setActiveMonth(null);
              setViewReport(false);
            }}
          />
        </div>
      ) : (
        <div className="max-w-md mx-auto px-2">
          {/* Year Header */}
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Reports
              </h2>
              <div className="h-1 w-6 bg-indigo-500 rounded-full mt-1" />
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setSelectedYear((v) => Math.max(2026, v - 1))}
                disabled={selectedYear <= 2026}
                className={`p-2 rounded-xl transition-all active:scale-90 ${
                  selectedYear <= 2026
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              <div className="flex flex-col items-center px-2 min-w-[56px]">
                <span className="text-[10px] font-black text-indigo-500 uppercase leading-none mb-0.5">
                  Year
                </span>
                <span className="font-bold text-sm tabular-nums text-gray-900 leading-none">
                  {selectedYear}
                </span>
              </div>

              <button
                onClick={() => setSelectedYear((v) => v + 1)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all active:scale-90"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-4">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setActiveMonth({ name: month, index })}
                className="group relative flex flex-col items-center justify-center aspect-square bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 active:scale-95"
              >
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Calendar size={18} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {month}
                </span>
              </button>
            ))}
          </div>

          {/* Month Action Modal */}
          {activeMonth && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
                onClick={() => !isFetching && setActiveMonth(null)}
              />

              <div className="relative bg-white w-full max-w-[300px] rounded-[28px] p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {activeMonth.name}{" "}
                      <span className="text-gray-400 font-light">
                        {selectedYear}
                      </span>
                    </h3>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                      Monthly Report
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveMonth(null)}
                    className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* View Button */}
                  <button
                    onClick={handleOpenView}
                    disabled={isFetching}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all active:scale-95 w-full
                      ${
                        isFetching
                          ? "bg-gray-50 border-gray-100 opacity-60"
                          : "bg-white border-indigo-100 hover:border-indigo-200"
                      }`}
                  >
                    <div className="text-indigo-600">
                      {isFetching ? (
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Eye size={20} strokeWidth={2.5} />
                      )}
                    </div>
                    <span className="text-[11px] font-black text-indigo-600 uppercase">
                      {isFetching ? "Loading" : "View"}
                    </span>
                  </button>

                  {/* PDF Button – smart: show direct download when data ready */}
                  {isDataValid() ? (
                    <PDFDownloadLink
                      document={
                        <MonthlyReportPDF
                          trips={monthlyReport}
                          monthName={activeMonth.name}
                          year={selectedYear}
                        />
                      }
                      fileName={`Report-${activeMonth.name}-${selectedYear}.pdf`}
                      className="w-full"
                    >
                      {({ loading }) => (
                        <button
                          disabled={loading}
                          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white w-full transition-all active:scale-95 shadow-lg shadow-indigo-200"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download size={20} strokeWidth={2.5} />
                          )}
                          <span className="text-[11px] font-bold uppercase">
                            {loading ? "Readying" : "PDF"}
                          </span>
                        </button>
                      )}
                    </PDFDownloadLink>
                  ) : (
                    <button
                      onClick={loadReportData}
                      disabled={isFetching}
                      className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white w-full transition-all active:scale-95 opacity-90 shadow-lg shadow-indigo-200"
                    >
                      {isFetching ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download size={20} strokeWidth={2.5} />
                      )}
                      <span className="text-[11px] font-bold uppercase">
                        {isFetching ? "Fetching" : "Get PDF"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReportsTab;