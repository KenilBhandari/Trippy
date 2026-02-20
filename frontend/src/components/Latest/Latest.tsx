import { ArrowRight, Calendar, Truck, Clock, ArrowUpDown } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { formatDate, formatTime } from "../../utils/FormatDate";
import React, { useState } from "react";
import type { Trip } from "../../types";
import TripModal from "../UI/TripModal";

const Latest = () => {
  const { last10Trips } = useDataContext();

  const last10Trips2: Trip[] = [
    {
      _id: "trip_001",
      tripDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      startPoint: "Ikeja",
      endPoint: "Victoria Island",
      returnTrip: false,
      fare: 8500,
      numberPlate: "5281",
      recent: "2 days ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      _id: "trip_002",
      tripDate: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      startPoint: "Lekki",
      endPoint: "Surulere",
      returnTrip: true,
      fare: 12000,
      numberPlate: "987ZT",
      recent: "1 day ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      _id: "trip_003",
      tripDate: Date.now(), // today
      startPoint: "Yaba",
      endPoint: "Ikoyi",
      returnTrip: false,
      fare: 6500,
      numberPlate: null,
      recent: "Today",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      _id: "trip_001",
      tripDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      startPoint: "Ikeja",
      endPoint: "Victoria Island",
      returnTrip: false,
      fare: 8500,
      numberPlate: "234XY",
      recent: "2 days ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      _id: "trip_002",
      tripDate: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      startPoint: "Lekki",
      endPoint: "Surulere",
      returnTrip: true,
      fare: 12000,
      numberPlate: "987ZT",
      recent: "1 day ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      _id: "trip_003",
      tripDate: Date.now(), // today
      startPoint: "Yaba",
      endPoint: "Ikoyi",
      returnTrip: false,
      fare: 6500,
      numberPlate: null,
      recent: "Today",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      _id: "trip_001",
      tripDate: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      startPoint: "Ikeja",
      endPoint: "Victoria Island",
      returnTrip: false,
      fare: 8500,
      numberPlate: "234XY",
      recent: "2 days ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      _id: "trip_002",
      tripDate: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      startPoint: "Lekki",
      endPoint: "Surulere",
      returnTrip: true,
      fare: 12000,
      numberPlate: "987ZT",
      recent: "1 day ago",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      _id: "trip_003",
      tripDate: Date.now(), // today
      startPoint: "Yaba",
      endPoint: "Ikoyi",
      returnTrip: false,
      fare: 6500,
      numberPlate: null,
      recent: "Today",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      _id: "trip_003",
      tripDate: Date.now(), // today
      startPoint: "Yaba",
      endPoint: "Ikoyi",
      returnTrip: false,
      fare: 6500,
      numberPlate: null,
      recent: "Today",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

return (
  <div className="bg-white border border-slate-300 rounded-lg w-full overflow-hidden">
    {/* Header */}
    <div className="px-6 py-3 bg-slate-200 border-b border-slate-300 flex items-center justify-between">
      <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
        Last 10 Trips
      </h2>
    </div>

    <div className="p-4 sm:p-5 bg-white">
      {last10Trips2.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 rounded-md">
          <Truck size={26} className="text-slate-300 mb-2" />
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-xs">
            No Records
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {last10Trips2.map((trip) => (
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

                <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-500 uppercase leading-none">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                      {formatDate(trip.tripDate)}
                  </div>

                  {trip.numberPlate && (
                    <div className="flex items-center bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded shadow-sm">
                      <Truck size={12} className="mr-1 text-slate-500" />
                      <span className="text-[10px] md:text-[11px] font-black text-slate-700 tracking-wider">
                        {trip.numberPlate}
                      </span>
                    </div>
                  )}

                  {trip.returnTrip && (
                    <span
                      className="flex items-center justify-center w-4 h-4 rounded-sm bg-blue-600 text-white shrink-0 shadow-sm"
                      title="Return Trip"
                    >
                      <ArrowUpDown size={10} strokeWidth={3} />
                    </span>
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
