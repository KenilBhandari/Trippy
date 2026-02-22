import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  Loader2,
  Check,
  ArrowUpDown,
  MapPin,
  Truck,
  ArrowRight,
  Calendar,
  XCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDataContext } from "../../context/TripContext";
import type { Trip } from "../../types";

type EditModalProps = {
  onUpdate: (updatedTrip: Trip) => Promise<void>;
};

const EditModal = ({ onUpdate }: EditModalProps) => {
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);

  const { startLocations, endLocations, activeTrip, setActiveTrip } =
    useDataContext();

  if (!activeTrip) return null;

  const handleChange = (field: keyof Trip, value: string | number) => {
    setActiveTrip({
      ...activeTrip,
      [field]: value,
    });
  };

  const handleUpdate = async () => {
    if (!activeTrip) return;

    try {
      setUpdating(true);
      setUpdateFailed(false);
      setUpdateSuccess(false);

      await onUpdate(activeTrip);

      setUpdateSuccess(true);

      // auto close after success
      setTimeout(() => {
        setActiveTrip(null);
        setUpdateSuccess(false);
      }, 900);
    } catch (error) {
      console.error(error);
      setUpdateFailed(true);
         setTimeout(() => {
           setUpdateFailed(false);
      }, 900);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (updateFailed) setUpdateFailed(false);
  }, [activeTrip]);

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
      onClick={() => setActiveTrip(null)}
    />

    {/* Modal Content */}
    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-300">
        <h2 className="text-base font-bold tracking-wide text-slate-900 uppercase">
          Edit Journey
        </h2>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Route Section */}
        <div className="space-y-4">
          {/* Start Point */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Starting Point
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin
                  size={18}
                  className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                />
              </div>
              <input
                type="text"
                value={activeTrip.startPoint || ""}
                placeholder="Enter origin..."
                onChange={(e) => {
                  handleChange("startPoint", e.target.value);
                  setShowStartSuggestions(false);
                }}
                onFocus={() => setShowStartSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowStartSuggestions(false), 200)
                }
                className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
              />
              {showStartSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] overflow-hidden">
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {startLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange("startPoint", loc)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-900 hover:text-white text-xs font-black uppercase transition-colors flex items-center justify-between group"
                      >
                        {loc}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Return Trip Toggle Connector */}
          <div className="flex items-center justify-center relative py-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-100"></div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTrip((prev: any) => ({
                  ...prev,
                  returnTrip: !prev.returnTrip,
                }));
              }}
              className={`relative z-10 ${activeTrip.returnTrip ? "bg-blue-600 text-white" : "bg-white text-slate-600"} p-2 rounded-md border-2 border-slate-300 md:hover:border-slate-900 transition-all shadow-sm active:scale-90`}
            >
              {activeTrip.returnTrip ? (
                <ArrowUpDown size={18} strokeWidth={3} />
              ) : (
                <ArrowDown size={18} strokeWidth={3} />
              )}
            </button>
          </div>

          {/* End Point */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Destination
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin
                  size={18}
                  className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                />
              </div>
              <input
                type="text"
                value={activeTrip.endPoint || ""}
                placeholder="Enter destination..."
                onChange={(e) => {
                  handleChange("endPoint", e.target.value);
                  setShowEndSuggestions(false);
                }}
                onFocus={() => setShowEndSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEndSuggestions(false), 200)
                }
                className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
              />
              {showEndSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] overflow-hidden">
                  <div className="max-h-44 overflow-y-auto divide-y divide-slate-100">
                    {endLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange("endPoint", loc)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-900 hover:text-white text-xs font-black uppercase transition-colors flex items-center justify-between group"
                      >
                        {loc}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fare Section */}
        <div className="flex flex-col gap-1.5 pt-2">
          <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Fare Amount
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 font-black text-slate-400 text-xl italic">
              ₹
            </div>
            <input
              type="number"
              value={activeTrip.fare}
              onChange={(e) => handleChange("fare", Number(e.target.value))}
              placeholder="0.00"
              className="w-full font-black text-base pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Trip Date */}
          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Trip Date
            </label>
            <DatePicker
              selected={new Date(activeTrip.tripDate)}
              onChange={(date: Date | null) => {
                if (date) handleChange("tripDate", date.getTime());
              }}
              maxDate={new Date()}
              popperPlacement="bottom-start"
              wrapperClassName="w-full"
              customInput={
                <button className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-sm font-black text-slate-900 hover:border-slate-400 transition-all">
                  {new Date(activeTrip.tripDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                  <Calendar size={18} className="text-slate-400" />
                </button>
              }
            />
          </div>

          {/* Vehicle Number */}
          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Vehicle No.
            </label>
            <div className="relative flex items-center">
              <Truck className="absolute left-3 text-slate-400" size={18} />
              <input
                type="text"
                value={activeTrip.numberPlate ?? ""}
                placeholder="GJ 15 AB 1234"
                onChange={(e) =>
                  handleChange("numberPlate", e.target.value.toUpperCase())
                }
                className="w-full font-black text-sm pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 uppercase focus:bg-white focus:border-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTrip(null)}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating || updateSuccess}
            className={`flex-[2] py-4 font-black text-xs uppercase tracking-[0.3em] rounded-lg transition-all duration-200 flex items-center justify-center gap-3
              ${
                updateFailed
                  ? "bg-red-600 text-white shadow-lg shadow-red-100"
                  : updateSuccess
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : updating
                      ? "bg-slate-400 text-white cursor-wait"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 active:translate-y-[2px]"
              }
            `}
          >
            {updating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : updateSuccess ? (
              <Check className="h-5 w-5" strokeWidth={3} />
            ) : updateFailed ? (
              <XCircle className="h-5 w-5" />
            ) : null}
            {updating
              ? "Saving"
              : updateSuccess
                ? "Saved"
                : updateFailed
                  ? "Failed"
                  : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default React.memo(EditModal);
