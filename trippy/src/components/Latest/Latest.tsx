import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { formatDate, formatTime } from "../../utils/FormatDate";
import React from "react";

const Latest = () => {
  const { last10Trips } = useDataContext();

return (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full max-w-full">
    <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Last 10 Trips</h2>

    {last10Trips.length === 0 ? (
      <p className="text-gray-500 text-center py-10 text-sm">No trips yet</p>
    ) : (
      <div className="space-y-3">
        {last10Trips.map((trip) => (
          <div  
            key={trip._id}
            className="group flex items-center justify-between gap-3 p-2 md:p-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50 hover:border-blue-100 transition-all w-full overflow-hidden"
          >
            {/* Left Section: Routes & Meta */}
            <div className="flex-1 min-w-0">
              {/* Route Line */}
              <div className="flex items-center font-extrabold text-gray-900 text-[14px] sm:text-[15px] mb-1.5 min-w-0">
                <span className="truncate max-w-[45%] shrink-0">{trip.startPoint}</span>
                <ArrowRight
                  size={14}
                  className="mx-2 text-gray-400 shrink-0 opacity-70"
                />
                <span className="truncate">{trip.endPoint}</span>
              </div>

              {/* Combined Meta Info Row */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                {/* Date */}
                <div className="flex items-center text-[10px] sm:text-[11px] font-semibold text-gray-500 shrink-0">
                  <Calendar size={11} className="mr-1 text-gray-400 shrink-0" />
                  <span className="whitespace-nowrap">{formatDate(trip.tripDate)}</span>
                </div>

                {/* Separator Dot */}
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 shrink-0" />

                {/* Time */}
                <div className="flex items-center text-[10px] sm:text-[11px] font-semibold text-gray-500 shrink-0">
                  <Clock size={11} className="mr-1 text-gray-400 shrink-0" />
                  <span className="whitespace-nowrap">{formatTime(trip.createdAt)}</span>
                </div>

                {/* Return Badge - Clean and Small */}
                {trip.returnTrip && (
                  <>
                    <span className="hidden xs:block w-0.5 h-0.5 rounded-full bg-gray-300 shrink-0" />
                    <span className="inline-flex px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[10px] sm:text-[11px] font-black ">
                      Return
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right Section: Price */}
            <div className="shrink-0 text-right pl-1 border-l border-gray-100 sm:border-0">
              <div className="font-[1000] text-blue-600 text-md sm:text-lg whitespace-nowrap">
                ₹{trip.fare}
              </div>
              {/* <div className="hidden xs:block text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                Amount
              </div> */}
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
              Fare
            </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default React.memo(Latest);
