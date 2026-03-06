import React, { useMemo, useState } from "react";
import { ArrowRight, Trash2, Edit, Truck } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import EditModal from "../UI/EditModal";
import { editTrip, deleteTripByID } from "../../api/trips";
import { custFetch, fetchAndSetTrips } from "../../utils/BasicFetch";
import TripFilterBar from "../UI/FilterBar";
import { formatDate } from "../../utils/FormatDate";
import type { Trip, TripFilter } from "../../types";
import DeleteModal from "../UI/DeleteModal";
import TripModal from "../UI/TripModal";
import Skeleton from "../UI/Skeleton";
import ReturnTripBadge from "../UI/ReturnTripBadge";

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
    tripsLoading
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
  <div className="max-w-4xl mx-auto space-y-3">
    <TripFilterBar onFilter={handleFilter} />

    <div className="bg-white border border-slate-300 rounded-lg w-full overflow-hidden">
      {/* Header */}

      <div className="divide-y divide-slate-100">
        {tripsLoading ? (
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`latest-skeleton-${index}`}
                className="flex items-center justify-between gap-3 px-4 py-3 border border-slate-200"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 sm:w-32 rounded-md" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-28 sm:w-36 rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-10 rounded-md" />
                  </div>
                </div>
                <div className="shrink-0 text-right min-w-[70px] space-y-1">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-3 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : tripsToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 rounded-md">
            <Truck size={26} className="text-slate-300 mb-2" />
            <p className="text-slate-400 font-semibold uppercase tracking-wide text-xs">
              No Records
            </p>
          </div>
        ) : (
          tripsToRender.map((trip) => (
            <div
              key={trip._id}
              className="group flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors"
            >
              {/* Left: Route + Meta */}
              <div
                onClick={() => setSelectedTrip(trip)}
                role="button"
                tabIndex={0}
                className="flex-1 min-w-0 cursor-pointer"
              >
                {/* Route */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="truncate text-[13px] sm:text-[15px] font-semibold text-slate-800 sm:text-slate-900">
                    {trip.startPoint}
                  </span>
                  <ArrowRight
                    size={11}
                    className="text-slate-300 sm:text-slate-400 shrink-0"
                  />
                  <span className="truncate text-[13px] sm:text-[15px] font-semibold text-slate-800 sm:text-slate-900">
                    {trip.endPoint}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 sm:text-slate-500 font-medium tabular-nums">
                    {formatDate(trip.tripDate)}
                  </span>

                  {trip.numberPlate && (
                    <>
                      <span className="text-slate-300 select-none">·</span>
                      <div className="inline-flex items-center gap-[3px] px-1.5 py-[3px] rounded-sm border border-slate-200 bg-slate-50 sm:border-slate-300 sm:bg-slate-100">
                        <Truck size={10} className="text-slate-500 shrink-0" />
                        <span className="text-[10px] sm:text-[10px] font-bold text-slate-600 sm:text-slate-600 tracking-widest uppercase leading-[4px]">
                          {trip.numberPlate}
                        </span>
                      </div>
                    </>
                  )}

                  {trip.returnTrip && (
                    <>
                      <span className="text-slate-200 sm:text-slate-300 select-none leading-none">
                        ·
                      </span>
                      <ReturnTripBadge />
                    </>
                  )}
                </div>
              </div>

              {/* Right: Fare + Divider + Actions */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Fare */}
                <div
                  onClick={() => setSelectedTrip(trip)}
                  className="cursor-pointer text-right min-w-[44px] sm:min-w-[58px]"
                >
                  <div className="text-[15px] sm:text-[17px] font-bold text-slate-800 sm:text-slate-900 leading-none tabular-nums">
                    ₹{trip.fare}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 sm:text-slate-500 uppercase tracking-widest mt-[3px]">
                    Fare
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-7 sm:h-8 bg-slate-200 shrink-0" />

                {/* Actions */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTrip(trip);
                    }}
                    className="p-1.5 sm:p-2 rounded-md text-slate-300 sm:text-slate-400 hover:text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} className="sm:hidden" />
                    <Edit size={16} className="hidden sm:block" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingTrip(trip);
                    }}
                    className="p-1.5 sm:p-2 rounded-md text-slate-300 sm:text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} className="sm:hidden" />
                    <Trash2 size={16} className="hidden sm:block" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
