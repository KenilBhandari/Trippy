import { useMemo, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  History,
  Trash2,
  Edit,
} from "lucide-react";

import type { Trip, TripFilter } from "../../types";
import { useDataContext } from "../../context/TripContext";
import EditModal from "../UI/EditModal";
import { editTrip, deleteTripByID } from "../../api/trips";
import { custFetch, fetchAndSetTrips } from "../../utils/BasicFetch";
import { formatDate, formatTime } from "../../utils/FormatDate";

const ViewTrips = () => {
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
  } = useDataContext();

  const tripsToRender = useMemo(() => {
    if (quickDate === "recent" && !search && !fromDate && !toDate) {
      return recent25Trips;
    }
    return filteredTrips;
  }, [recent25Trips, filteredTrips, quickDate, search, fromDate, toDate]);

  useEffect(() => {
    fetchAndSetTrips({ setLast10Trips, setRecent25Trips });
  }, []);

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const result = await editTrip(updatedTrip);
      if (result?.status === "success") {
        fetchAndSetTrips({ setLast10Trips, setRecent25Trips });
      }
    } catch (err) {
      console.error("Failed to fetch trips", err);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    try {
      const result = await deleteTripByID(trip._id);
      if (result?.data?.status === "success" || result?.data?.isDeleted) {
        fetchAndSetTrips({ setLast10Trips, setRecent25Trips });
      }
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  };

  const handleFilter = async (filterBar: TripFilter) => {
    const filters: TripFilter = {
      limit: filterBar.limit ?? 100,
      sort: filterBar.sort ?? "created",
      recent: filterBar.recent,
      searchString: filterBar.searchString,
      dateFrom: filterBar.dateFrom,
      dateTo: filterBar.dateTo,
    };

    custFetch(filters, { setFilteredTrips });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="space-y-4">
        {tripsToRender.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <History size={40} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-800">No trips found</h3>
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
              {/* UI unchanged */}
            </div>
          ))
        )}
      </div>

      {activeTrip && <EditModal onUpdate={handleUpdateTrip} />}

      {deletingTrip && (
        <div className="fixed -inset-8 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeletingTrip(null)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900">Delete trip?</h3>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeletingTrip(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTrip(deletingTrip);
                  setDeletingTrip(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTrips;
