import { ArrowRight, Calendar, Truck, ArrowUpDown } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { formatDate } from "../../utils/FormatDate";
import React, { useState } from "react";
import type { Trip } from "../../types";
import TripModal from "../UI/TripModal";

const Latest = () => {
  const { last10Trips } = useDataContext();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div className="bg-white border border-slate-300 rounded-lg w-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 bg-slate-200 border-b border-slate-300 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
          Last 10 Trips
        </h2>
      </div>

      <div className="p-4 sm:p-5 bg-white">
        {last10Trips.length === 0 ? (
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

                  <div className="flex items-center gap-2 mt-1 text-[10px] md:text-[11px] font-semibold text-slate-500 uppercase leading-none flex-wrap">
                    {/* Date */}
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{formatDate(trip.tripDate, true)}</span>
                    </div>

                    {/* Number Plate */}
                    {trip.numberPlate && (
                      <div className="flex items-center gap-1 px-1.5 py-[2px] rounded bg-slate-100 text-slate-700 whitespace-nowrap">
                        <Truck size={11} className="text-slate-500" />
                        <span className="font-bold tracking-wide">
                          {trip.numberPlate}
                        </span>
                      </div>
                    )}

                    {/* Return Trip */}
                    {trip.returnTrip && (
                      <div
                        className="flex items-center justify-center w-4 h-4 rounded bg-blue-600 text-white shrink-0"
                        title="Return Trip"
                      >
                        <ArrowUpDown size={9} strokeWidth={3} />
                      </div>
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
