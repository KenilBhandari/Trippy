import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  History,
  Trash2,
  Edit,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import type { Trip } from "../../types";
import { useDataContext } from "../../context/TripContext";
import EditModal from "../UI/EditModal";
import { editTrip, deleteTripByID } from "../../api/trips";
import { fetchAndSetTrips } from "../../utils/BasicFetch";
import { formatDate, formatTime } from "../../utils/FormatDate";
import DeleteModal from "../UI/DeleteModal";

interface ViewReportProps {
  trips?: Trip[]; 
  title?: string;
  onBack?: () => void;
}

const ViewReport = ({ title, onBack }: ViewReportProps) => {

  const {
    deletingTrip,
    setDeletingTrip,
    activeTrip,
    setActiveTrip,
    setLast10Trips,
    setRecent25Trips,
    monthlyReport,
    setMonthlyReport
  } = useDataContext();

  const [sortAscending, setSortAscending] = useState(true);


const toggleSort = () => {
  setSortAscending((prev) => !prev);

  setMonthlyReport((prevReport) => [...prevReport].reverse());
};


  const tripsToRender = useMemo(() => {
    return monthlyReport;
  }, [monthlyReport]);

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    const result = await editTrip(updatedTrip);
    if (result?.status === "success")
      fetchAndSetTrips({ setLast10Trips, setRecent25Trips });
  };

  const handleDeleteTrip = async (trip: Trip) => {
    const result = await deleteTripByID(trip._id);
    if (result.data?.status === "success" || result?.data?.isDeleted) {
      fetchAndSetTrips({ setLast10Trips, setRecent25Trips });
    }
  };



return (
  <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
    {/* Header for Report Mode */}
    {onBack && (
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {title && (
            <h2 className="text-lg sm:text-xl font-black text-gray-900">
              {title}
            </h2>
          )}

          <button
            onClick={toggleSort}
            className="flex items-center gap-1 p-1.5 bg-blue-100 rounded-full hover:bg-blue-200 text-blue-600 transition-colors"
            title="Toggle Sort"
          >
            {sortAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>
    )}

    <div className="space-y-2.5 sm:space-y-4">
      {tripsToRender.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-10 sm:p-12 text-center border border-dashed border-gray-200">
          <History
            size={40}
            className="mx-auto mb-4 text-gray-300"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold text-gray-800">
            No trips found
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Try changing the date range
          </p>
        </div>
      ) : (
        tripsToRender.map((trip) => (
          <div
            key={trip._id}
            className="group bg-white rounded-xl sm:rounded-2xl px-3 py-3 sm:p-5 border border-gray-100 sm:hover:border-blue-100 sm:hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
              {/* LEFT */}
              <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                {/* Route */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm sm:text-lg truncate">
                    {trip.startPoint}
                  </span>

                  <ArrowRight size={14} className="text-gray-400 shrink-0" />

                  <span className="font-semibold text-gray-900 text-sm sm:text-lg truncate">
                    {trip.endPoint}
                  </span>
                </div>

                {/* Meta (mobile-friendly) */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-[13px] text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5 sm:bg-gray-50 sm:px-2 sm:py-1 sm:rounded-md">
                    <Calendar size={13} className="text-blue-500" />
                    {formatDate(trip.tripDate)}
                  </div>

                  <div className="flex items-center gap-1.5 sm:bg-gray-50 sm:px-2 sm:py-1 sm:rounded-md">
                    <Clock size={13} className="text-blue-500" />
                    {formatTime(trip.updatedAt)}
                  </div>

                  {trip.returnTrip && (
                    <span className="inline-flex px-1.5 md:py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[10px] sm:text-[11px] font-semibold">
                      Return
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Fare */}
                <div className="text-left sm:text-right">
                  <p className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Fare Paid
                  </p>
                  <div className="text-lg sm:text-2xl font-black text-gray-900 flex items-center">
                    <span className="text-emerald-500 text-base sm:text-lg mr-0.5">
                      ₹
                    </span>
                    {trip.fare}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setActiveTrip(trip)}
                    className="p-2 rounded-md sm:p-2.5 sm:rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingTrip(trip)}
                    className="p-2 rounded-md sm:p-2.5 sm:rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {activeTrip && <EditModal onUpdate={handleUpdateTrip} />}
    {deletingTrip && (
      <DeleteModal
        trip={deletingTrip}
        onDelete={handleDeleteTrip}
        onClose={() => setDeletingTrip(null)}
      />
    )}
  </div>
);


};

export default ViewReport;
