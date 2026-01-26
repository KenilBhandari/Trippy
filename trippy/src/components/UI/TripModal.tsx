import { X, Calendar, Clock, CreditCard, Truck } from "lucide-react";
import type { Trip } from "../../types";
import { formatDate, formatTime } from "../../utils/FormatDate";

interface TripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

const TripModal = ({ trip, isOpen, onClose }: TripModalProps) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-[1000] text-gray-900 tracking-tight">
              Trip Details
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              ID: {trip._id.slice(-8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Visual Route + Vehicle Plate */}
          <div className="flex gap-6 items-center">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white z-10" />
                <div className="w-1.5 h-16 bg-slate-100 rounded-full relative overflow-hidden my-1">
                  <div className="absolute top-0 w-full h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-600 z-10" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Pickup
                  </p>
                  <p className="font-extrabold text-gray-800">
                    {trip.startPoint}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Drop-off
                  </p>
                  <p className="font-extrabold text-gray-800">
                    {trip.endPoint}
                  </p>
                </div>
              </div>
            </div>

            {/* The License Plate UI */}
            {trip.numberPlate && (
              <div className="ml-auto text-right">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Truck size={14} className="text-gray-500" />
                  <span className="text-sm font-[1000] text-gray-900 tracking-tight uppercase">
                    {trip.numberPlate}
                  </span>
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 mr-1">
                  Vehicle Number
                </p>
              </div>
            )}
          </div>

          {/* Trip Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Calendar size={16} className="text-blue-600 mb-2" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Trip Date
              </p>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(trip.tripDate)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Clock size={16} className="text-blue-600 mb-2" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Trip Time
              </p>
              <p className="text-sm font-bold text-gray-900">
                {formatTime(trip.createdAt)}
              </p>
            </div>

            {/* Audit Trail */}
            <div className="col-span-2 bg-slate-50/50 p-3 rounded-xl border border-dashed border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <Clock size={12} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Last Modified
                  </p>
                  <p className="text-[11px] font-bold text-gray-700">
                    {formatDate(trip.updatedAt)} at {formatTime(trip.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-gray-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-gray-500 uppercase">
                  Synced
                </span>
              </div>
            </div>
          </div>

          {/* Financial Footer */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white flex justify-between items-center shadow-lg shadow-blue-200">
            <div>
              <div className="flex items-center gap-2 opacity-80 mb-1">
                <CreditCard size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Total Fare
                </span>
              </div>
              <div className="text-3xl font-[1000]">₹{trip.fare}</div>
            </div>
            {trip.returnTrip && (
              <div className="bg-gray-100 text-black backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 text-[11px] font-black uppercase">
                Return Trip
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
