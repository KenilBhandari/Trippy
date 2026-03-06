import { ArrowRight, Calendar, Truck } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { formatDate } from "../../utils/FormatDate";
import React, { useState } from "react";
import type { Trip } from "../../types";
import TripModal from "../UI/TripModal";
import Skeleton from "../UI/Skeleton";
import ReturnTripBadge from "../UI/ReturnTripBadge";

const Latest = () => {
  const { last10Trips, tripsLoading } = useDataContext();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div className="bg-white border border-slate-300 rounded-lg w-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 bg-white border-b border-slate-300 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
          Last 10 Trips
        </h2>
      </div>

      <div className="p-4 sm:p-5 bg-white">
        {tripsLoading ? (
          <div className="space-y-2">
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
        ) : last10Trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 rounded-md">
            <Truck size={26} className="text-slate-300 mb-2" />
            <p className="text-slate-400 font-semibold uppercase tracking-wide text-xs">
              No Records
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {last10Trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => setSelectedTrip(trip)}
                className="flex items-center justify-between cursor-pointer gap-3 px-4 py-3 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition"
              >
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-sm md:text-base font-semibold text-slate-900 truncate">
                    <span className="truncate">{trip.startPoint}</span>

                    <ArrowRight
                      size={14}
                      className="mx-2 text-slate-400 shrink-0"
                    />

                    <span className="truncate">{trip.endPoint}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] md:text-[11px] font-semibold text-slate-500 uppercase leading-none flex-wrap">
                    {/* Date */}
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{formatDate(trip.tripDate, true)}</span>
                    </div>

                    {/* Number Plate */}
                    {trip.numberPlate && (
                      <div className="flex items-center gap-1 px-1.5 py-[2px] bg-slate-100 text-slate-700 whitespace-nowrap">
                        <Truck size={11} className="text-slate-500" />
                        <span className="text-[10px] sm:text-[10px] font-bold text-slate-600 sm:text-slate-600 tracking-widest uppercase leading-[4px]">
                          {trip.numberPlate}
                        </span>
                      </div>
                    )}

                    {/* Return Trip */}
                    {trip.returnTrip && (
                      <ReturnTripBadge />
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="shrink-0 text-right min-w-[70px]">
                  <div className="text-base font-bold text-slate-900">
                    ₹{trip.fare}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Fare
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default React.memo(Latest);
