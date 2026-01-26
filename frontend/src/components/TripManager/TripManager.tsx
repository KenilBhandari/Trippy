import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  History,
  Trash2,
  Edit,
  Truck,
} from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import EditModal from "../UI/EditModal";
import { editTrip, deleteTripByID } from "../../api/trips";
import { custFetch, fetchAndSetTrips } from "../../utils/BasicFetch";
import TripFilterBar from "../UI/FilterBar";
import { formatDate, formatTime } from "../../utils/FormatDate";
import type { Trip, TripFilter } from "../../types";
import DeleteModal from "../UI/DeleteModal";
import TripModal from "../UI/TripModal";

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
    setDashboardNeedsRefresh,
  } = useDataContext();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const tripsToRender = useMemo(() => {
    const noFilters = quickDate === "recent" && !search && !fromDate && !toDate;

    return noFilters ? recent25Trips : filteredTrips;
  }, [recent25Trips, filteredTrips, quickDate, search, fromDate, toDate]);

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const result = await editTrip(updatedTrip);

      if (result?.status === "success") {
        await fetchAndSetTrips({
          setLast10Trips,
          setRecent25Trips,
        });
        setDashboardNeedsRefresh(true);
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
        setDashboardNeedsRefresh(true);
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

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
      <TripFilterBar onFilter={handleFilter} />

      <div className="space-y-2 sm:space-y-3">
        {tripsToRender.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 sm:p-12 text-center border border-dashed border-gray-200">
            <History
              size={36}
              className="mx-auto mb-3 text-gray-300"
              strokeWidth={1.5}
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              No trips found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Try changing the date range
            </p>
          </div>
        ) : (
          tripsToRender.map((trip) => (
            <div
              key={trip._id}
              onClick={() => setSelectedTrip(trip)}
              role="button"
              tabIndex={0}
              className="group bg-white rounded-xl cursor-pointer active:scale-[0.98] sm:rounded-2xl p-2.5 sm:p-5 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all"
            >
              {/* Trip Manager */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                {/* LEFT: Route & Meta */}
                <div className="flex-1 min-w-0">
                  {/* Route & Fare (Fare visible on mobile here) */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold sm:font-semibold text-gray-900 text-sm sm:text-lg truncate">
                        {trip.startPoint}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-gray-400 shrink-0"
                      />
                      <span className="font-bold sm:font-semibold text-gray-900 text-sm sm:text-lg truncate">
                        {trip.endPoint}
                      </span>
                    </div>

                    {/* Fare: Mobile only */}
                    <div className="sm:hidden font-[1000] text-lg text-gray-900">
                      <span className="text-emerald-600 text-base mr-0.5">
                        ₹
                      </span>
                      {trip.fare}
                    </div>
                  </div>

                  {/* Meta Info + Desktop Inline Number Plate */}
                  {/* Meta Info + Desktop Inline Number Plate */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[13px] font-medium">
                    {/* Date */}
                    <div className="flex items-center gap-1 sm:bg-gray-50 sm:px-2 sm:py-1 sm:rounded-md">
                      <Calendar size={12} className="text-blue-500" />
                      {formatDate(trip.tripDate)}
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 sm:bg-gray-50 sm:px-2 sm:py-1 sm:rounded-md">
                      <Clock size={12} className="text-blue-500" />
                      {formatTime(trip.updatedAt)}
                    </div>

                    {/* Desktop Inline Number Plate */}
                    {trip.numberPlate && (
                      <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 w-fit font-black">
                        <Truck size={11} className="text-blue-600 shrink-0" />
                        <span className="text-[11px] text-blue-700 tracking-wider">
                          {trip.numberPlate}
                        </span>
                      </div>
                    )}

                    {/* Return Badge */}
                    {trip.returnTrip && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[10px] sm:text-[11px] font-bold">
                        Return
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT: Fare (PC) & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                  {/* Number Plate – Mobile only */}
                  {trip.numberPlate && (
                    <div className="sm:hidden flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                      <Truck size={11} className="text-blue-500 shrink-0" />
                      <span className="text-[10px] font-black text-blue-700 tracking-wider">
                        {trip.numberPlate}
                      </span>
                    </div>
                  )}

                  {/* Fare: Desktop only */}
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                      Fare Paid
                    </p>
                    <div className="text-2xl font-black text-gray-900">
                      <span className="text-emerald-500 text-lg mr-0.5">₹</span>
                      {trip.fare}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 sm:gap-2 ml-auto sm:ml-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTrip(trip);
                      }}
                      className="p-2 py-1.5 sm:p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTrip(trip);
                      }}
                      className="p-2 py-1.5 sm:p-2.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
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
      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          isOpen={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};

export default React.memo(TripManagement);
