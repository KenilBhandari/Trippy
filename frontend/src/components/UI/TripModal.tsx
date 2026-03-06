import { X, Calendar, Clock, Truck } from "lucide-react";
import type { Trip } from "../../types";
import { formatDate, formatTime } from "../../utils/FormatDate";
import ReturnTripBadge from "./ReturnTripBadge";

interface TripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

const TripModal = ({ trip, isOpen, onClose }: TripModalProps) => {
  if (!isOpen || !trip) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-[380px] rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Trip Details
            </h3>
            <p className="text-[11px] font-medium text-slate-400 tabular-nums mt-0.5">
              {trip._id.slice(-10).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Route — vertical timeline */}
          <div className="relative flex flex-col gap-5 pl-6">
            <div className="absolute left-[5px] top-2 bottom-5 w-[1.5px] bg-slate-300" />

            <div className="relative">
              <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-black -500 bg-white" />
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                From
              </label>
              <p
                title={trip.startPoint}
                className="text-[15px] font-black text-slate-900 leading-tight truncate"
              >
                {trip.startPoint}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600" />
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                To
              </label>
              <p
                title={trip.endPoint}
                className="text-[15px] font-black text-slate-900 leading-tight truncate"
              >
                {trip.endPoint}
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Date
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-slate-400 shrink-0" />
                <span className="text-[12px] font-bold text-slate-700 tabular-nums">
                  {formatDate(trip.tripDate)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Vehicle
              </span>
              <div className="flex items-center gap-1.5">
                <Truck size={12} className="text-slate-400 shrink-0" />
                <span className="text-[12px] font-black text-slate-800 uppercase tracking-wide">
                  {trip.numberPlate || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center justify-between py-4 border-t border-b border-slate-100">
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Total Fare
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400">₹</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                  {Number(trip.fare).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            {trip.returnTrip && (
              <ReturnTripBadge variant="full" />
            )}
          </div>

          {/* Footer timestamp */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <Clock size={11} />
            <span>
              Updated {formatDate(trip.updatedAt)} at{" "}
              {formatTime(trip.updatedAt)}
            </span>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full h-11 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
