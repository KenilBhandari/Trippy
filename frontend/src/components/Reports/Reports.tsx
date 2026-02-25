import React, { useMemo, useState } from "react";
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { useDataContext } from "../../context/TripContext";
import { fetchReports } from "../../utils/BasicFetch";
import { MonthlyReportPDF } from "../../utils/MonthlyReportPrint";
import ViewReport from "../ViewReport/ViewReport";

const ReportsTab = () => {
  const {
    monthlyReport,
    setMonthlyReport,
    currentMonthlyReport,
    setCurrentMonthlyReport,
  } = useDataContext();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [viewReport, setViewReport] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showPdfConfig, setShowPdfConfig] = useState(false);
  const [pdfHeaderDetails, setPdfHeaderDetails] = useState({
    ownerName: "TRIPPY TECHNOLOGIES",
    businessLine: "Web Services Provider",
    address: "Vadodara, Gujarat",
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const isDataValid = useMemo(() => {
    if (!activeMonth || !currentMonthlyReport) return false;
    return (
      currentMonthlyReport.month === activeMonth.index &&
      currentMonthlyReport.year === selectedYear
    );
  }, [currentMonthlyReport, activeMonth, selectedYear]);

  const loadReportData = async () => {
    if (!activeMonth) return false;
    if (isDataValid) return true;

    setIsFetching(true);

const startOfMonth = new Date(
  `${selectedYear}-${String(activeMonth.index + 1).padStart(2, "0")}-01T00:00:00+05:30`
).getTime();
const lastDay = new Date(selectedYear, activeMonth.index + 1, 0).getDate();
const endOfMonth = new Date(
  `${selectedYear}-${String(activeMonth.index + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}T23:59:59.999+05:30`
).getTime();



    const filter = {
      limit: -1,
      sort: "tripdate_asc",
      dateFrom: startOfMonth,
      dateTo: endOfMonth,
    };

    try {
      const report = await fetchReports(filter, { setMonthlyReport });
      if (Array.isArray(report) && report.length === 0) {
        console.log("No reports found (Empty Array)");
        return;
      }
      setCurrentMonthlyReport({ month: activeMonth.index, year: selectedYear });

      return true;
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      return false;
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!activeMonth || !isDataValid) return;

    try {
      setIsFetching(true);

      const blob = await pdf(
        <MonthlyReportPDF
          trips={monthlyReport}
          monthName={activeMonth.name}
          year={selectedYear}
          headerDetails={pdfHeaderDetails}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report-${activeMonth.name}-${selectedYear}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed", err);
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
        <div className="max-w-md mx-auto ">
          <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-300 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                  Reports
                </h2>
                <p className="text-[9px] text-slate-500 tracking-wider mt-0.5 uppercase">
                  Select a month
                </p>
              </div>

              <div className="flex items-center bg-white border border-slate-300 rounded divide-x divide-slate-200">
                <button
                  onClick={() => setSelectedYear((v) => Math.max(2026, v - 1))}
                  disabled={selectedYear <= 2026}
                  className="p-2 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft
                    size={13}
                    strokeWidth={3}
                    className="text-slate-600"
                  />
                </button>
                <div className="px-4 py-1.5 flex flex-col items-center min-w-[72px]">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Year
                  </span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums leading-none">
                    {selectedYear}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedYear((v) => v + 1)}
                  className="p-2 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight
                    size={13}
                    strokeWidth={3}
                    className="text-slate-600"
                  />
                </button>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-blue-100 border border-blue-200">
                    <FileText size={13} className="text-blue-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.16em]">
                      PDF Header (Used In Download)
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pdfHeaderDetails.ownerName} • {pdfHeaderDetails.businessLine}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPdfConfig(true)}
                  className="shrink-0 px-2.5 py-1.5 text-[10px] font-bold border border-slate-300 rounded-md bg-white hover:bg-slate-100 text-slate-700 uppercase tracking-wider transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>

            {/* Month Grid — same cols on all screens */}
            <div className="grid grid-cols-3 bg-slate-200 gap-px">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => setActiveMonth({ name: month, index })}
                  className="flex flex-col items-center justify-center py-7 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors group"
                >
                  <div className="p-2 rounded border border-slate-200 bg-blue-50 group-hover:border-slate-300 group-hover:bg-white transition-all mb-2.5">
                    <Calendar
                      size={18}
                      className="text-blue-600 group-hover:text-slate-600 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] md:text-[12px] font-bold text-slate-500 group-hover:text-slate-800 uppercase tracking-widest transition-colors">
                    {month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal */}
          {showPdfConfig && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => setShowPdfConfig(false)}
              />
              <div className="relative bg-white w-full max-w-md rounded-lg border border-slate-300 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 bg-white border-b border-slate-300 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold tracking-wide text-slate-900 uppercase leading-none">
                      PDF Header Details
                    </h3>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">
                      Used in monthly report download
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPdfConfig(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={pdfHeaderDetails.ownerName}
                      onChange={(e) =>
                        setPdfHeaderDetails((prev) => ({
                          ...prev,
                          ownerName: e.target.value,
                        }))
                      }
                      placeholder="Enter name"
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Business
                    </label>
                    <input
                      type="text"
                      value={pdfHeaderDetails.businessLine}
                      onChange={(e) =>
                        setPdfHeaderDetails((prev) => ({
                          ...prev,
                          businessLine: e.target.value,
                        }))
                      }
                      placeholder="Enter business line"
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Address
                    </label>
                    <input
                      type="text"
                      value={pdfHeaderDetails.address}
                      onChange={(e) =>
                        setPdfHeaderDetails((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Enter address"
                      className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPdfConfig(false)}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMonth && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => !isFetching && setActiveMonth(null)}
              />
              <div className="relative bg-white w-full max-w-[300px] rounded-lg border border-slate-300 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 bg-white border-b border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h3 className="text-sm font-bold tracking-wide text-slate-900 uppercase leading-none">
                        {activeMonth.name}{" "}
                        <span className="text-slate-400 font-medium">
                          {selectedYear}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
                        Monthly Report
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveMonth(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2">
                  {/* View (Neutral) */}
                  <button
                    onClick={handleOpenView}
                    disabled={isFetching}
                    className="flex flex-col items-center gap-2 py-6 bg-white hover:bg-slate-50 transition-colors group disabled:opacity-50"
                  >
                    {isFetching ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye
                        size={18}
                        className="text-slate-400 group-hover:text-slate-600 transition-colors"
                      />
                    )}
                    <div className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 uppercase tracking-widest">
                      {isFetching ? "Loading" : "View"}
                    </div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-wide -mt-1">
                      Preview
                    </div>
                  </button>

                  {/* Export (Primary Concern) */}
                  <button
                    onClick={isDataValid ? handleDownloadPDF : loadReportData}
                    disabled={isFetching}
                    className="flex flex-col items-center gap-2 py-6 border-l border-slate-200 hover:bg-slate-50 transition-colors group disabled:opacity-50"
                  >
                    {isFetching ? (
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download
                        size={18}
                        className="text-blue-600 group-hover:text-slate-600 transition-colors"
                      />
                    )}
                    <div className="text-[10px] font-bold text-blue-600 group-hover:text-slate-800 uppercase tracking-widest">
                      {isFetching
                        ? "Working"
                        : isDataValid
                          ? "Download"
                          : "Generate"}
                    </div>
                    <div className="text-[8px] text-blue-600 group-hover:text-slate-800 uppercase tracking-wide -mt-1">
                      Export PDF
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(ReportsTab);
