import { useMemo, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  History,
  Trash2,
  Edit,
} from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import EditModal from "../UI/EditModal";
import { editTrip, deleteTripByID } from "../../api/trips";
import { custFetch, fetchAndSetTrips } from "../../utils/BasicFetch";
import TripFilterBar from "../UI/FilterBar";
import { formatDate, formatTime } from "../../utils/FormatDate";
import type { Trip, TripFilter } from "../../types";
import DeleteModal from "../UI/DeleteModal";
import { loadDashboard } from "../../api/dashboard.service";

const TripManagement = () => {
  const {
    deletingTrip,
    setDeletingTrip,
    activeTrip,
    setActiveTrip,
    setLast10Trips,
    setRecent25Trips,
    recent25Trips,
    setFilteredTrips,
    filteredTrips,
    quickDate,
    search,
    fromDate,
    toDate,
    setDashboardData
  } = useDataContext();

  const tripsToRender = useMemo(() => {
    if (quickDate === "recent" && !search && !fromDate && !toDate) {
      return recent25Trips;
    }
    const source = filteredTrips;
    return source;
  }, [recent25Trips, filteredTrips]);

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const result = await editTrip(updatedTrip);

      if (result?.status === "success") {
        await fetchAndSetTrips({
          setLast10Trips,
          setRecent25Trips,
        });
        await loadDashboard(setDashboardData)
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Failed to update trip", err);
      throw err;
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    try {
      const result = await deleteTripByID(trip._id);

      if (
        result.status === "success" ||
        result.data?.status === "success" ||
        result?.data?.isDeleted
      ) {
        await fetchAndSetTrips({
          setLast10Trips,
          setRecent25Trips,
        });
        await loadDashboard(setDashboardData)
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error("Failed to delete trip", err);
      throw err;
    }
  };

  const handleFilter = async (filterBar: TripFilter) => {
    const filters = {
      limit: filterBar.limit ?? 100,
      sort: filterBar.sort ?? "created",
      recent: filterBar.recent,
      searchString: filterBar.searchString,
      dateFrom: filterBar.dateFrom,
      dateTo: filterBar.dateTo,
    };
    try {
      const data = await custFetch(filters, { setFilteredTrips });
      return data;
    } catch (err) {
      console.error("Failed to apply filters", err);
    }
  };


  useEffect(() => {
    fetchAndSetTrips({
      setLast10Trips,
      setRecent25Trips,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <TripFilterBar onFilter={handleFilter} />

      <div className="space-y-4">
        {tripsToRender.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-12 text-center border border-dashed border-gray-200">
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
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                {/* Left: Route + dates */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900 text-lg">
                      {trip.startPoint}
                    </span>
                    <ArrowRight size={16} className="text-gray-400" />
                    <span className="font-semibold text-gray-900 text-lg">
                      {trip.endPoint}
                    </span>
                    {trip.returnTrip && (
                      <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                        Return
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[13px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Calendar size={14} className="text-blue-500" />
                      {formatDate(trip.tripDate)}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Clock size={14} className="text-blue-500" />
                      {formatTime(trip.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Right: Fare + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Fare Paid
                    </p>
                    <div className="text-2xl font-black text-gray-900 flex items-center">
                      <span className="text-emerald-500 text-lg mr-0.5">₹</span>
                      {trip.fare}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTrip(trip)}
                      className="p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingTrip(trip)}
                      className="p-2.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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

export default TripManagement;
